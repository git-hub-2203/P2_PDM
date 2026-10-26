import { Tabs } from 'expo-router';
import FallbackIcon from '@/components/FallbackIcon';
import Colors from '@/constants/Colors';

export default function TabLayoutLIP() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primaryDark,
        tabBarInactiveTintColor: Colors.light.textMuted,
        headerTitleAlign: 'center',
        headerTintColor: Colors.light.primaryDark,
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTitleStyle: {
          color: Colors.light.text,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopColor: Colors.light.border,
          borderTopWidth: 1,
          height: 66,
          paddingTop: 7,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FallbackIcon
              name="home"
              size={24}
              color={typeof color === 'string' ? color : Colors.light.primaryDark}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => (
            <FallbackIcon
              name="shopping-cart"
              size={24}
              color={typeof color === 'string' ? color : Colors.light.primaryDark}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FallbackIcon
              name="person"
              size={24}
              color={typeof color === 'string' ? color : Colors.light.primaryDark}
            />
          ),
        }}
      />
    </Tabs>
  );
}