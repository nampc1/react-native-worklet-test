import { BalanceDisplay } from '@/components/dashboard/BalanceDisplay';
import { useWallet } from '@/hooks/use-wallet';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Settings,
  Wallet,
  Star,
  Shield,
  Palette,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    wallet,
    totalBalanceUSD,
    balances,
    transactions,
    isLoading,
    refreshWallet,
  } = useWallet();

  const handleSendPress = () => router.push('/send/select-token');
  const handleReceivePress = () => router.push('/receive/select-token');
  const handleScanPress = () => router.push('/scan-qr');
  const handleSettingsPress = () => router.push('/settings');

  // Hardcoded suggestions from original repo
  const suggestions = [
    { id: 1, icon: Star, title: 'Star repo on GitHub', color: colors.primary },
    { id: 2, icon: Shield, title: 'WDK Docs', color: colors.primary },
    { id: 3, icon: Palette, title: 'UI Kit', color: colors.primary },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.walletInfo}>
          <View style={styles.walletAvatar}>
            <Wallet size={16} color={colors.background} />
          </View>
          <Text style={styles.walletName}>{wallet?.name || 'My Wallet'}</Text>
        </View>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}>
          <Settings size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshWallet}
            tintColor={colors.primary}
          />
        }
      >
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <BalanceDisplay
            value={totalBalanceUSD}
            currency="USD"
            isLoading={isLoading}
          />
        </View>

        {/* Assets List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assets</Text>
          {balances.map((asset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.assetRow}
              onPress={() =>
                router.push({
                  pathname: '/token-details',
                  params: { token: asset.symbol },
                })
              }
            >
              <View style={[styles.assetIcon, { backgroundColor: asset.color }]}>
                {/* Use Image if available in mock, otherwise fallback */}
                {asset.icon ? (
                   <Image source={asset.icon} style={{ width: 24, height: 24 }} resizeMode="contain" />
                ) : (
                   <Text style={{ fontSize: 16 }}>{asset.symbol[0]}</Text>
                )}
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.token}</Text>
                <Text style={styles.assetSymbol}>{asset.symbol}</Text>
              </View>
              <View style={styles.assetBalance}>
                <Text style={styles.balanceText}>{asset.balance} {asset.symbol}</Text>
                <Text style={styles.fiatText}>
                  ${asset.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggestions (Horizontal Scroll) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionList}>
            {suggestions.map((item) => (
              <TouchableOpacity key={item.id} style={styles.suggestionCard}>
                <item.icon size={24} color={item.color} style={{ marginBottom: 8 }} />
                <Text style={styles.suggestionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Activity List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: colors.card }]}>
                {tx.type === 'sent' ? (
                  <ArrowUpRight size={20} color={colors.danger} />
                ) : (
                  <ArrowDownLeft size={20} color={colors.success} />
                )}
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txType}>
                  {tx.type === 'sent' ? 'Sent' : 'Received'} {tx.token}
                </Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={styles.txAmount}>
                {tx.type === 'sent' ? '-' : '+'}
                {tx.amount} {tx.token}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={[styles.actionBar, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSendPress}>
          <ArrowUpRight size={24} color={colors.white} />
          <Text style={styles.actionLabel}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
          <QrCode size={28} color={colors.black} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleReceivePress}>
          <ArrowDownLeft size={24} color={colors.white} />
          <Text style={styles.actionLabel}>Receive</Text>
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
    paddingBottom: 16,
    backgroundColor: colors.background, // Opaque for sticky feel if needed
    zIndex: 10,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  walletAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  walletName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  // Assets
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary, // Using primary as default border
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  assetSymbol: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  assetBalance: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  fiatText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Suggestions
  suggestionList: {
    marginHorizontal: -20, // offset parent padding
    paddingHorizontal: 20,
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  // Activity
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txType: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  txDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  // Floating Action Bar
  actionBar: {
    position: 'absolute',
    left: 40,
    right: 40,
    backgroundColor: '#1C1C1E', // Dark card
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 32,
    height: 72,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24, // Pop out effect
    borderWidth: 4,
    borderColor: colors.background, // Match background to look floating
  },
});