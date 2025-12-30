import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, Surface, ActivityIndicator, Divider, Button, Portal, Modal, TextInput, SegmentedButtons } from 'react-native-paper';
import Constants from 'expo-constants';
import { exchangeService } from '../services/exchangeService';
import { accountService } from '../services/authService'; // To get updated balance
import { colors } from '../theme/colors';

export default function ExchangeScreen({ loading: parentLoading, refreshing, onRefresh, user }) {
  const [rates, setRates] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Trade Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [amount, setAmount] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshing, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ratesData = await exchangeService.getRates();
      setRates(ratesData);

      if (user && (user.tcNo || user.tc_kimlik)) {
          // If we have user prop, fetch specific account details to get latest balance/assets
          const tc = user.tcNo || user.tc_kimlik;
          const accountData = await accountService.getAccountById(tc);
          setUserAccount(accountData);
      }

      setError(null);
    } catch (err) {
      setError('Veriler alınamadı.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openTradeModal = (currency) => {
      setSelectedCurrency(currency);
      setAmount('');
      setTradeType('buy');
      setModalVisible(true);
  };

  const handleTrade = async () => {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
          Alert.alert('Hata', 'Geçerli bir miktar giriniz');
          return;
      }

      try {
          setTradeLoading(true);
          const tcNo = userAccount.tc_kimlik;
          
          if (tradeType === 'buy') {
              await exchangeService.buyCurrency(tcNo, selectedCurrency, Number(amount));
              Alert.alert('Başarılı', `${amount} ${selectedCurrency} satın alındı.`);
          } else {
              await exchangeService.sellCurrency(tcNo, selectedCurrency, Number(amount));
              Alert.alert('Başarılı', `${amount} ${selectedCurrency} satıldı.`);
          }
          
          setModalVisible(false);
          fetchData(); // Refresh data
      } catch (e) {
          Alert.alert('İşlem Başarısız', e.message);
      } finally {
          setTradeLoading(false);
      }
  };

  const CurrencyCard = ({ currency, value, icon, color, code }) => (
    <Surface style={[styles.card, { borderLeftColor: color }]} elevation={2}>
      <View style={styles.cardContent}>
        <View style={styles.currencyHeader}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={[styles.currencyIcon, { color: color }]}>{icon}</Text>
            </View>
            <View>
                <Text style={styles.currencyTitle}>{currency}</Text>
                <Text style={styles.currencyCode}>{code} / TRY</Text>
            </View>
        </View>
        <View style={styles.currencyValueContainer}>
            <Text style={styles.currencyValue}>{value ? value.toFixed(4) : '-'}</Text>
            <Text style={styles.trendIcon}>₺</Text>
        </View>
      </View>
      <Divider style={styles.cardDivider} />
      <View style={styles.cardActions}>
          <Text style={styles.assetText}>
              Varlık: <Text style={{fontWeight: 'bold'}}>
                  {userAccount?.doviz_varliklari?.[code]?.toFixed(2) || '0.00'} {code}
              </Text>
          </Text>
          <Button 
            mode="contained" 
            compact 
            onPress={() => openTradeModal(code)}
            buttonColor={color}
            labelStyle={{fontSize: 12}}
          >
              Al / Sat
          </Button>
      </View>
    </Surface>
  );

  return (
    <>
    <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
            <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh || fetchData} />
        }
    >
      <Text style={styles.headerTitle}>Döviz İşlemleri</Text>
      
      {userAccount && (
        <Surface style={styles.walletCard} elevation={4}>
            <Text style={styles.walletTitle}>Toplam TRY Bakiyeniz</Text>
            <Text style={styles.walletBalance}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(userAccount.bakiye)}
            </Text>
        </Surface>
      )}

      <Text style={styles.subTitle}>Güncel Kurlar ve Varlıklarınız</Text>

      {loading && !rates ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
          <Surface style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
          </Surface>
      ) : (
        <View style={styles.grid}>
            <CurrencyCard 
                currency="Amerikan Doları" 
                code="USD"
                value={rates?.USD} 
                icon="$" 
                color="#2ecc71" 
            />
            <CurrencyCard 
                currency="Euro" 
                code="EUR"
                value={rates?.EUR} 
                icon="€" 
                color="#3498db" 
            />
            <CurrencyCard 
                currency="İngiliz Sterlini" 
                code="GBP"
                value={rates?.GBP} 
                icon="£" 
                color="#9b59b6" 
            />
             <CurrencyCard 
                currency="Japon Yeni" 
                code="JPY"
                value={rates?.JPY} 
                icon="¥" 
                color="#e74c3c" 
            />
        </View>
      )}
      
      {userAccount && rates && (
          <Surface style={styles.totalAssetCard} elevation={2}>
              <Text style={styles.totalAssetTitle}>Toplam Varlığım</Text>
              <Text style={styles.totalAssetValue}>
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                      (userAccount.bakiye || 0) + 
                      Object.keys(userAccount.doviz_varliklari || {}).reduce((total, currency) => {
                          return total + ((userAccount.doviz_varliklari[currency] || 0) * (rates[currency] || 0));
                      }, 0)
                  )}
              </Text>
              <Text style={styles.totalAssetSub}>
                  (TL + Döviz Varlıkları)
              </Text>
          </Surface>
      )}
    </ScrollView>

    <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Text style={styles.modalTitle}>{selectedCurrency} İşlemi</Text>
                    
                    <SegmentedButtons
                        value={tradeType}
                        onValueChange={setTradeType}
                        buttons={[
                        {
                            value: 'buy',
                            label: 'Satın Al',
                            style: { backgroundColor: tradeType === 'buy' ? colors.primary + '20' : 'transparent' }
                        },
                        {
                            value: 'sell',
                            label: 'Sat',
                            style: { backgroundColor: tradeType === 'sell' ? colors.error + '20' : 'transparent' }

                        },
                        ]}
                        style={styles.segmentedButton}
                    />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Güncel Kur:</Text>
                        <Text style={styles.infoValue}>{rates?.[selectedCurrency]?.toFixed(4)} ₺</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mevcut Varlık:</Text>
                        <Text style={styles.infoValue}>{userAccount?.doviz_varliklari?.[selectedCurrency]?.toFixed(2) || '0.00'} {selectedCurrency}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mevcut Bakiye:</Text>
                        <Text style={styles.infoValue}>{userAccount?.bakiye?.toFixed(2)} ₺</Text>
                    </View>

                    <TextInput
                        label="Miktar"
                        value={amount}
                        onChangeText={setAmount}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        right={<TextInput.Affix text={selectedCurrency} />}
                    />

                    {amount && !isNaN(amount) && (
                        <Text style={styles.summaryText}>
                            {tradeType === 'buy' ? 'Ödenecek Tutar: ' : 'Alınacak Tutar: '}
                            {(Number(amount) * (rates?.[selectedCurrency] || 0)).toFixed(2)} ₺
                        </Text>
                    )}

                    <Button 
                        mode="contained" 
                        onPress={handleTrade} 
                        loading={tradeLoading}
                        style={[styles.tradeButton, { backgroundColor: tradeType === 'buy' ? colors.primary : colors.error, marginTop: 10 }]}
                    >
                        {tradeType === 'buy' ? `${selectedCurrency} AL` : `${selectedCurrency} SAT`}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Constants.statusBarHeight + 20,
    paddingBottom: 100,
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16
  },
  subTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16
  },
  walletCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.primary,
      marginBottom: 24
  },
  walletTitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginBottom: 4
  },
  walletBalance: {
      color: 'white',
      fontSize: 28,
      fontWeight: 'bold'
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 200
  },
  errorContainer: {
      padding: 20,
      borderRadius: 12,
      backgroundColor: colors.surface,
      alignItems: 'center'
  },
  errorText: {
      color: colors.error
  },
  grid: {
      gap: 16
  },
  card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderLeftWidth: 4,
      overflow: 'hidden'
  },
  cardContent: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  cardDivider: {
      backgroundColor: colors.background
  },
  cardActions: {
      padding: 12,
      backgroundColor: '#f8f9fa',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  assetText: {
      fontSize: 12,
      color: colors.textSecondary
  },
  currencyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
  },
  currencyIcon: {
      fontSize: 20,
      fontWeight: 'bold'
  },
  currencyTitle: {
      fontSize: 14,
      color: colors.textSecondary
  },
  currencyCode: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text
  },
  currencyValueContainer: {
      alignItems: 'flex-end'
  },
  currencyValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text
  },
  trendIcon: {
      fontSize: 12,
      color: colors.textSecondary
  },
  modalContainer: {
      backgroundColor: 'white',
      padding: 24,
      margin: 20,
      borderRadius: 16
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text
  },
  segmentedButton: {
      marginBottom: 20
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8
  },
  infoLabel: {
      color: colors.textSecondary
  },
  infoValue: {
      fontWeight: 'bold',
      color: colors.text
  },
  input: {
      backgroundColor: colors.background,
      marginTop: 12,
      marginBottom: 12
  },
  summaryText: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 20
  },
  tradeButton: {
      borderRadius: 8
  },
  totalAssetCard: {
      marginTop: 24,
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '20'
  },
  totalAssetTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8
  },
  totalAssetValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4
  },
  totalAssetSub: {
      fontSize: 12,
      color: colors.textSecondary
  }
});
