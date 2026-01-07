import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface WordPosition {
  position: number;
  word: string;
  options: string[];
}

export default function ConfirmPhraseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    mnemonic?: string;
    walletName?: string;
  }>();
  const [selectedWords, setSelectedWords] = useState<{ [key: number]: string }>({});
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);

  useEffect(() => {
    // Parse mnemonic from params
    const mnemonicString = params.mnemonic as string;
    if (mnemonicString) {
      const words = mnemonicString.split(',');

      // Select 3 random positions to verify
      const positions = [2, 5, 8]; // Word #3, #6, #9
      const verificationWords: WordPosition[] = positions.map(pos => {
        const correctWord = words[pos] || 'apple';
        // Generate fake options
        const fakeWords = [
          'galaxy', 'wave', 'stardust', 'whisper', 'nebula', 
          'resonance', 'comet', 'current', 'flow', 'zenith'
        ].filter(w => w !== correctWord);

        // Shuffle options
        const options = [correctWord, fakeWords[0], fakeWords[1]].sort(() => Math.random() - 0.5);

        return {
          position: pos + 1, // 1-indexed for display
          word: correctWord,
          options: options,
        };
      });

      setWordPositions(verificationWords);
    }
  }, [params.mnemonic]);

  const handleWordSelect = (position: number, word: string) => {
    setSelectedWords(prev => ({
      ...prev,
      [position]: word,
    }));
  };

  const isAllSelected = () => {
    return wordPositions.every(wp => selectedWords[wp.position] !== undefined);
  };

  const isCorrect = () => {
    return wordPositions.every(wp => selectedWords[wp.position] === wp.word);
  };

  const handleNext = () => {
    // --- BYPASS VALIDATION FOR DEMO ---
    // Uncomment these checks if you want to enforce the game logic
    /*
    if (!isAllSelected()) {
      Alert.alert('Select All Words', 'Please select all the required words to continue.');
      return;
    }

    if (!isCorrect()) {
      Alert.alert('Incorrect Words', 'Some words are incorrect. Please try again.');
      return;
    }
    */
    // ----------------------------------

    router.push({
      pathname: './complete',
      params: {
        walletName: params.walletName,
        mnemonic: params.mnemonic,
      },
    });
  };

  const getButtonStyle = (position: number, word: string) => {
    const selected = selectedWords[position] === word;
    if (selected) {
       return [styles.wordOption, styles.wordOptionSelected];
    }
    return styles.wordOption;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Confirm your secret phrase</Text>

        {wordPositions.map(wp => (
          <View key={wp.position} style={styles.wordSection}>
            <Text style={styles.wordLabel}>Word #{wp.position}</Text>
            <View style={styles.optionsContainer}>
              {wp.options.map(option => (
                <TouchableOpacity
                  key={`${wp.position}-${option}`}
                  style={getButtonStyle(wp.position, option)}
                  onPress={() => handleWordSelect(wp.position, option)}
                >
                  <Text
                    style={[
                      styles.wordOptionText,
                      selectedWords[wp.position] === option && styles.wordOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    marginBottom: 32,
  },
  wordSection: {
    marginBottom: 28,
  },
  wordLabel: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  wordOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  wordOptionSelected: {
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderColor: colors.primary,
  },
  wordOptionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  wordOptionTextSelected: {
    color: colors.primary,
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
});