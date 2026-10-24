import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session: LIPsession, isLoading: LIPisLoading } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!LIPisLoading && !LIPsession}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!LIPisLoading && Boolean(LIPsession)}>
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