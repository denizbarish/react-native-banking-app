import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, List, Chip, ActivityIndicator, TextInput, IconButton, Appbar, Divider } from 'react-native-paper';
import { colors } from '../theme/colors';
import { adminService } from '../services/adminService';

export default function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('applications'); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    vadeli_mevduat: '',
    kredi_karti_gecikme: '',
    ihtiyac_kredisi: ''
  });
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'applications') {
        const data = await adminService.getApplications();
        setApplications(data);
      } else {
        const data = await adminService.getSystemSettings();
        setSettings({
            vadeli_mevduat: data.vadeli_mevduat?.toString() || '',
            kredi_karti_gecikme: data.kredi_karti_gecikme?.toString() || '',
            ihtiyac_kredisi: data.ihtiyac_kredisi?.toString() || ''
        });
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateApplicationStatus(id, status);
      fetchData(); 
      setSelectedApp(null); 
      Alert.alert('Başarılı', `Başvuru durumu ${status} olarak güncellendi.`);
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleSaveSettings = async () => {
      try {
          await adminService.updateSystemSettings({
              vadeli_mevduat: parseFloat(settings.vadeli_mevduat),
              kredi_karti_gecikme: parseFloat(settings.kredi_karti_gecikme),
              ihtiyac_kredisi: parseFloat(settings.ihtiyac_kredisi)
          });
          Alert.alert('Başarılı', 'Ayarlar kaydedildi.');
      } catch (error) {
          Alert.alert('Hata', error.message);
      }
  };

  const renderApplicationItem = (item) => (
    <Surface style={styles.card} key={item._id} elevation={1}>
      <List.Item
        title={`${item.ad} ${item.soyad}`}
        description={`TC: ${item.tc_kimlik}\nDurum: ${item.basvuru_durumu || 'Beklemede'}`}
        descriptionNumberOfLines={3}
        left={props => <List.Icon {...props} icon="account-details" />}
        right={props => (
            <View style={styles.statusContainer}>
                <Chip 
                    mode="outlined" 
                    textStyle={{color: getStatusColor(item.basvuru_durumu)}}
                    style={{borderColor: getStatusColor(item.basvuru_durumu)}}
                >
                    {item.basvuru_durumu || 'Beklemede'}
                </Chip>
            </View>
        )}
        onPress={() => setSelectedApp(item)}
      />
    </Surface>
  );

  const getStatusColor = (status) => {
      switch(status) {
          case 'Onaylandı': return colors.success;
          case 'Reddedildi': return colors.error;
          default: return colors.warning;
      }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
          <Appbar.Content title="Admin Paneli" titleStyle={styles.headerTitle} />
          <Appbar.Action icon="logout" onPress={onLogout} />
      </Appbar.Header>

      <View style={styles.tabContainer}>
        <Button 
            mode={activeTab === 'applications' ? 'contained' : 'text'} 
            onPress={() => setActiveTab('applications')}
            style={styles.tab}
        >
            Başvurular
        </Button>
        <Button 
            mode={activeTab === 'settings' ? 'contained' : 'text'} 
            onPress={() => setActiveTab('settings')}
            style={styles.tab}
        >
            Ayarlar
        </Button>
      </View>

      {loading ? (
          <ActivityIndicator animating={true} style={{marginTop: 50}} color={colors.primary} />
      ) : activeTab === 'applications' ? (
        <ScrollView contentContainerStyle={styles.content}>
            {applications.map(renderApplicationItem)}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
            <Surface style={styles.settingsCard} elevation={2}>
                <Text style={styles.sectionTitle}>Faiz Oranları (%)</Text>
                
                <TextInput
                    label="Vadeli Mevduat Faizi"
                    value={settings.vadeli_mevduat}
                    onChangeText={text => setSettings({...settings, vadeli_mevduat: text})}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />
                
                <TextInput
                    label="Kredi Kartı Gecikme Faizi"
                    value={settings.kredi_karti_gecikme}
                    onChangeText={text => setSettings({...settings, kredi_karti_gecikme: text})}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="İhtiyaç Kredisi Faizi"
                    value={settings.ihtiyac_kredisi}
                    onChangeText={text => setSettings({...settings, ihtiyac_kredisi: text})}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />

                <Button mode="contained" onPress={handleSaveSettings} style={styles.saveButton}>
                    Kaydet
                </Button>
            </Surface>
        </ScrollView>
      )}

      {selectedApp && (
        <Modal visible={true} transparent animationType="fade" onRequestClose={() => setSelectedApp(null)}>
            <View style={styles.modalOverlay}>
                <Surface style={styles.modalContent} elevation={5}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>Başvuru Detayı</Text>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Müşteri:</Text>
                            <Text style={styles.detailValue}>{selectedApp.ad} {selectedApp.soyad}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>TC Kimlik:</Text>
                            <Text style={styles.detailValue}>{selectedApp.tc_kimlik}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Telefon:</Text>
                            <Text style={styles.detailValue}>{selectedApp.telefon}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Gelir:</Text>
                            <Text style={styles.detailValue}>{selectedApp.aylik_gelir}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mal Varlığı:</Text>
                            <Text style={styles.detailValue}>{selectedApp.mal_varlik?.join(', ') || '-'}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>İşlem Hacmi:</Text>
                            <Text style={styles.detailValue}>{selectedApp.islem_hacmi}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Eğitim:</Text>
                            <Text style={styles.detailValue}>{selectedApp.egitim_durumu}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Çalışma:</Text>
                            <Text style={styles.detailValue}>{selectedApp.calisma_durumu} - {selectedApp.calisma_sektoru}</Text>
                        </View>

                         <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Ürünler:</Text>
                            <Text style={styles.detailValue}>{selectedApp.hesap_turu.join(', ')}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bakiye:</Text>
                            <Text style={styles.detailValue}>{selectedApp.bakiye} TL</Text>
                        </View>

                        {selectedApp.iban && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>IBAN:</Text>
                            <Text style={styles.detailValue}>{selectedApp.iban}</Text>
                        </View>
                        )}

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Başvuru Tarihi:</Text>
                            <Text style={styles.detailValue}>{new Date(selectedApp.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedApp.createdAt).toLocaleTimeString('tr-TR')}</Text>
                        </View>

                        
                        <View style={styles.actionButtons}>
                            <Button 
                                mode="contained" 
                                buttonColor={colors.success} 
                                style={styles.actionButton}
                                onPress={() => handleStatusUpdate(selectedApp._id, 'Onaylandı')}
                            >
                                Onayla
                            </Button>
                            <Button 
                                mode="contained" 
                                buttonColor={colors.error} 
                                style={styles.actionButton}
                                onPress={() => handleStatusUpdate(selectedApp._id, 'Reddedildi')}
                            >
                                Reddet
                            </Button>
                        </View>
                        <Button 
                            mode="outlined" 
                            textColor={colors.error}
                            onPress={() => setSelectedApp(null)} 
                            style={styles.closeButton}
                        >
                            Kapat
                        </Button>
                    </ScrollView>
                </Surface>
            </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.surface, elevation: 2 },
  headerTitle: { fontWeight: 'bold', color: colors.primary },
  tabContainer: { flexDirection: 'row', padding: 10, backgroundColor: colors.surface },
  tab: { flex: 1, marginHorizontal: 5 },
  content: { padding: 15 },
  card: { marginBottom: 10, borderRadius: 8, backgroundColor: colors.surface },
  statusContainer: { justifyContent: 'center' },
  settingsCard: { padding: 20, borderRadius: 10, backgroundColor: colors.surface },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.text },
  input: { marginBottom: 15, backgroundColor: colors.background },
  saveButton: { marginTop: 10 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  modalContent: { 
    flex: 1,
    backgroundColor: colors.surface, 
    padding: 24, 
    paddingTop: 50, 
    width: '100%',
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center',
    color: colors.primary,
    marginTop: 20
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
    color: colors.textSecondary
  },
  detailValue: {
    flex: 1,
    color: colors.text,
    fontSize: 15
  },
  actionButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20
  },
  actionButton: { 
    flex: 0.48,
    borderRadius: 12
  },
  closeButton: {
    marginTop: 15,
    borderColor: colors.error
  }
});
