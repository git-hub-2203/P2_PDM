import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={LIPstyles.container}>
        <Text style={LIPstyles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={LIPstyles.link}>
          <Text style={LIPstyles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const LIPstyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
