import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';
import StepIndicator from '../components/StepIndicator';

export default function Step1PersonalInfo({ onNext, currentStep, maxStepReached, onStepPress, initialData }) {
  const [tcNo, setTcNo] = useState(initialData?.tcNo || '');
  const [countryCode, setCountryCode] = useState(initialData?.countryCode || '+90');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [securityCode, setSecurityCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(initialData?.agreedToTerms || false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateSecurityCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const [displayCode] = useState(generateSecurityCode());

  const handleContinue = () => {
    if (!tcNo || !phone || !securityCode) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (tcNo.length !== 11) {
      setError('TC Kimlik No 11 haneli olmalıdır');
      return;
    }

    if (phone.length !== 10) {
      setError('Telefon numarası 10 haneli olmalıdır');
      return;
    }

    if (!agreedToTerms) {
      setError('Devam etmek için onay kutucuğunu işaretlemelisiniz');
      return;
    }

    if (securityCode !== displayCode) {
      setError('Güvenlik kodu hatalı');
      return;
    }

    setError('');
    // API çağrısı yapmadan sadece veriyi topla
    onNext({ 
      tcNo, 
      countryCode,
      phone, 
      fullPhone: countryCode + phone,
      agreedToTerms 
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StepIndicator currentStep={currentStep || 1} maxStepReached={maxStepReached} onStepPress={onStepPress} />
          <Surface style={styles.surface} elevation={2}>
            <View style={styles.header}>
              <Text style={styles.title}>Kişisel Bilgiler</Text>
            </View>

            <TextInput
              label="TC Kimlik No"
              value={tcNo}
              onChangeText={setTcNo}
              mode="outlined"
              keyboardType="numeric"
              maxLength={11}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <View style={styles.phoneContainer}>
              <TextInput
                label="Ülke"
                value={countryCode}
                mode="outlined"
                editable={false}
                style={styles.countryCodeInput}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
              />
              <TextInput
                label="Cep Telefonu"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="numeric"
                maxLength={10}
                style={styles.phoneInput}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
              />
            </View>

            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
              >
                <Checkbox.Android
                  status={agreedToTerms ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxText}>
                    <TouchableOpacity 
                      onPress={() => setShowTermsModal(true)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.termsLink}>
                        Kullanım şartlarını
                      </Text>
                    </TouchableOpacity>
                    {' '}okudum ve kabul ediyorum
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.securityCodeContainer}>
              <TextInput
                label="Güvenlik Kodu"
                value={securityCode}
                onChangeText={setSecurityCode}
                mode="outlined"
                keyboardType="numeric"
                maxLength={4}
                style={styles.securityInput}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
              />
              <Surface style={styles.codeDisplay} elevation={1}>
                <Text style={styles.codeText}>{displayCode}</Text>
              </Surface>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleContinue}
              buttonColor={colors.primary}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Devam
            </Button>
          </Surface>
        </ScrollView>

        <Modal
          visible={showTermsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTermsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Surface style={styles.modalContent} elevation={5}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Kullanım Şartları</Text>
                  <TouchableOpacity 
                    onPress={() => setShowTermsModal(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={true}
                >
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>1. Genel Hükümler</Text>
                    <Text style={styles.modalSectionText}>
                      Bu kullanım şartları, DOU Bank dijital bankacılık hizmetlerinin kullanımına ilişkin koşulları belirler. Hizmeti kullanarak bu şartları kabul etmiş sayılırsınız.
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>2. Hizmet Kapsamı</Text>
                    <Text style={styles.modalSectionText}>
                      DOU Bank, müşterilerine dijital bankacılık işlemlerini gerçekleştirme imkanı sunar. Hesap açma, para transferi, ödeme işlemleri ve diğer bankacılık hizmetlerinden yararlanabilirsiniz.
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>3. Kullanıcı Sorumlulukları</Text>
                    <Text style={styles.modalSectionText}>
                      • Hesap bilgilerinizi güvenli tutmak sizin sorumluluğunuzdadır{'\n'}
                      • Şifrenizi kimseyle paylaşmamalısınız{'\n'}
                      • Hesabınızda yetkisiz işlem fark ederseniz derhal bildirmelisiniz{'\n'}
                      • Doğru ve güncel bilgi vermelisiniz
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>4. Gizlilik</Text>
                    <Text style={styles.modalSectionText}>
                      Kişisel verileriniz KVKK kapsamında korunur ve güvenli şekilde saklanır. Bilgileriniz üçüncü şahıslarla paylaşılmaz.
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>5. Ücretler ve Komisyonlar</Text>
                    <Text style={styles.modalSectionText}>
                      Bazı işlemler için ücret ve komisyon talep edilebilir. Güncel ücret tarifeleri web sitemizde yayınlanmaktadır.
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>6. Değişiklikler</Text>
                    <Text style={styles.modalSectionText}>
                      DOU Bank, kullanım şartlarını değiştirme hakkını saklı tutar. Değişiklikler müşterilere bildirilir.
                    </Text>
                  </View>
                </ScrollView>

                <Button
                  mode="contained"
                  onPress={() => setShowTermsModal(false)}
                  buttonColor={colors.primary}
                  style={styles.modalButton}
                  contentStyle={styles.modalButtonContent}
                >
                  Anladım
                </Button>
              </Surface>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  surface: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  countryCodeInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  phoneInput: {
    flex: 3,
    backgroundColor: colors.surface,
  },
  checkboxWrapper: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 8,
    flexShrink: 1,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text,
    flexWrap: 'wrap',
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  securityCodeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  securityInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  codeDisplay: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 24,
    minHeight: '70%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  modalButton: {
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonContent: {
    paddingVertical: 8,
  },
});
