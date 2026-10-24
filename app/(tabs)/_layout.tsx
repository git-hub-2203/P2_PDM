import { Tabs } from 'expo-router';
import FallbackIcon from '@/components/FallbackIcon';

export default function TabLayoutLIP() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8a99c0',
        headerTitleAlign: 'center',
        headerTintColor: '#ffffff',
        headerStyle: {
          backgroundColor: '#172b6e',
        },
        tabBarStyle: {
          backgroundColor: '#172b6e',
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FallbackIcon name="home" size={24} color={typeof color === 'string' ? color : '#ffffff'} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => (
            <FallbackIcon name="shopping-cart" size={24} color={typeof color === 'string' ? color : '#ffffff'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FallbackIcon name="person" size={24} color={typeof color === 'string' ? color : '#ffffff'} />
          ),
        }}
      />
    </Tabs>
  );
}