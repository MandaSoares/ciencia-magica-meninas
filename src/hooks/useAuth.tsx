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
  ) => Promise<{ error: Error | null; message?: string; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; message?: string; unconfirmed?: boolean }>;
  resendConfirmation: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}

// Mensagens genéricas: não revelam se um email já está cadastrado.
export const authErrorMessage = (error: { message?: string; status?: number } | null): string => {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email ou senha incorretos.';
  if (msg.includes('email not confirmed')) return 'Confirme seu email pelo link que enviamos antes de entrar.';
  if (msg.includes('rate limit') || error?.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (msg.includes('password') && (msg.includes('weak') || msg.includes('pwned') || msg.includes('leaked')))
    return 'Essa senha é fraca ou já apareceu em vazamentos. Escolha outra.';
  if (msg.includes('captcha')) return 'Não foi possível verificar que você não é um robô. Tente de novo.';
  if (msg.includes('already registered') || msg.includes('already exists'))
    return 'Não foi possível criar a conta com esse email. Se você já tem conta, entre ou recupere a senha.';
  if (msg.includes('invalid') && msg.includes('email')) return 'Esse email não parece válido. Confira se digitou certo.';
  if (msg.includes('fetch') || msg.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return 'Não foi possível concluir. Tente novamente em instantes.';
};

// Campos que a usuária pode alterar (o banco também restringe via GRANT).
const EDITABLE_PROFILE_FIELDS = ['name', 'age', 'interests', 'profile_image'] as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
        setSession(session);
        setUser(session?.user ?? null);

        // Defer profile fetch with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
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
        fetchProfile(session.user.id).then((profile) => {
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
      return { error, message: authErrorMessage(error) };
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

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return !error;
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
