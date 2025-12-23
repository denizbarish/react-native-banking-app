import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Text,
  Surface,
  ActivityIndicator,
  Button,
  Divider,
  BottomNavigation,
  Avatar
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { accountService, transactionService } from '../services/authService';




const AccountsRoute = ({ 
  accounts, 
  loading, 
  refreshing, 
  onRefresh, 
  selectedAccount, 
  setSelectedAccount, 
  formatCurrency,
  user
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

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
      >
        <Text style={styles.sectionTitle}>Varlıklarım</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account._id || account.id}
            onPress={() => setSelectedAccount(account)}
            activeOpacity={0.7}
          >
            <Surface 
              style={[
                styles.accountCard,
                selectedAccount?._id === account._id && styles.selectedCard
              ]} 
              elevation={2}
            >
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.hesap_turu?.[0] || 'Vadesiz Hesap'}</Text>
                <View style={[
                  styles.statusBadge,
                   styles.activeBadge
                ]}>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </View>
              <Text style={styles.accountNumber}>IBAN: {account.iban || account._id}</Text>
              <Text style={styles.balance}>{formatCurrency(account.bakiye || 0)}</Text>
            </Surface>
          </TouchableOpacity>
        ))}

        {accounts.length === 0 && (
          <Surface style={styles.emptyCard} elevation={1}>
            <Text style={styles.emptyText}>Henüz hesabınız bulunmuyor</Text>
          </Surface>
        )}
      </ScrollView>
    </View>
  );
};


const TransactionsRoute = ({ transactions, loading, refreshing, onRefresh, formatCurrency, formatDate }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.simpleHeader}>
        <Text style={styles.headerTitle}>Son İşlemler</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {transactions.map((transaction) => (
          <Surface key={transaction._id || transaction.id} style={styles.transactionCard} elevation={1}>
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
                    {transaction.aciklama || 'Transfer İşlemi'}
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
                {transaction.type === 'gelen' ? '+' : '-'}{formatCurrency(transaction.miktar || transaction.amount || 0)}
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
};


const CardsRoute = () => (
    <View style={styles.tabContainer}>
        <View style={styles.simpleHeader}>
           <Text style={styles.headerTitle}>Kartlarım</Text>
        </View>
        <View style={styles.centerContent}>
            <Avatar.Icon size={80} icon="credit-card-outline" style={{backgroundColor: colors.surface, marginBottom: 20}} color={colors.primary} />
            <Text style={{fontSize: 18, color: colors.textSecondary}}>Kayıtlı kartınız bulunmuyor.</Text>
            <Button mode="contained" style={{marginTop: 20}} buttonColor={colors.primary}>Yeni Kart Başvurusu</Button>
        </View>
    </View>
);


const ProfileRoute = ({ user, onLogout }) => (
    <View style={styles.tabContainer}>
         <View style={styles.simpleHeader}>
           <Text style={styles.headerTitle}>Profil</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Surface style={styles.profileCard} elevation={2}>
                <Avatar.Text size={80} label={user?.ad?.substring(0,2).toUpperCase() || "KV"} style={{backgroundColor: colors.primary, alignSelf:'center', marginBottom: 16}} />
                <Text style={styles.profileName}>{user?.ad} {user?.soyad}</Text>
                <Text style={styles.profileInfo}>{user?.tcNo || user?.tc_kimlik}</Text>
                
                <Divider style={{marginVertical: 20}} />
                
                <Button icon="cog" mode="outlined" style={styles.menuButton} contentStyle={styles.menuButtonContent} onPress={() => Alert.alert('Bilgi', 'Ayarlar yakında eklenecek')}>Ayarlar</Button>
                <Button icon="help-circle" mode="outlined" style={styles.menuButton} contentStyle={styles.menuButtonContent} onPress={() => Alert.alert('Bilgi', 'Yardım merkezi yakında eklenecek')}>Yardım</Button>
                <Button icon="lock" mode="outlined" style={styles.menuButton} contentStyle={styles.menuButtonContent} onPress={() => Alert.alert('Bilgi', 'Şifre işlemleri yakında eklenecek')}>Şifre İşlemleri</Button>

                <Button 
                    mode="contained" 
                    onPress={onLogout} 
                    buttonColor={colors.error} 
                    style={{marginTop: 40}}
                    icon="logout"
                >
                    Güvenli Çıkış
                </Button>
            </Surface>
        </ScrollView>
    </View>
);




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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      
      
      
      
      
      
      
      
      try {
          const accountsData = await accountService.getAccounts();
          setAccounts(Array.isArray(accountsData) ? accountsData : []);
          if (Array.isArray(accountsData) && accountsData.length > 0) setSelectedAccount(accountsData[0]);
      } catch (e) {
          console.warn('Hesaplar çekilemedi', e);
          
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

  const renderScene = BottomNavigation.SceneMap({
    accounts: () => (
        <AccountsRoute 
            accounts={accounts} 
            loading={loading} 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            formatCurrency={formatCurrency}
            user={user}
        />
    ),
    transactions: () => (
        <TransactionsRoute 
            transactions={transactions}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
        />
    ),
    cards: CardsRoute,
    profile: () => <ProfileRoute user={user} onLogout={onLogout} />,
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
  },
  tabContainer: {
      flex: 1,
      backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
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
  simpleHeader: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary
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
  profileCard: {
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.surface
  },
  profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.text
  },
  profileInfo: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 4
  },
  menuButton: {
      marginBottom: 12,
      borderColor: colors.border
  },
  menuButtonContent: {
      justifyContent: 'flex-start',
      height: 50
  }
});
