import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

export default function CompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ walletName: string; mnemonic: string }>();
  
  // Local state to simulate creation process
  const [walletCreated, setWalletCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const walletName = params.walletName || 'My Wallet';
    const mnemonic = params.mnemonic.split(',').join(' ');
    
    console.log('walletName', walletName);
    console.log('mnemonic', mnemonic);
    // Simulate wallet creation delay
    const timer = setTimeout(() => {
      setWalletCreated(true);
      setIsLoading(false);
    }, 2000); // 2 second fake delay

    return () => clearTimeout(timer);
  }, []);

  const handleGoToWallet = () => {
    if (!walletCreated) return;
    
    // Navigate to the Dashboard and reset the stack so they can't go back to setup
    // Using dismissAll to clear the setup modal stack if it was presented that way
    // But since we are in a stack, replace is good.
    router.dismissAll(); 
    router.replace('/wallet');
  };

  const generalLoadingStatus = !walletCreated || isLoading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {generalLoadingStatus ? 'Creating Your Wallet...' : "You're All Set!"}
        </Text>
        <Text style={styles.subtitle}>
          {generalLoadingStatus
            ? 'Setting up your secure multi-chain wallet. This will only take a moment...'
            : 'Your wallet is ready to use. Start exploring and managing your crypto securely.'}
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.button, generalLoadingStatus && styles.buttonDisabled]}
          onPress={handleGoToWallet}
          disabled={generalLoadingStatus}
        >
          <Text style={[styles.buttonText, generalLoadingStatus && styles.buttonTextDisabled]}>
            {generalLoadingStatus ? 'Creating Wallet...' : 'Go To Wallet'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  buttonDisabled: {
    backgroundColor: colors.card,
  },
  buttonTextDisabled: {
    color: colors.textTertiary,
  },
});