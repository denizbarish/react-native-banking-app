import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  ActivityIndicator,
  Button,
  Divider,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { accountService, transactionService } from '../services/authService';

export default function HomeScreen({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountsData, transactionsData] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions()
      ]);
      
      setAccounts(accountsData.data || []);
      setTransactions(transactionsData.data || []);
      
      if (accountsData.data && accountsData.data.length > 0) {
        setSelectedAccount(accountsData.data[0]);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hoş Geldiniz</Text>
          <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
        </View>
        <Button 
          mode="outlined" 
          onPress={onLogout}
          textColor={colors.primary}
          style={styles.logoutButton}
        >
          Çıkış
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hesaplar Bölümü */}
        <Text style={styles.sectionTitle}>Hesaplarım</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            onPress={() => setSelectedAccount(account)}
            activeOpacity={0.7}
          >
            <Surface 
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id && styles.selectedCard
              ]} 
              elevation={2}
            >
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.accountName}</Text>
                <View style={[
                  styles.statusBadge,
                  account.status === 'active' && styles.activeBadge
                ]}>
                  <Text style={styles.statusText}>
                    {account.status === 'active' ? 'Aktif' : 'Pasif'}
                  </Text>
                </View>
              </View>
              <Text style={styles.accountNumber}>{account.accountNumber}</Text>
              <Text style={styles.balance}>{formatCurrency(account.balance)}</Text>
              {account.interestRate && (
                <Text style={styles.interestRate}>
                  Faiz Oranı: %{account.interestRate}
                </Text>
              )}
            </Surface>
          </TouchableOpacity>
        ))}

        {accounts.length === 0 && (
          <Surface style={styles.emptyCard} elevation={1}>
            <Text style={styles.emptyText}>Henüz hesabınız bulunmuyor</Text>
          </Surface>
        )}

        <Divider style={styles.divider} />

        {/* İşlemler Bölümü */}
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
        {transactions.slice(0, 10).map((transaction) => (
          <Surface key={transaction.id} style={styles.transactionCard} elevation={1}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  transaction.type === 'gelen' ? styles.incomingIcon : styles.outgoingIcon
                ]}>
                  <Text style={styles.transactionIconText}>
                    {transaction.type === 'gelen' ? '↓' : '↑'}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.createdAt)}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'gelen' ? styles.incomingAmount : styles.outgoingAmount
              ]}>
                {transaction.type === 'gelen' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            </View>
          </Surface>
        ))}

        {transactions.length === 0 && (
          <Surface style={styles.emptyCard} elevation={1}>
            <Text style={styles.emptyText}>Henüz işlem bulunmuyor</Text>
          </Surface>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  logoutButton: {
    borderColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.textSecondary,
  },
  activeBadge: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accountNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  interestRate: {
    fontSize: 12,
    color: colors.success,
    marginTop: 8,
  },
  divider: {
    marginVertical: 24,
  },
  transactionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomingIcon: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  outgoingIcon: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  transactionIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  incomingAmount: {
    color: colors.success,
  },
  outgoingAmount: {
    color: colors.error,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
