import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { Platform } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      {Platform.OS === 'android' ? <NavigationBar hidden /> : null}
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
            headerStyle: { backgroundColor: Colors.light.background },
            headerTintColor: Colors.light.primaryDark,
            headerTitleStyle: { color: Colors.light.text, fontWeight: '700' },
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="edit2"
          options={{
            title: 'Editar Telefone',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTintColor: Colors.light.primaryDark,
            headerTitleStyle: { color: Colors.light.text, fontWeight: '700' },
            headerTitleAlign: 'center',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="edit3"
          options={{
            title: 'Editar Pagamento',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTintColor: Colors.light.primaryDark,
            headerTitleStyle: { color: Colors.light.text, fontWeight: '700' },
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