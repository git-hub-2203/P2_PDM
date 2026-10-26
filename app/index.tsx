import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect, type Href } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export default function IndexScreen() {
  const { session: LIPsession, isLoading: LIPisLoading } = useAuth();

  if (LIPisLoading) {
    return (
      <View style={LIPstyles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  const LIPdestino: Href = LIPsession ? '/(tabs)' : ('/login' as Href);
  return <Redirect href={LIPdestino} />;
}

const LIPstyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
});
