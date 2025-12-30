import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert
} from 'react-native';
import {
  BottomNavigation
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { accountService, transactionService } from '../services/authService';
import { cardService } from '../services/cardService';

import AccountsScreen from './AccountsScreen';
import TransactionsScreen from './TransactionsScreen';
import CardsScreen from './CardsScreen';
import ProfileScreen from './ProfileScreen';

export default function HomeScreen({ user, onLogout }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'accounts', title: 'Hesaplar', focusedIcon: 'wallet', unfocusedIcon: 'wallet-outline' },
    { key: 'transactions', title: 'İşlemler', focusedIcon: 'history', unfocusedIcon: 'clock-outline' },
    { key: 'cards', title: 'Kartlar', focusedIcon: 'credit-card', unfocusedIcon: 'credit-card-outline' },
    { key: 'profile', title: 'Profil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Accounts
      try {
          const userTc = user?.tcNo || user?.tc_kimlik;
          if (userTc) {
            const accountData = await accountService.getAccountById(userTc);
            setAccounts(accountData ? [accountData] : []);
            if (accountData) setSelectedAccount(accountData);
          }
      } catch (e) {
          console.warn('Hesaplar çekilemedi', e);
      }

      // 2. Transactions
      try {
          const transactionsData = await transactionService.getTransactions();
          setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      } catch (e) {
          console.warn('İşlemler çekilemedi', e);
      }

      // 3. Cards
      try {
         const userTc = user?.tcNo || user?.tc_kimlik;
         if(userTc) {
             const cardData = await cardService.getCards(userTc);
             setCards(Array.isArray(cardData) ? cardData : []);
         }
      } catch (e) {
          console.warn('Kartlar çekilemedi', e)
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

  const handleTransfer = async (transferData) => {
      try {
          await transactionService.createTransaction(transferData);
          Alert.alert('Başarılı', 'Transfer işleminiz gerçekleşti.');
          onRefresh(); // Reload data
      } catch(e) {
          Alert.alert('Hata', e.message);
      }
  };

  const handleCardApply = async (cardData) => {
      try {
          await cardService.applyForCard(cardData);
          Alert.alert('Başarılı', 'Kart başvurunuz alındı ve onaylandı.');
          onRefresh();
      } catch (e) {
          console.log(e);
          Alert.alert('Hata', 'Kart başvurusu sırasında bir hata oluştu'); // e.message might be complex object
      }
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

  const renderScene = BottomNavigation.SceneMap({
    accounts: () => (
        <AccountsScreen 
            accounts={accounts} 
            loading={loading} 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            formatCurrency={formatCurrency}
            user={user}
            transactions={transactions}
            onTabChange={setIndex}
        />
    ),
    transactions: () => (
        <TransactionsScreen 
            transactions={transactions}
            accounts={accounts}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onTransfer={handleTransfer}
        />
    ),
    cards: () => (
        <CardsScreen 
            cards={cards}
            user={user}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            formatCurrency={formatCurrency}
            onApply={handleCardApply}
        />
    ),
    profile: () => <ProfileScreen user={user} onLogout={onLogout} />,
  });

  return (
    <View style={styles.container}>
        <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ backgroundColor: colors.surface }}
        activeColor={colors.primary}
        inactiveColor={colors.textSecondary}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }
});
