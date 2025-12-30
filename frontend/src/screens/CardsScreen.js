import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Surface, Button, TextInput, Avatar, ActivityIndicator, Chip, Menu, Modal, Portal } from 'react-native-paper';
import { colors } from '../theme/colors';
import { cardService } from '../services/cardService';

const CardApplicationModal = ({ visible, onClose, onApply, loading, user }) => {
    const [cardName, setCardName] = useState('Kartım');
    const [limit, setLimit] = useState('20000');
    const [income, setIncome] = useState('');
    const [jobStatus, setJobStatus] = useState('Özel Sektör');
    const [menuVisible, setMenuVisible] = useState(false);

    const handleApply = () => {
         if(!cardName || !income) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }
        onApply({
            tc: user?.tcNo || user?.tc_kimlik,
            kart_ismi: cardName,
            limit_request: parseInt(limit),
            aylik_gelir: parseInt(income),
            calisma_durumu: jobStatus
        });
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainerStyle}>
                 <Surface style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Yeni Kart Başvurusu</Text>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextInput
                            label="Kart İsmi"
                            value={cardName}
                            onChangeText={setCardName}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Aylık Gelir (TL)"
                            value={income}
                            onChangeText={setIncome}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Limit Talebi"
                            value={limit}
                            onChangeText={setLimit}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                        />
                        <Text style={styles.label}>Çalışma Durumu</Text>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.dropdownTrigger}>
                                    <Text style={styles.dropdownText}>{jobStatus}</Text>
                                    <Avatar.Icon size={24} icon="chevron-down" style={{backgroundColor: 'transparent'}} color={colors.textSecondary}/>
                                </TouchableOpacity>
                            }
                        >
                            {['Özel Sektör', 'Kamu', 'Serbest Meslek', 'Emekli', 'Öğrenci', 'Diğer'].map((status) => (
                                <Menu.Item 
                                    key={status} 
                                    onPress={() => {
                                        setJobStatus(status);
                                        setMenuVisible(false);
                                    }} 
                                    title={status} 
                                />
                            ))}
                        </Menu>
                        
                        <View style={styles.buttonRow}>
                            <Button onPress={onClose} style={styles.modalBtn}>İptal</Button>
                            <Button mode="contained" onPress={handleApply} loading={loading} style={styles.modalBtn}>Başvur</Button>
                        </View>
                    </ScrollView>
                </Surface>
            </Modal>
        </Portal>
    );
};

import CardDetailScreen from './CardDetailScreen';

export default function CardsScreen({ cards, user, loading, refreshing, onRefresh, formatCurrency, onApply }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    const fetchApplications = async () => {
        try {
            const tc = user?.tcNo || user?.tc_kimlik;
            if(tc) {
                const apps = await cardService.getApplications(tc);
                setApplications(apps || []);
            }
        } catch (e) {
            console.warn('Başvurular alınamadı', e);
        }
    };

    const handleApply = async(data) => {
        setApplyLoading(true);
        await onApply(data);
        await fetchApplications(); 
        setApplyLoading(false);
        setModalVisible(false);
    };

    useEffect(() => {
        if(user) fetchApplications();
    }, [user, refreshing]); 

    // If a card is selected, show detail screen
    if(selectedCard) {
        return (
            <CardDetailScreen 
                card={selectedCard} 
                onBack={() => setSelectedCard(null)} 
                formatCurrency={formatCurrency}
                user={user}
            />
        );
    }

    return (
    <View style={styles.tabContainer}>
        <View style={styles.simpleHeader}>
           <Text style={styles.headerTitle}>Kartlarım</Text>
           <Button mode="contained-tonal" icon="plus" onPress={() => setModalVisible(true)}>Yeni Kart</Button>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            
            {/* Active Cards */}
            {loading ? <ActivityIndicator style={{marginTop: 50}} /> : cards.length === 0 && applications.length === 0 ? (
                <View style={styles.centerContent}>
                    <Avatar.Icon size={80} icon="credit-card-outline" style={{backgroundColor: colors.surface, marginBottom: 20}} color={colors.primary} />
                    <Text style={{fontSize: 18, color: colors.textSecondary}}>Kayıtlı kartınız bulunmuyor.</Text>
                </View>
            ) : (
                <>
                {cards.map((card) => (
                    <TouchableOpacity key={card._id} onPress={() => setSelectedCard(card)} activeOpacity={0.9}>
                    <Surface style={styles.creditCard} elevation={8}>
                        {/* Background Decoration */}
                        <View style={styles.cardDecorationCircle} />
                        
                        <View style={styles.cardTop}>
                            <View style={styles.chip} />
                            <Avatar.Icon icon="contactless-payment" size={32} style={{backgroundColor:'transparent'}} color="rgba(255,255,255,0.8)"/>
                        </View>

                        <Text style={styles.cardNumber}>
                            {card.kart_num ? card.kart_num.replace(/(.{4})/g, '$1  ').trim() : '****  ****  ****  ****'}
                        </Text>

                        <View style={styles.cardMiddle}>
                             <Text style={styles.cardHolderLabel}>Kart Sahibi</Text>
                             <View style={styles.cardFooter}>
                                <Text style={styles.cardHolderName}>{user?.ad?.toUpperCase()} {user?.soyad?.toUpperCase()}</Text>
                                <View style={styles.expiryContainer}>
                                    <Text style={styles.expiryLabel}>SKT</Text>
                                    <Text style={styles.expiryDate}>{card.skt}</Text>
                                </View>
                             </View>
                        </View>
                        
                        <View style={styles.cardBottomLogo}>
                             <Text style={styles.cardLimitLabel}>LIMIT: {formatCurrency(card.kullanilabilir_limit)}</Text>
                             {/* Mock Mastercard/Visa Logo */}
                             <View style={styles.cardLogoContainer}>
                                 <View style={[styles.cardLogoCircle, {backgroundColor: 'rgba(235, 0, 27, 0.8)'}]} />
                                 <View style={[styles.cardLogoCircle, {backgroundColor: 'rgba(247, 158, 27, 0.8)', marginLeft: -12}]} />
                             </View>
                        </View>
                    </Surface>
                    </TouchableOpacity>
                ))}
                </>
            )}

            {/* Pending Applications */}
            {applications.length > 0 && (
                <View style={{marginTop: 20}}>
                     <Text style={styles.sectionTitle}>Başvurularım</Text>
                     {applications.map(app => (
                         <Surface key={app._id} style={styles.applicationCard} elevation={2}>
                             <View style={styles.appRow}>
                                 <View>
                                     <Text style={styles.appName}>{app.kart_ismi}</Text>
                                     <Text style={styles.appDate}>{new Date(app.createdAt).toLocaleDateString('tr-TR')}</Text>
                                 </View>
                                 <Chip 
                                    icon={app.status === 'Beklemede' ? 'clock' : (app.status === 'Onaylandı' ? 'check' : 'close')}
                                    style={{backgroundColor: app.status === 'Beklemede' ? colors.warning : (app.status === 'Onaylandı' ? colors.success : colors.error)}}
                                    textStyle={{color: 'white'}}
                                 >
                                     {app.status}
                                 </Chip>
                             </View>
                         </Surface>
                     ))}
                </View>
            )}

        </ScrollView>
        <CardApplicationModal 
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onApply={handleApply}
            loading={applyLoading}
            user={user}
        />
    </View>
    );
}

const styles = StyleSheet.create({
  tabContainer: {
      flex: 1,
      backgroundColor: colors.background,
  },
  simpleHeader: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary
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
  creditCard: {
      backgroundColor: '#0f172a', // Deep Slate / Midnight Blue
      borderRadius: 20,
      padding: 24,
      marginBottom: 20,
      height: 220,
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'relative',
  },
  cardDecorationCircle: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10
  },
  chip: {
      width: 50,
      height: 34,
      borderRadius: 6,
      backgroundColor: '#bf9b30', // Goldish color
      borderColor: '#e8c45c',
      borderWidth: 1,
      // Simple inner chip lines simulation could be added here if needed
  },
  cardNumber: {
      color: '#ffffff',
      fontSize: 22,
      fontFamily: 'Courier', // Monospace font for card numbers
      fontWeight: 'bold',
      letterSpacing: 2,
      marginTop: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
  },
  cardMiddle: {
      marginTop: 10,
  },
  cardHolderLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 8,
      letterSpacing: 1.5,
      marginBottom: 2,
  },
  cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
  },
  cardHolderName: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 1,
  },
  expiryContainer: {
      alignItems: 'center',
  },
  expiryLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 6,
      marginBottom: 1,
  },
  expiryDate: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 1,
  },
  cardBottomLogo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
  },
  cardLimitLabel: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 12,
  },
  cardLogoContainer: {
      flexDirection: 'row',
  },
  cardLogoCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
  },
  cardValue: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600'
  },
  applicationCard: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'white',
      marginBottom: 10
  },
  appRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  appName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text
  },
  appDate: {
      fontSize: 12,
      color: colors.textSecondary
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },

  modalContainerStyle: {
    padding: 20,
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 24, 
    margin: 20
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: colors.text 
  },
  input: {
      marginBottom: 16,
      backgroundColor: 'white'
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 20
  },
  modalBtn: {
      minWidth: 80
  },
  label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      marginTop: 8
  },
  dropdownTrigger: {
      borderWidth: 1,
      borderColor: '#888',
      borderRadius: 4,
      padding: 12,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
  },
  dropdownText: {
      fontSize: 16,
      color: colors.text
  }
});
