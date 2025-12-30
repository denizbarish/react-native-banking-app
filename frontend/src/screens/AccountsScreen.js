import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import LoanScreen from './LoanScreen';
import { Surface, ActivityIndicator, Avatar, IconButton, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function AccountsScreen({ 
  accounts, 
  loading, 
  refreshing, 
  onRefresh, 
  selectedAccount, 
  setSelectedAccount, 
  formatCurrency,
  user,
  transactions = [],
  onTabChange
}) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const totalAssets = accounts.reduce((sum, acc) => sum + (acc.bakiye || 0), 0);

  const accountTransactions = selectedAccount 
    ? transactions.filter(t => 
        t.gonderici_ıban === selectedAccount.iban || 
        t.alici_ıban === selectedAccount.iban ||
        t.gonderici_ıban === selectedAccount._id || 
        t.alici_ıban === selectedAccount._id
      ).slice(0, 5) 
    : [];

  const [loanModalVisible, setLoanModalVisible] = React.useState(false);

  const handleQuickAction = (action) => {
      switch(action) {
          case 'Transfer':
              // Assuming onTabChange(1) switches to transactions/transfer tab
              if(onTabChange) onTabChange(1);
              break;
          case 'Kredi':
               setLoanModalVisible(true);
              break;
          default:
              break;
      }
  };

  const QuickAction = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <Surface style={styles.actionIconContainer} elevation={2}>
            <IconButton icon={icon} iconColor={colors.primary} size={28} />
        </Surface>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hoş Geldiniz</Text>
          <Text style={styles.userName}>{user?.name || user?.ad || 'Kullanıcı'}</Text>
        </View>
        <Avatar.Icon size={48} icon="account" style={{backgroundColor: 'rgba(255,255,255,0.2)'}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.totalAssetsCard} elevation={2}>
            <View style={styles.totalAssetsHeader}>
                <Text style={styles.totalAssetsLabel}>TOPLAM VARLIK</Text>
                <IconButton icon="wallet-outline" size={20} iconColor={colors.primary} style={{margin:0}} />
            </View>
            <Text style={styles.totalAssetsValue}>{formatCurrency(totalAssets)}</Text>
        </Surface>

        <Text style={styles.sectionTitle}>Hesaplarım</Text>
        
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.cardsScrollContent}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16} 
        >
        {accounts.length > 0 ? (
             accounts.map((account) => {
                const isSelected = selectedAccount?._id === account._id;
                return (
                <TouchableOpacity
                    key={account._id || account.id}
                    onPress={() => setSelectedAccount(account)}
                    activeOpacity={0.9}
                >
                    <Surface style={[styles.cardContainer, isSelected && styles.selectedCardContainer]} elevation={4}>
                        <LinearGradient
                            colors={isSelected ? [colors.primary, '#5e0000'] : ['#334155', '#1e293b']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardTopRow}>
                                    <Text style={styles.cardTitle}>{account.hesap_turu?.[0] || 'Vadesiz Hesap'}</Text>
                                    {isSelected && <View style={styles.activeIndicator} />}
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={styles.cardBalanceLabel}>MEVCUT BAKİYE</Text>
                                    <Text style={styles.cardBalance}>{formatCurrency(account.bakiye || 0)}</Text>
                                </View>
                                
                                <View style={styles.cardBottomRow}>
                                    <Text style={styles.cardIbanLabel}>TR</Text>
                                    <Text style={styles.cardIban}>
                                        {account.iban ? account.iban.match(/.{1,4}/g).join('  ') : account._id}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Surface>
                </TouchableOpacity>
            )})
        ) : (
            <Surface style={[styles.emptyCard, {width: CARD_WIDTH}]} elevation={1}>
                <Text style={styles.emptyText}>Henüz hesabınız bulunmuyor</Text>
            </Surface>
        )}
        </ScrollView>

        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsContainer}>
            <QuickAction icon="swap-horizontal" label="Transfer" onPress={() => handleQuickAction('Transfer')} />
            <QuickAction icon="credit-card-plus-outline" label="Kredi" onPress={() => handleQuickAction('Kredi')} />
        </View>

        <Text style={styles.sectionTitle}>Son Hareketler</Text>
        <Surface style={styles.transactionsContainer} elevation={1}>
            {accountTransactions.length > 0 ? (
                accountTransactions.map((t, index) => {
                    const isIncoming = t.alici_ıban === (selectedAccount?.iban || selectedAccount?._id);
                    return (
                        <View key={t._id || index}>
                            <View style={styles.transactionItem}>
                                <Avatar.Icon 
                                    size={40} 
                                    icon={isIncoming ? "arrow-down-bold" : "arrow-up-bold"} 
                                    style={{backgroundColor: isIncoming ? '#dcfce7' : '#fee2e2'}}
                                    color={isIncoming ? '#166534' : '#991b1b'}
                                />
                                <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionTitle}>
                                        {isIncoming ? t.gonderici_ad_soyad : t.alici_ad_soyad}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(t.islem_tarihi).toLocaleDateString('tr-TR')}
                                    </Text>
                                </View>
                                <Text style={[styles.transactionAmount, {color: isIncoming ? '#166534' : '#991b1b'}]}>
                                    {isIncoming ? '+' : '-'}{formatCurrency(t.miktar)}
                                </Text>
                            </View>
                            {index < accountTransactions.length - 1 && <Divider />}
                        </View>
                    );
                })
            ) : (
                <View style={styles.emptyTransactions}>
                    <Text style={styles.emptyText}>Bu hesap için işlem bulunamadı.</Text>
                </View>
            )}
        </Surface>

        <LoanScreen 
            user={user}
            visible={loanModalVisible}
            onDismiss={() => setLoanModalVisible(false)}
            onRefresh={onRefresh}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
      flex: 1,
      backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  totalAssetsCard: {
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'white',
  },
  totalAssetsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
  },
  totalAssetsLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '700',
      letterSpacing: 1,
  },
  totalAssetsValue: {
      fontSize: 38,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
      marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 20,
    marginLeft: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardsScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 10
  },
  cardContainer: {
      width: CARD_WIDTH,
      height: 220,
      marginRight: 16,
      borderRadius: 24,
      overflow: 'hidden',
  },
  selectedCardContainer: {
      transform: [{scale: 1.02}],
      borderWidth: 2,
      borderColor: '#bf9b30', 
  },
  cardGradient: {
      flex: 1,
      padding: 24,
      justifyContent: 'space-between'
  },
  cardContent: {
      flex: 1,
      justifyContent: 'space-between',
  },
  cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  cardTitle: {
      color: 'rgba(255,255,255,0.95)',
      fontWeight: 'bold',
      fontSize: 18,
      letterSpacing: 0.5,
  },
  activeIndicator: {
      backgroundColor: '#4ade80', 
      width: 8,
      height: 8,
      borderRadius: 4,
      shadowColor: "#4ade80",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
  },
  cardBody: {
      justifyContent: 'center',
  },
  cardBalanceLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
      letterSpacing: 1,
  },
  cardBalance: {
      color: 'white',
      fontSize: 36,
      fontWeight: 'bold',
      letterSpacing: -1,
  },
  cardBottomRow: {
      flexDirection: 'column',
  },
  cardIbanLabel: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 2,
  },
  cardIban: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 16,
      fontFamily: 'Courier',
      letterSpacing: 1,
  },
  cardType: {
      display: 'none', 
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 16
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 24
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 48) / 4, 
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 30
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyTransactions: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14
  }
});
