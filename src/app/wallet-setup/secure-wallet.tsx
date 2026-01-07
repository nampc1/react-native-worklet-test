import { SeedPhrase } from '@/components/SeedPhrase';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, ChevronLeft, Copy, Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { colors } from '@/constants/colors';

// Hardcoded sample phrase for demo
const MOCK_PHRASE = 'abandon ability able about above absent absorb abstract absurd abuse access accident';

export default function SecureWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    walletName?: string;
  }>();
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [showPhrase, setShowPhrase] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateMnemonic();
  }, []);

  const generateMnemonic = async () => {
    setIsGenerating(true);
    // Simulate delay
    setTimeout(() => {
      setMnemonic(MOCK_PHRASE.split(' '));
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopyPhrase = async () => {
    const phraseText = mnemonic.join(' ');
    await Clipboard.setStringAsync(phraseText);
    toast.success('Secret phrase copied to clipboard');
  };

  const handleToggleVisibility = () => {
    setShowPhrase(!showPhrase);
  };

  const handleNext = () => {
    // Pass wallet data to next screen
    router.push({
      pathname: '/wallet-setup/confirm-phrase',
      params: {
        mnemonic: mnemonic.join(','),
        walletName: params.walletName,
      },
    });
  };

  const PhraseVisibilityIcon = showPhrase ? EyeOff : Eye;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Secure Your Wallet</Text>
        <Text style={styles.subtitle}>
          This secret phrase is the only way to recover your wallet. Store it safely.
        </Text>

        <View style={styles.warningBox}>
          <AlertCircle size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            Never share your secret phrase with anyone! Anyone with this phrase can access your
            wallet.
          </Text>
        </View>

        <SeedPhrase
          words={mnemonic}
          editable={false}
          isLoading={isGenerating}
          hidden={!showPhrase}
        />

        {!isGenerating && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopyPhrase}>
              <Copy size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Copy Phrase</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleToggleVisibility}>
              <PhraseVisibilityIcon size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>
                {showPhrase ? 'Hide Phrase' : 'Show Phrase'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.nextButton, isGenerating && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isGenerating}
        >
          <Text style={[styles.nextButtonText, isGenerating && styles.nextButtonTextDisabled]}>
            Next
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: colors.warningBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  warningText: {
    flex: 1,
    color: colors.warning,
    fontSize: 14,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tintedBackground,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
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
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  nextButtonTextDisabled: {
    color: colors.textTertiary,
  },
});