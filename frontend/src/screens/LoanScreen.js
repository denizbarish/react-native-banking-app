import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, Surface, ActivityIndicator, Button, Portal, Modal, TextInput, ProgressBar } from 'react-native-paper';
import Constants from 'expo-constants';
import { loanService } from '../services/loanService';
import { colors } from '../theme/colors';

export default function LoanScreen({ user, visible, onDismiss, onRefresh }) {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [amount, setAmount] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [mode, setMode] = useState('info'); // info, take, pay

    useEffect(() => {
        if (visible) {
            fetchInfo();
        }
    }, [visible]);

    const fetchInfo = async () => {
        try {
            setLoading(true);
            const tc = user.tcNo || user.tc_kimlik;
            const data = await loanService.getLoanInfo(tc);
            setInfo(data);
        } catch (e) {
            Alert.alert('Hata', 'Kredi bilgileri yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            Alert.alert('Uyarı', 'Geçerli bir tutar giriniz.');
            return;
        }

        try {
            setActionLoading(true);
            const tc = user.tcNo || user.tc_kimlik;
            
            if (mode === 'take') {
                await loanService.takeLoan(tc, Number(amount));
                Alert.alert('Başarılı', 'Kredi hesabınıza tanımlandı.');
            } else if (mode === 'pay') {
                await loanService.payLoan(tc, Number(amount));
                Alert.alert('Başarılı', 'Ödeme alındı.');
            }
            
            setAmount('');
            setMode('info');
            fetchInfo();
            if(onRefresh) onRefresh();

        } catch (e) {
            Alert.alert('İşlem Başarısız', typeof e === 'string' ? e : e.message);
        } finally {
            setActionLoading(false);
        }
    };
    
    // Calculate limit percentage
    const limitUsage = info ? (info.currentDebt / info.limit) : 0;

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
             <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.title}>Kredi İşlemleri</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ margin: 20 }} />
                ) : info ? (
                    <View>
                        <Surface style={styles.card} elevation={2}>
                             <Text style={styles.label}>Kredi Notunuz</Text>
                             <Text style={styles.score}>{info.creditScore}</Text>
                             <Text style={styles.subLabel}>{info.creditScore > 1000 ? 'Çok İyi' : info.creditScore > 800 ? 'İyi' : 'Riskli'}</Text>
                        </Surface>

                        <Surface style={[styles.card, { marginTop: 10 }]} elevation={2}>
                             <View style={styles.row}>
                                 <Text style={styles.label}>Toplam Borç</Text>
                                 <Text style={[styles.value, { color: colors.error }]}>{info.currentDebt.toFixed(2)} ₺</Text>
                             </View>
                             <View style={styles.row}>
                                 <Text style={styles.label}>Kredi Limiti</Text>
                                 <Text style={styles.value}>{info.limit.toFixed(2)} ₺</Text>
                             </View>
                             
                             <ProgressBar progress={limitUsage} color={limitUsage > 0.8 ? colors.error : colors.primary} style={{ height: 8, borderRadius: 4, marginTop: 10 }} />
                             <Text style={{ textAlign: 'right', fontSize: 10,  marginTop: 4, color: colors.textSecondary }}>
                                 %{Math.round(limitUsage * 100)} Kullanıldı
                             </Text>
                        </Surface>

                        {mode === 'info' ? (
                            <View style={styles.actionButtons}>
                                <Button 
                                    mode="contained" 
                                    onPress={() => setMode('take')}
                                    style={styles.button}
                                    disabled={info.currentDebt >= info.limit}
                                >
                                    Kredi Çek
                                </Button>
                                <Button 
                                    mode="outlined" 
                                    onPress={() => setMode('pay')}
                                    style={styles.button}
                                    disabled={info.currentDebt <= 0}
                                >
                                    Borç Öde
                                </Button>
                            </View>
                        ) : (
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>{mode === 'take' ? 'Kredi Çek' : 'Borç Öde'}</Text>
                                <Text style={styles.balanceInfo}>
                                    Mevcut Bakiye: {info.balance?.toFixed(2)} ₺
                                </Text>
                                
                                <TextInput
                                    label="Tutar"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    style={styles.input}
                                    right={<TextInput.Affix text="TL" />}
                                />
                                
                                <View style={styles.formButtons}>
                                    <Button mode="text" onPress={() => setMode('info')} style={{ flex: 1 }}>İptal</Button>
                                    <Button 
                                        mode="contained" 
                                        onPress={handleTransaction} 
                                        loading={actionLoading}
                                        style={{ flex: 1 }}
                                    >
                                        Onayla
                                    </Button>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text>Bilgi bulunamadı.</Text>
                )}
                </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        maxHeight: '80%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: colors.primary
    },
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.surface,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary
    },
    score: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginVertical: 10
    },
    subLabel: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    value: {
        fontWeight: 'bold',
        fontSize: 16
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20
    },
    button: {
        flex: 1,
        borderRadius: 8
    },
    form: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.background,
        borderRadius: 8
    },
    formTitle: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    balanceInfo: {
        fontSize: 12,
        marginBottom: 10,
        color: colors.textSecondary
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 10
    },
    formButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10
    }
});
