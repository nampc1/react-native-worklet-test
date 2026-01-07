import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // Add any real initialization here (e.g. font loading) if needed
      // For now, just a small delay to prevent flickering before redirect
      setTimeout(() => {
        setIsReady(true);
      }, 500);
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initialRoute = '/onboarding';
  
  return <Redirect href={initialRoute} />;
}
