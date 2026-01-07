import { colors } from '@/constants/colors';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BalanceDisplayProps {
  value: number;
  currency?: string;
  isLoading?: boolean;
}

export function BalanceDisplay({
  value,
  currency = 'USD',
  isLoading = false,
}: BalanceDisplayProps) {
  const [showBalance, setShowBalance] = useState(true);

  if (isLoading) {
    // Simple placeholder while loading
    return (
      <View style={styles.container}>
        <View style={styles.skeleton} />
      </View>
    );
  }

  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        {showBalance ? (
          <Text style={styles.valueText}>{formattedValue}</Text>
        ) : (
          <Text style={styles.hiddenText}>******</Text>
        )}
      </View>

      <Text style={styles.currencyText}>{currency}</Text>

      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowBalance(!showBalance)}
        activeOpacity={0.7}
      >
        {showBalance ? (
          <EyeOff size={20} color={colors.textSecondary} />
        ) : (
          <Eye size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },
  valueContainer: {
    justifyContent: 'flex-end',
  },
  valueText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 48, // Adjust line height to align with currency
  },
  hiddenText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 48,
    letterSpacing: 2,
    marginTop: 8, // Visual adjustment for stars
  },
  currencyText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8, // Align baseline with value
    marginLeft: 4,
    fontWeight: '600',
  },
  eyeButton: {
    marginLeft: 12,
    marginBottom: 8, // Align with currency
    padding: 4,
  },
  skeleton: {
    height: 48,
    width: 200,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
});