import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Button, ProgressBar, Avatar, List, Divider } from 'react-native-paper';
import { colors } from '../theme/colors';

export default function CardDetailScreen({ card, onBack, formatCurrency, user }) {
    
    // Calculate progress for limit usage
    const totalLimit = card.toplam_limit || 20000;
    const availableLimit = card.kullanilabilir_limit || 0;
    const usedLimit = totalLimit - availableLimit;
    const progress = totalLimit > 0 ? usedLimit / totalLimit : 0;

    const formatDate = (dateString) => {
        if(!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Avatar.Icon size={40} icon="arrow-left" style={{backgroundColor: 'rgba(255,255,255,0.2)'}} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{card.kart_ismi}</Text>
                <View style={{width: 40}} /> 
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Large Card Visual */}
                <Surface style={styles.creditCard} elevation={8}>
                    <View style={styles.cardDecorationCircle} />
                    <View style={styles.cardTop}>
                        <View style={styles.chip} />
                        <Avatar.Icon icon="contactless-payment" size={32} style={{backgroundColor:'transparent'}} color="rgba(255,255,255,0.8)"/>
                    </View>
                    <Text style={styles.cardNumber}>
                        {card.kart_num ? card.kart_num.replace(/(.{4})/g, '$1  ').trim() : '****  ****  ****  ****'}
                    </Text>
                    <View style={styles.cardMiddle}>
                            <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
                            <View style={styles.cardFooter}>
                            <Text style={styles.cardHolderName}>{user?.ad?.toUpperCase()} {user?.soyad?.toUpperCase()}</Text>
                            <View style={styles.expiryContainer}>
                                <Text style={styles.expiryLabel}>VALID THRU</Text>
                                <Text style={styles.expiryDate}>{card.skt}</Text>
                            </View>
                            </View>
                    </View>
                    <View style={styles.cardBottomLogo}>
                            <View />
                            <View style={styles.cardLogoContainer}>
                                <View style={[styles.cardLogoCircle, {backgroundColor: 'rgba(235, 0, 27, 0.8)'}]} />
                                <View style={[styles.cardLogoCircle, {backgroundColor: 'rgba(247, 158, 27, 0.8)', marginLeft: -12}]} />
                            </View>
                    </View>
                </Surface>

                {/* Limit Info */}
                <Surface style={styles.infoCard} elevation={2}>
                    <Text style={styles.sectionTitle}>Limit Bilgileri</Text>
                    
                    <View style={styles.limitRow}>
                        <Text style={styles.limitLabel}>Kullanılabilir Limit</Text>
                        <Text style={styles.limitValue}>{formatCurrency(availableLimit)}</Text>
                    </View>
                    
                    <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
                    
                    <View style={styles.limitRow}>
                        <Text style={styles.limitLabel}>Toplam Limit</Text>
                        <Text style={styles.limitValue}>{formatCurrency(totalLimit)}</Text>
                    </View>
                </Surface>

                 {/* Debt & Dates Info */}
                 <Surface style={styles.infoCard} elevation={2}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Dönem İçi Harcama</Text>
                            <Text style={styles.bigValue}>{formatCurrency(card.donem_ici_harcama || 0)}</Text>
                        </View>
                         <View style={styles.column}>
                            <Text style={styles.label}>Dou Para</Text>
                            <Text style={styles.bigValueWarn}>{formatCurrency(card.dou_para || 0)}</Text>
                        </View>
                    </View>
                    <Divider style={{marginVertical: 16}} />
                    <View style={styles.row}>
                         <View style={styles.column}>
                            <Text style={styles.labelSmall}>Hesap Kesim</Text>
                            <Text style={styles.valueSmall}>{formatDate(card.ekstre_kesim_tarihi)}</Text>
                        </View>
                         <View style={styles.column}>
                            <Text style={styles.labelSmall}>Son Ödeme</Text>
                            <Text style={styles.valueSmall}>{formatDate(card.son_odeme_tarihi)}</Text>
                        </View>
                    </View>
                </Surface>

                 {/* Transactions (Placeholder) */}
                 {card.harcamalar && card.harcamalar.length > 0 && (
                     <Surface style={styles.infoCard} elevation={2}>
                        <Text style={styles.sectionTitle}>Son Harcamalar</Text>
                        {card.harcamalar.map((h, i) => (
                            <List.Item
                                key={i}
                                title={h.aciklama || 'Harcama'}
                                description={formatDate(h.tarih)}
                                right={props => <Text {...props} style={{alignSelf:'center', fontWeight:'bold'}}>-{formatCurrency(h.tutar)}</Text>}
                                left={props => <List.Icon {...props} icon="shopping" />}
                            />
                        ))}
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
    header: {
        backgroundColor: colors.primary,
        padding: 24,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    creditCard: {
      backgroundColor: '#0f172a',
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
      backgroundColor: '#bf9b30',
      borderColor: '#e8c45c',
      borderWidth: 1,
    },
    cardNumber: {
        color: '#ffffff',
        fontSize: 22,
        fontFamily: 'Courier',
        fontWeight: 'bold',
        letterSpacing: 2,
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    cardMiddle: { marginTop: 10 },
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
    expiryContainer: { alignItems: 'center' },
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
    cardLogoContainer: { flexDirection: 'row' },
    cardLogoCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12
    },
    limitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    limitLabel: {
        color: colors.textSecondary,
        fontSize: 14
    },
    limitValue: {
        fontWeight: 'bold',
        color: colors.text
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginVertical: 8,
        backgroundColor: '#e0e0e0'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    column: {
        flex: 1
    },
    label: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 4
    },
    bigValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text
    },
    bigValueWarn: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.warning // Gold color for bonus
    },
    labelSmall: {
        color: colors.textSecondary,
        fontSize: 12
    },
    valueSmall: {
        color: colors.text,
        fontWeight: '600'
    }
});
