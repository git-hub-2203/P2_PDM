import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

const LIP_SESSION_KEY = '@LIP_sessao';

interface LIPAuthContextValue {
  session: string | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const LIPAuthContext = createContext<LIPAuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [LIPsession, setLIPsession] = useState<string | null>(null);
  const [LIPisLoading, setLIPisLoading] = useState(true);

  useEffect(() => {
    async function LIPcarregarSessao() {
      try {
        setLIPsession(await AsyncStorage.getItem(LIP_SESSION_KEY));
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setLIPisLoading(false);
      }
    }

    LIPcarregarSessao();
  }, []);

  const LIPsignIn = useCallback(async (LIPemail: string) => {
    await AsyncStorage.setItem(LIP_SESSION_KEY, LIPemail);
    setLIPsession(LIPemail);
  }, []);

  const LIPsignOut = useCallback(async () => {
    await AsyncStorage.removeItem(LIP_SESSION_KEY);
    setLIPsession(null);
  }, []);

  const LIPvalue = useMemo(
    () => ({
      session: LIPsession,
      isLoading: LIPisLoading,
      signIn: LIPsignIn,
      signOut: LIPsignOut,
    }),
    [LIPsession, LIPisLoading, LIPsignIn, LIPsignOut]
  );

  return <LIPAuthContext.Provider value={LIPvalue}>{children}</LIPAuthContext.Provider>;
}

export function useAuth() {
  const LIPvalue = useContext(LIPAuthContext);
  if (!LIPvalue) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return LIPvalue;
}
