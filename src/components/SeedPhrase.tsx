import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/colors';

interface SeedPhraseProps {
  words: string[];
  editable?: boolean;
  onWordChange?: (index: number, word: string) => void;
  onKeyPress?: (index: number, key: string) => void;
  isLoading?: boolean;
  hidden?: boolean;
}

export function SeedPhrase({
  words,
  editable = false,
  onWordChange,
  onKeyPress,
  isLoading = false,
  hidden = false,
}: SeedPhraseProps) {
  const inputRefs = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);

  const handleWordChange = (index: number, text: string) => {
    if (!editable || !onWordChange) return;
    onWordChange(index, text);
  };

  const handleKeyPress = (index: number, key: string) => {
    if (!editable) return;
    if (onKeyPress) {
      onKeyPress(index, key);
    } else if (key === 'Backspace' && !words[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating secure seed phrase...</Text>
        </View>
      </View>
    );
  }

  const getDisplayWord = (word: string) => {
    if (!hidden || !word) return word;
    return '••••••';
  };

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <View key={index} style={styles.wordItem}>
          <Text style={styles.wordNumber}>{index + 1}</Text>
          {editable ? (
            <TextInput
              ref={ref => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.wordInput}
              value={word}
              onChangeText={text => handleWordChange(index, text)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              placeholder=""
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              secureTextEntry={hidden}
              returnKeyType={index === words.length - 1 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index < words.length - 1) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
            />
          ) : (
            <Text style={styles.wordText}>{getDisplayWord(word)}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 24,
  },
  wordItem: {
    width: '31.33%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    margin: '1%',
  },
  wordNumber: {
    color: colors.textTertiary,
    fontSize: 14,
    marginRight: 6,
  },
  wordText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  wordInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});