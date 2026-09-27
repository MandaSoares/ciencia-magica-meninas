import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  age: number | null;
  interests: string[];
  profile_image: string | null;
}

export interface AuthResult {
  error: Error | null;
  message?: string;
}

export interface LinkNotice {
  kind: 'confirmed' | 'error';
  message: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    age: number,
    consents: { terms: boolean; guardian: boolean }
  ) => Promise<AuthResult & { needsConfirmation?: boolean; alreadyRegistered?: boolean }>;
  signIn: (email: string, password: string) => Promise<AuthResult & { unconfirmed?: boolean }>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  verifyEmailCode: (email: string, code: string) => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  verifyRecoveryCode: (email: string, code: string) => Promise<AuthResult>;
  /** Aviso vindo de um link de email (confirmado, expirado, inválido) */
  linkNotice: LinkNotice | null;
  clearLinkNotice: () => void;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}

type AuthErrorLike = { message?: string; status?: number; code?: string } | null;

/** Traduz os erros do Supabase Auth para mensagens claras em português. */
export const authErrorMessage = (error: AuthErrorLike): string => {
  const msg = (error?.message || '').toLowerCase();
  const code = error?.code || '';

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials'))
    return 'Email ou senha incorretos.';
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed'))
    return 'Seu email ainda não foi confirmado.';
  if (code === 'otp_expired' || msg.includes('expired'))
    return 'Esse código expirou. Peça um novo.';
  if (code === 'otp_disabled' || (msg.includes('token') && msg.includes('invalid')))
    return 'Código incorreto. Confira os números e tente de novo.';
  if (code === 'over_email_send_rate_limit' || msg.includes('email rate limit'))
    return 'Enviamos emails demais em pouco tempo. Aguarde alguns minutos e tente de novo.';
  if (code === 'over_request_rate_limit' || msg.includes('rate limit') || error?.status === 429)
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
  if (msg.includes('for security purposes'))
    return 'Aguarde alguns segundos antes de pedir outro email.';
  if (code === 'weak_password' || msg.includes('password should') || msg.includes('pwned') || msg.includes('leaked'))
    return 'Essa senha não é aceita. Use pelo menos 8 caracteres com maiúscula, minúscula, número e um símbolo (ex.: ! @ #).';
  if (code === 'same_password' || msg.includes('different from the old'))
    return 'A nova senha precisa ser diferente da anterior.';
  if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered'))
    return 'Já existe uma conta com esse email.';
  if (code === 'email_address_invalid' || (msg.includes('invalid') && msg.includes('email')))
    return 'Esse email não parece válido. Confira se digitou certo.';
  if (code === 'signup_disabled' || msg.includes('signups not allowed'))
    return 'Novos cadastros estão pausados no momento.';
  if (msg.includes('error sending') || msg.includes('smtp'))
    return 'Não conseguimos enviar o email agora. Tente de novo em alguns minutos.';
  if (msg.includes('database error'))
    return 'Não conseguimos salvar seu cadastro. Tente de novo; se continuar, fale com a equipe.';
  if (msg.includes('captcha'))
    return 'Não foi possível verificar que você não é um robô. Tente de novo.';
  if (msg.includes('fetch') || msg.includes('network'))
    return 'Sem conexão com o servidor. Verifique sua internet.';
  return 'Não foi possível concluir. Tente novamente em instantes.';
};

/**
 * Lê o resultado de um link de email (confirmação/recuperação) que o
 * Supabase coloca no endereço (#... ou ?...), antes de o cliente limpá-lo.
 */
const readLinkNotice = (): LinkNotice | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(
    [window.location.hash.replace(/^#/, ''), window.location.search.replace(/^\?/, '')].join('&')
  );
  const errorCode = params.get('error_code') || params.get('error');
  if (errorCode) {
    const expired = errorCode.includes('expired') || (params.get('error_description') || '').toLowerCase().includes('expired');
    // limpa o endereço para o aviso não voltar ao recarregar
    window.history.replaceState(null, '', window.location.pathname);
    return {
      kind: 'error',
      message: expired
        ? 'Esse link expirou ou já foi usado. Entre com seu email e senha; se precisar, peça um novo código.'
        : 'Esse link não é válido. Entre com seu email e senha ou peça um novo código.',
    };
  }
  if (params.get('type') === 'signup' || params.get('type') === 'email') {
    return { kind: 'confirmed', message: 'Email confirmado! Bem-vinda ao Conscientistas 💜' };
  }
  return null;
};

const INITIAL_LINK_NOTICE = readLinkNotice();

// Campos que a usuária pode alterar (o banco também restringe via GRANT).
const EDITABLE_PROFILE_FIELDS = ['name', 'age', 'interests', 'profile_image'] as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [linkNotice, setLinkNotice] = useState<LinkNotice | null>(INITIAL_LINK_NOTICE);

  const fetchProfile = async (authUser: User): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    if (data) return data as Profile;

    // Conta sem perfil (ex.: criada antes do trigger): cria o perfil agora,
    // senão a usuária entra e fica presa na tela de login.
    const meta = authUser.user_metadata || {};
    const fallbackName = String(meta.name || authUser.email?.split('@')[0] || 'Estudante').slice(0, 100);
    const age = Number(meta.age);
    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: authUser.email ?? '',
        name: fallbackName,
        age: Number.isFinite(age) && age >= 4 && age <= 120 ? age : null,
      })
      .select('*')
      .maybeSingle();
    if (insertError) {
      console.error('Error creating missing profile:', insertError);
      return null;
    }
    return created as Profile | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
        if (event === 'SIGNED_IN' && INITIAL_LINK_NOTICE?.kind === 'confirmed') {
          window.history.replaceState(null, '', window.location.pathname);
        }
        setSession(session);
        setUser(session?.user ?? null);

        // Defer profile fetch with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user).then((profile) => {
          setProfile(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    age: number,
    consents: { terms: boolean; guardian: boolean }
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    // Nome, idade e consentimentos vão como metadata e são gravados pelo
    // trigger handle_new_user (funciona com confirmação de email ligada).
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          age,
          terms_accepted: consents.terms,
          guardian_consent: consents.guardian,
        }
      }
    });

    if (error) {
      return { error, message: authErrorMessage(error), alreadyRegistered: error.code === 'user_already_exists' };
    }

    // Com confirmação de email ligada, o Supabase NÃO retorna erro para email
    // já cadastrado: devolve um usuário sem "identities" e não envia email.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        error: new Error('already_registered'),
        message: 'Já existe uma conta com esse email.',
        alreadyRegistered: true,
      };
    }

    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      return {
        error,
        message: authErrorMessage(error),
        unconfirmed: error.message.toLowerCase().includes('email not confirmed'),
      };
    }

    return { error: null };
  };

  const resendConfirmation = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return error ? { error, message: authErrorMessage(error) } : { error: null };
  };

  // Código de 6 dígitos do email de confirmação (funciona mesmo quando o
  // link é aberto em outro aparelho ou "consumido" por antivírus de email).
  const verifyEmailCode = async (email: string, code: string): Promise<AuthResult> => {
    const token = code.replace(/\D/g, '');
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type: 'signup',
    });
    if (!error) {
      toast.success('Email confirmado! Bem-vinda ao Conscientistas 💜');
      return { error: null };
    }
    return { error, message: authErrorMessage(error) };
  };

  const sendPasswordReset = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`,
    });
    // Não revela se a conta existe: só reporta limites de envio.
    if (error && (error.status === 429 || /rate limit|security purposes/i.test(error.message))) {
      return { error, message: authErrorMessage(error) };
    }
    return { error: null };
  };

  // Código do email de recuperação → abre a tela de nova senha (evento PASSWORD_RECOVERY).
  const verifyRecoveryCode = async (email: string, code: string): Promise<AuthResult> => {
    const token = code.replace(/\D/g, '');
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type: 'recovery',
    });
    if (!error) {
      setIsPasswordRecovery(true);
      return { error: null };
    }
    return { error, message: authErrorMessage(error) };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast.success('Logout realizado com sucesso!');
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    const payload = Object.fromEntries(
      Object.entries(data).filter(([key]) => (EDITABLE_PROFILE_FIELDS as readonly string[]).includes(key))
    ) as Partial<Profile>;
    if (Object.keys(payload).length === 0) return;

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      toast.error(
        error.message.includes('imagem_invalida') ? 'Imagem de perfil inválida.'
        : error.message.includes('nome_invalido') ? 'Nome inválido (1 a 100 caracteres).'
        : 'Erro ao atualizar perfil'
      );
      return;
    }

    setProfile(prev => prev ? { ...prev, ...payload } : null);
    toast.success('Perfil atualizado!');
  };

  // LGPD: exclusão definitiva da conta e de todos os dados.
  const deleteAccount = async () => {
    if (!user) return false;

    // 1) Apaga as fotos da pasta da usuária (Storage API)
    const { data: files } = await supabase.storage.from('profile-images').list(user.id, { limit: 100 });
    if (files && files.length > 0) {
      await supabase.storage.from('profile-images').remove(files.map(f => `${user.id}/${f.name}`));
    }

    // 2) Apaga usuária + dados (cascade no banco)
    const { error } = await supabase.rpc('delete_my_account');
    if (error) {
      console.error('Error deleting account:', error);
      toast.error('Não foi possível excluir a conta. Tente novamente ou fale com a equipe.');
      return false;
    }

    await supabase.auth.signOut();
    setProfile(null);
    toast.success('Sua conta e seus dados foram excluídos.');
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      resendConfirmation,
      verifyEmailCode,
      sendPasswordReset,
      verifyRecoveryCode,
      linkNotice,
      clearLinkNotice: () => setLinkNotice(null),
      signOut,
      updateProfile,
      deleteAccount,
      isPasswordRecovery,
      clearPasswordRecovery: () => setIsPasswordRecovery(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
