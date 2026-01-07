import { useWallet } from '@/hooks/use-wallet';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { colors } from '@/constants/colors';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ImportNameWalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { createWallet } = useWallet();
  const [walletName, setWalletName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Get the seed phrase from navigation params
  const seedPhrase = params.seedPhrase ? decodeURIComponent(params.seedPhrase as string) : '';

  const handleNext = async () => {
    if (!seedPhrase) {
      Alert.alert('Error', 'No seed phrase provided. Please go back and enter your seed phrase.');
      return;
    }

    setIsImporting(true);

    try {
      // Use the context's createWallet method
      await createWallet({ name: walletName, mnemonic: seedPhrase });

      toast.success('Your wallet has been imported successfully.');

      // Reset stack and go to wallet
      router.dismissAll();
      router.replace('/wallet');
    } catch (error: any) {
      console.error('Import wallet error:', error);
      Alert.alert(
        'Import Failed',
        'Failed to import wallet. Please check your seed phrase and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsImporting(false);
    }
  };

  const isNextDisabled = walletName.length === 0 || isImporting;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Name Your Wallet</Text>
          <Text style={styles.subtitle}>This name is just for you and can be changed later.</Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Wallet Name*</Text>
            <View style={styles.inputContainer}>
              <Wallet size={20} color={colors.textTertiary} style={{ marginRight: 12 }} />
              <TextInput
                style={styles.input}
                value={walletName}
                onChangeText={setWalletName}
                placeholder="e.g., Main Wallet"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="words"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          {isImporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.textTertiary} />
              <Text
                style={[
                  styles.nextButtonText,
                  isNextDisabled && styles.nextButtonTextDisabled,
                  { marginLeft: 8 },
                ]}
              >
                Importing...
              </Text>
            </View>
          ) : (
            <Text style={[styles.nextButtonText, isNextDisabled && styles.nextButtonTextDisabled]}>
              Import Wallet
            </Text>
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.card,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  nextButtonTextDisabled: {
    color: colors.textTertiary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});