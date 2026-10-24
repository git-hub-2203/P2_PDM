import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    void Promise.all([
      AntDesign.loadFont(),
      Entypo.loadFont(),
      Feather.loadFont(),
      Ionicons.loadFont(),
    ]).catch((error) => {
      console.warn('Erro ao carregar ícones do app:', error);
    });
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!isLoading && !session}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && Boolean(session)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="edit1"
          options={{
            title: 'Editar Endereço',
            headerStyle: { backgroundColor: '#172b6e' },
            headerTintColor: '#ffffff',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="edit2"
          options={{
            title: 'Editar Telefone',
            headerStyle: { backgroundColor: '#172b6e' },
            headerTintColor: '#ffffff',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="edit3"
          options={{
            title: 'Editar Pagamento',
            headerStyle: { backgroundColor: '#172b6e' },
            headerTintColor: '#ffffff',
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen name="produtos/[id]" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}