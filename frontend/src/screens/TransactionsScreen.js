import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, TouchableOpacity, Dimensions, Keyboard, Alert } from 'react-native';
import { Surface, Button, TextInput, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function TransactionsScreen({ transactions, accounts, loading, refreshing, onRefresh, formatCurrency, formatDate, onTransfer }) {
  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' | 'history'
  
  // Transfer State
  const [receiverIban, setReceiverIban] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  
  // Auto-select sender (first account)
  const senderAccount = accounts?.[0];

  const handleSend = async () => {
      if(!receiverIban || !amount) {
          Alert.alert('Eksik Bilgi', 'Lütfen alıcı IBAN ve tutar giriniz.');
          return;
      }
      
      const numAmount = parseFloat(amount.replace(',', '.'));
      if(senderAccount && numAmount > senderAccount.bakiye) {
          Alert.alert('Yetersiz Bakiye', 'Hesabınızda yeterli bakiye bulunmamaktadır.');
          return;
      }

      setTransferLoading(true);
      try {
        await onTransfer({
            gonderici_ıban: senderAccount?.iban || senderAccount?._id,
            alici_ıban: receiverIban,
            miktar: numAmount,
            aciklama: description
        });
        // Reset form on success
        setAmount('');
        setDescription('');
        setReceiverIban('');
        setActiveTab('history');
      } catch(e) {
          // Error handling is done in parent, but we stop loading here
      } finally {
          setTransferLoading(false);
      }
  };

  const addAmount = (val) => {
      const current = amount ? parseFloat(amount) : 0;
      setAmount((current + val).toString());
  };

  const renderTransferTab = () => (
      <ScrollView contentContainerStyle={styles.transferContainer} keyboardShouldPersistTaps="handled">
          <Surface style={styles.balanceCard} elevation={2}>
              <Text style={styles.balanceLabel}>KULLANILABİLİR BAKİYE</Text>
              <Text style={styles.balanceValue}>{formatCurrency(senderAccount?.bakiye || 0)}</Text>
              <Text style={styles.accountName}>{senderAccount?.hesap_turu?.[0] || 'Vadesiz Hesap'} • {senderAccount?.iban?.slice(-4) || '****'}</Text>
          </Surface>

          <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ALICI IBAN</Text>
              <TextInput
                  value={receiverIban}
                  onChangeText={setReceiverIban}
                  mode="outlined"
                  placeholder="DOU00 0000..."
                  style={styles.input}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  right={<TextInput.Icon icon="bank" color={colors.textSecondary} />}
              />
          </View>

          <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>GÖNDERİLECEK TUTAR</Text>
              <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>₺</Text>
                  <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                      style={styles.amountInput}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      selectionColor={colors.primary}
                      placeholder="0,00"
                      placeholderTextColor="#ccc"
                      contentStyle={{fontSize: 48, fontWeight: 'bold', color: colors.primary, paddingLeft: 0, marginLeft: 0}} 
                  />
              </View>
              <View style={styles.chipsContainer}>
                  {[100, 500, 1000].map((val) => (
                      <TouchableOpacity key={val} onPress={() => addAmount(val)} style={styles.amountChip}>
                          <Text style={styles.chipText}>+{val}₺</Text>
                      </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setAmount(senderAccount?.bakiye?.toString() || '0')} style={[styles.amountChip, styles.maxChip]}>
                        <Text style={[styles.chipText, styles.maxChipText]}>TÜMÜ</Text>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>AÇIKLAMA (İSTEĞE BAĞLI)</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    placeholder="Örn: Kira ödemesi"
                    style={styles.input}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.primary}
                />
          </View>

          <Button 
            mode="contained" 
            onPress={handleSend} 
            loading={transferLoading} 
            style={styles.sendButton}
            contentStyle={{paddingVertical: 8}}
            labelStyle={{fontSize: 18, fontWeight: 'bold'}}
          >
              GÖNDER
          </Button>
      </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView
        contentContainerStyle={styles.historyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
        {transactions.map((transaction) => {
             const isIncoming = transaction.tom_iban === (senderAccount?.iban || senderAccount?._id) || transaction.alici_ıban === (senderAccount?.iban || senderAccount?._id);
             return (
            <Surface key={transaction._id || transaction.id} style={styles.transactionCard} elevation={1}>
                <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                    <View style={[
                    styles.transactionIcon,
                    isIncoming ? styles.incomingIcon : styles.outgoingIcon
                    ]}>
                    <IconButton icon={isIncoming ? "arrow-down-bold" : "arrow-up-bold"} size={20} iconColor={isIncoming ? '#166534' : '#991b1b'} />
                    </View>
                    <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                        {transaction.aciklama || (isIncoming ? transaction.gonderici_ad_soyad : transaction.alici_ad_soyad) || 'Transfer'}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {formatDate(transaction.createdAt || transaction.islem_tarihi)}
                    </Text>
                    </View>
                </View>
                <Text style={[
                    styles.transactionAmount,
                    isIncoming ? styles.incomingAmount : styles.outgoingAmount
                ]}>
                    {isIncoming ? '+' : '-'}{formatCurrency(transaction.miktar || transaction.amount || 0)}
                </Text>
                </View>
            </Surface>
        )})}
        {transactions.length === 0 && (
            <View style={styles.emptyContainer}>
                <IconButton icon="history" size={64} iconColor="#eee" />
                <Text style={styles.emptyText}>Henüz işlem geçmişiniz yok.</Text>
            </View>
        )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Para Transferi</Text>
      </View>
      
      <View style={styles.tabSwitchContainer}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'transfer' && styles.activeTab]} 
            onPress={() => setActiveTab('transfer')}
        >
            <Text style={[styles.tabText, activeTab === 'transfer' && styles.activeTabText]}>Transfer Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
            onPress={() => setActiveTab('history')}
        >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Geçmiş İşlemler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'transfer' ? renderTransferTab() : renderHistoryTab()}
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
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white'
  },
  tabSwitchContainer: {
      flexDirection: 'row',
      backgroundColor: 'white',
      marginHorizontal: 20,
      marginTop: -25,
      borderRadius: 12,
      padding: 4,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4
  },
  tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10,
  },
  activeTab: {
      backgroundColor: '#f1f5f9',
  },
  tabText: {
      fontWeight: '600',
      color: colors.textSecondary
  },
  activeTabText: {
      color: colors.primary,
      fontWeight: 'bold'
  },
  content: {
      flex: 1,
  },
  transferContainer: {
      padding: 20,
  },
  balanceCard: {
      padding: 24,
      borderRadius: 16,
      backgroundColor: 'white',
      alignItems: 'center',
      marginBottom: 24
  },
  balanceLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      letterSpacing: 1,
      marginBottom: 8
  },
  balanceValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4
  },
  accountName: {
      fontSize: 14,
      color: colors.textSecondary
  },
  inputGroup: {
      marginBottom: 20
  },
  inputLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 8,
      marginLeft: 4
  },
  input: {
      backgroundColor: 'white',
      fontWeight: '500'
  },
  amountContainer: {
      alignItems: 'center',
      marginVertical: 10,
      marginBottom: 30
  },
  amountLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      letterSpacing: 1,
      marginBottom: 10
  },
  amountInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  currencySymbol: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      marginRight: 4,
      marginTop: 6
  },
  amountInput: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      minWidth: 100,
      height: 60,
  },
  chipsContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 20
  },
  amountChip: {
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20
  },
  maxChip: {
      backgroundColor: '#fee2e2'
  },
  chipText: {
      color: colors.text,
      fontWeight: '600'
  },
  maxChipText: {
      color: colors.error,
      fontSize: 12
  },
  sendButton: {
      marginTop: 10,
      backgroundColor: colors.primary,
      borderRadius: 12
  },
  historyContainer: {
      padding: 16
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
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
    backgroundColor: '#dcfce7',
  },
  outgoingIcon: {
    backgroundColor: '#fee2e2',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
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
    color: '#166534',
  },
  outgoingAmount: {
    color: '#991b1b',
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 50,
      opacity: 0.5
  },
  emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.textSecondary
  }
});
