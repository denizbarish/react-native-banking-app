import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Surface, Button, Avatar, Divider, List, Switch, IconButton, Modal, Portal, TextInput, Paragraph, Dialog } from 'react-native-paper';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';

export default function ProfileScreen({ user, onLogout }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.bildirim_izni ?? true);
    
    const handleNotificationToggle = async (value) => {
        setNotificationsEnabled(value);
        try {
            await authService.updateProfile(user.tcNo || user.tc_kimlik, { bildirim_izni: value });
        } catch (e) {
            console.error('Bildirim ayarı güncellenemedi', e);
            Alert.alert('Hata', 'Ayarlar kaydedilemedi');
            setNotificationsEnabled(!value);
        }
    };
    
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);
    const [agreementsVisible, setAgreementsVisible] = useState(false);

    const [newPhone, setNewPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePhone = async () => {
        if (!newPhone || newPhone.length < 10) {
            Alert.alert('Hata', 'Geçerli bir telefon numarası giriniz.');
            return;
        }
        setLoading(true);
        try {
            await authService.updateProfile(user.tcNo || user.tc_kimlik, { telefon: newPhone });
            Alert.alert('Başarılı', 'Telefon numaranız güncellendi.');
            setPhoneModalVisible(false);
            setNewPhone('');
        } catch (error) {
            Alert.alert('Hata', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
            return;
        }
        setLoading(true);
        try {
            await authService.updateProfile(user.tcNo || user.tc_kimlik, { sifre: newPassword });
            Alert.alert('Başarılı', 'Şifreniz güncellendi.');
            setPasswordModalVisible(false);
            setNewPassword('');
        } catch (error) {
            Alert.alert('Hata', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Avatar.Text 
                    size={80} 
                    label={user?.ad?.substring(0,2).toUpperCase() || "KV"} 
                    style={styles.avatar} 
                    labelStyle={{fontSize: 28, fontWeight: 'bold', color: colors.primary}}
                />
                <Text style={styles.welcomeText}>Hoş Geldin,</Text>
                <Text style={styles.userName}>{user?.ad} {user?.soyad}</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            <Surface style={styles.sectionContainer} elevation={1}>
                <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                <List.Item
                    title="TC Kimlik No"
                    description={user?.tcNo || user?.tc_kimlik || '12345678901'}
                    left={props => <List.Icon {...props} icon="card-account-details" color={colors.primary} />}
                    right={props => <IconButton {...props} icon="content-copy" onPress={() => Alert.alert('Kopyalandı')} />}
                />
                <Divider />
                <List.Item
                    title="Telefon Numarası"
                    description={user?.telefon || "+90 5XX XXX XX XX"}
                    left={props => <List.Icon {...props} icon="phone" color={colors.primary} />}
                    onPress={() => setPhoneModalVisible(true)}
                    right={props => <List.Icon {...props} icon="pencil" />}
                />
            </Surface>

            <Surface style={styles.sectionContainer} elevation={1}>
                <Text style={styles.sectionTitle}>Güvenlik ve Ayarlar</Text>
                <List.Item
                    title="Şifre Değiştir"
                    description="Güvenliğiniz için belirli aralıklarla değiştirin"
                    left={props => <List.Icon {...props} icon="lock-reset" color={colors.primary} />}
                    onPress={() => setPasswordModalVisible(true)}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <Divider />
                <List.Item
                    title="Bildirimler"
                    left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
                    right={() => <Switch value={notificationsEnabled} onValueChange={handleNotificationToggle} color={colors.primary} />}
                />
            </Surface>

            <Surface style={styles.sectionContainer} elevation={1}>
                <Text style={styles.sectionTitle}>Destek</Text>
                <List.Item
                    title="Yardım Merkezi"
                    left={props => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
                    onPress={() => setHelpVisible(true)}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <Divider />
                <List.Item
                    title="Sözleşmeler ve Politikalar"
                    left={props => <List.Icon {...props} icon="file-document" color={colors.primary} />}
                    onPress={() => setAgreementsVisible(true)}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
            </Surface>

            <Button 
                mode="contained" 
                onPress={onLogout} 
                buttonColor="#dc2626" 
                style={styles.logoutButton}
                icon="logout"
                contentStyle={{height: 50}}
                labelStyle={{fontSize: 16, fontWeight: 'bold'}}
            >
                Güvenli Çıkış Yap
            </Button>
            
            <Text style={styles.versionText}>v1.0.2 - Build 2024</Text>
        </ScrollView>

        <Portal>
            <Modal visible={phoneModalVisible} onDismiss={() => setPhoneModalVisible(false)} contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Telefon Numarası Güncelle</Text>
                <TextInput
                    label="Yeni Telefon Numarası"
                    value={newPhone}
                    onChangeText={setNewPhone}
                    keyboardType="phone-pad"
                    mode="outlined"
                    style={styles.input}
                    placeholder="05XXXXXXXXX"
                />
                <Button mode="contained" onPress={handleUpdatePhone} loading={loading} style={styles.modalButton}>Güncelle</Button>
            </Modal>

            <Modal visible={passwordModalVisible} onDismiss={() => setPasswordModalVisible(false)} contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Şifre Değiştir</Text>
                <TextInput
                    label="Yeni Şifre"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleUpdatePassword} loading={loading} style={styles.modalButton}>Güncelle</Button>
            </Modal>

            <Dialog visible={helpVisible} onDismiss={() => setHelpVisible(false)} style={{backgroundColor: 'white'}}>
                <Dialog.Title>Yardım Merkezi</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>7/24 Çağrı Merkezimiz:</Paragraph>
                    <Paragraph style={{fontWeight:'bold', fontSize: 18, marginTop: 10}}>444 0 444</Paragraph>
                    <Paragraph style={{marginTop: 20}}>Sorularınız için bize her zaman ulaşabilirsiniz.</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setHelpVisible(false)}>Kapat</Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog visible={agreementsVisible} onDismiss={() => setAgreementsVisible(false)} style={{backgroundColor: 'white'}}>
                <Dialog.Title>Sözleşmeler</Dialog.Title>
                <Dialog.Content>
                    <ScrollView style={{maxHeight: 300}}>
                        <Paragraph style={{fontWeight:'bold'}}>Müşteri Sözleşmesi v1.0</Paragraph>
                        <Paragraph>Bankamız hizmetlerinden yararlanan tüm müşterilerimiz...</Paragraph>
                        <Divider style={{marginVertical: 10}}/>
                        <Paragraph style={{fontWeight:'bold'}}>Gizlilik Politikası</Paragraph>
                        <Paragraph>Verileriniz KVKK kapsamında korunmaktadır...</Paragraph>
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setAgreementsVisible(false)}>Kapat</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
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
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerContent: {
      alignItems: 'center',
  },
  avatar: {
      backgroundColor: 'white',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.2)'
  },
  welcomeText: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      marginBottom: 4
  },
  userName: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
      backgroundColor: 'white',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden'
  },
  sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginLeft: 16,
      marginTop: 16,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1
  },
  logoutButton: {
      marginTop: 16,
      borderRadius: 12,
      shadowColor: "#dc2626",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
  },
  versionText: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 20,
      fontSize: 12
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 24,
      margin: 20,
      borderRadius: 12
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.primary
  },
  input: {
      marginBottom: 16,
      backgroundColor: 'white'
  },
  modalButton: {
      marginTop: 8
  }
});
