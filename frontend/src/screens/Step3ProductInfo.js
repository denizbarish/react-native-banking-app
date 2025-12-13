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
  Button,
  Text,
  Surface,
  Checkbox,
  Divider,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';
import StepIndicator from '../components/StepIndicator';

export default function Step3ProductInfo({ onNext, currentStep, maxStepReached, onStepPress, initialData }) {
  const [selectedProducts, setSelectedProducts] = useState(initialData?.selectedProducts || []);
  const [income, setIncome] = useState(initialData?.income || '');
  const [wealthSource, setWealthSource] = useState(initialData?.wealthSource || []);
  const [transactionVolume, setTransactionVolume] = useState(initialData?.transactionVolume || '');
  const [education, setEducation] = useState(initialData?.education || '');
  const [employmentStatus, setEmploymentStatus] = useState(initialData?.employmentStatus || '');
  const [sector, setSector] = useState(initialData?.sector || '');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [dataConsent, setDataConsent] = useState(initialData?.dataConsent || false);
  const [marketingConsent, setMarketingConsent] = useState(initialData?.marketingConsent || false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);

  const [consentModalVisible, setConsentModalVisible] = useState(false);
  const [consentModalContent, setConsentModalContent] = useState({ title: '', content: '' });

  const products = [
    { id: 'vadeSiz', label: 'Vadesiz Hesap' },
    { id: 'vadeli', label: 'Vadeli Hesap' },
    { id: 'yatirim', label: 'Yatırım / Döviz Hesabı' },
    { id: 'krediKarti', label: 'Kredi Kartı' },
  ];

  const wealthSources = [
    { id: 'maas', label: 'Maaş' },
    { id: 'kira', label: 'Kira' },
    { id: 'arac', label: 'Araç' },
    { id: 'miras', label: 'Miras' },
  ];

  const incomeRanges = [
    '0 - 10.000 TL',
    '10.000 - 25.000 TL',
    '25.000 - 50.000 TL',
    '50.000 - 100.000 TL',
    '100.000 TL üzeri',
  ];

  const volumeRanges = [
    '0 - 50.000 TL',
    '50.000 - 100.000 TL',
    '100.000 - 500.000 TL',
    '500.000 TL üzeri',
  ];

  const educationLevels = [
    'İlkokul',
    'Ortaokul',
    'Lise',
    'Ön Lisans',
    'Lisans',
    'Yüksek Lisans',
    'Doktora',
  ];

  const employmentStatuses = [
    'Çalışıyor',
    'Çalışmıyor',
    'Emekli',
    'Öğrenci',
  ];

  const sectors = [
    'Kamu',
    'Özel Sektör',
    'Serbest Meslek',
    'Ticaret',
    'Diğer',
  ];

  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleWealthSource = (sourceId) => {
    if (wealthSource.includes(sourceId)) {
      setWealthSource(wealthSource.filter((id) => id !== sourceId));
    } else {
      setWealthSource([...wealthSource, sourceId]);
    }
  };

  const openPicker = (type, options) => {
    setPickerType(type);
    setPickerOptions(options);
    setPickerVisible(true);
  };

  const handlePickerSelect = (value) => {
    switch(pickerType) {
      case 'income':
        setIncome(value);
        break;
      case 'volume':
        setTransactionVolume(value);
        break;
      case 'education':
        setEducation(value);
        break;
      case 'employment':
        setEmploymentStatus(value);
        break;
      case 'sector':
        setSector(value);
        break;
    }
    setPickerVisible(false);
  };

  const showConsentModal = (type) => {
    if (type === 'data') {
      setConsentModalContent({
        title: 'Kişisel Veri İşleme Onayı',
        content: 'DOU Bank olarak kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmektedir. Başvurunuzun değerlendirilmesi için verilerinizin işlenmesini kabul etmeniz gerekmektedir.',
      });
    } else {
      setConsentModalContent({
        title: 'Ticari Elektronik İleti Onayı',
        content: 'DOU Bank tarafından sunulan kampanya, promosyon ve ürün bilgilerini e-posta, SMS ve diğer iletişim kanalları üzerinden almayı kabul ediyorum.',
      });
    }
    setConsentModalVisible(true);
  };

  const handleContinue = () => {
    if (selectedProducts.length === 0) {
      setError('Lütfen en az bir bankacılık ürünü seçin');
      return;
    }

    if (!income || wealthSource.length === 0 || !transactionVolume || 
        !education || !employmentStatus) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (!dataConsent) {
      setError('Devam etmek için Kişisel Veri İşleme Onayını vermelisiniz');
      return;
    }

    setError('');
    // API çağrısı yapmadan sadece veriyi topla
    onNext({
      selectedProducts,
      income,
      wealthSource,
      transactionVolume,
      education,
      employmentStatus,
      sector,
      occupation,
      email,
      dataConsent,
      marketingConsent,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StepIndicator currentStep={currentStep || 3} maxStepReached={maxStepReached} onStepPress={onStepPress} />
          <Surface style={styles.surface} elevation={2}>
            <View style={styles.header}>
              <Text style={styles.title}>Ürün ve Bilgileriniz</Text>
            </View>

            <Text style={styles.sectionTitle}>
              Lütfen ilgilendiğiniz bankacılık ürünlerini seçiniz
            </Text>

            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.checkboxContainer}
                onPress={() => toggleProduct(product.id)}
              >
                <Checkbox.Android
                  status={selectedProducts.includes(product.id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
                <Text style={styles.checkboxText}>{product.label}</Text>
              </TouchableOpacity>
            ))}

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

            <TextInput
              label="Aylık Ortalama Gelir"
              value={income}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              onPressIn={() => openPicker('income', incomeRanges)}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <Text style={styles.label}>Mal Varlığı Kaynağı</Text>
            {wealthSources.map((source) => (
              <TouchableOpacity
                key={source.id}
                style={styles.checkboxContainer}
                onPress={() => toggleWealthSource(source.id)}
              >
                <Checkbox.Android
                  status={wealthSource.includes(source.id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
                <Text style={styles.checkboxText}>{source.label}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              label="Aylık Tahmini İşlem Hacmi"
              value={transactionVolume}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              onPressIn={() => openPicker('volume', volumeRanges)}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Eğitim Durumu"
              value={education}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              onPressIn={() => openPicker('education', educationLevels)}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Çalışma Durumu"
              value={employmentStatus}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              onPressIn={() => openPicker('employment', employmentStatuses)}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            {employmentStatus === 'Çalışıyor' && (
              <TextInput
                label="Çalıştığınız Sektör"
                value={sector}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="menu-down" />}
                onPressIn={() => openPicker('sector', sectors)}
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
              />
            )}

            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                style={styles.checkboxContainerStyled}
                onPress={() => setDataConsent(!dataConsent)}
                activeOpacity={0.7}
              >
                <Checkbox.Android
                  status={dataConsent ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxText}>
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        showConsentModal('data');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.checkboxTextLink}>
                        Kişisel Veri İşleme Onayı
                      </Text>
                    </TouchableOpacity>
                    {' '}veriyorum
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                style={styles.checkboxContainerStyled}
                onPress={() => setMarketingConsent(!marketingConsent)}
                activeOpacity={0.7}
              >
                <Checkbox.Android
                  status={marketingConsent ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxText}>
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        showConsentModal('marketing');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.checkboxTextLink}>
                        Ticari Elektronik İleti Onayı
                      </Text>
                    </TouchableOpacity>
                    {' '}veriyorum
                  </Text>
                </View>
              </TouchableOpacity>
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
          visible={pickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setPickerVisible(false)}
          >
            <View style={styles.pickerContainer}>
              <Surface style={styles.pickerContent} elevation={5}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Seçim Yapın</Text>
                  <TouchableOpacity onPress={() => setPickerVisible(false)}>
                    <Text style={styles.pickerClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.pickerScroll}>
                  {pickerOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.pickerOption}
                      onPress={() => handlePickerSelect(option)}
                    >
                      <Text style={styles.pickerOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Surface>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={consentModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setConsentModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.consentModalOverlay}
            activeOpacity={1}
            onPress={() => setConsentModalVisible(false)}
          >
            <View style={styles.consentModalContainer}>
              <Surface style={styles.consentModalContent} elevation={5}>
                <View style={styles.consentModalHeader}>
                  <Text style={styles.consentModalTitle}>{consentModalContent.title}</Text>
                  <TouchableOpacity onPress={() => setConsentModalVisible(false)}>
                    <Text style={styles.consentModalClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.consentModalScroll}>
                  <Text style={styles.consentModalText}>{consentModalContent.content}</Text>
                </ScrollView>
                <Button
                  mode="contained"
                  onPress={() => setConsentModalVisible(false)}
                  buttonColor={colors.primary}
                  style={styles.consentModalButton}
                  contentStyle={styles.consentModalButtonContent}
                >
                  Anladım
                </Button>
              </Surface>
            </View>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  checkboxWrapper: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContainerStyled: {
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
  checkboxTextLink: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  menuButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  menuButtonText: {
    fontSize: 14,
    color: colors.placeholder,
  },
  menuButtonTextSelected: {
    fontSize: 14,
    color: colors.text,
  },
  divider: {
    marginVertical: 24,
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
  consentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  consentModalContainer: {
    justifyContent: 'flex-end',
  },
  consentModalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: '70%',
    maxHeight: '90%',
  },
  consentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  consentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  consentModalClose: {
    fontSize: 28,
    color: colors.textSecondary,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  consentModalScroll: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  consentModalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  consentModalButton: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  consentModalButtonContent: {
    paddingVertical: 8,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    justifyContent: 'flex-end',
  },
  pickerContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: '60%',
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  pickerClose: {
    fontSize: 28,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  pickerScroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  pickerOption: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerOptionText: {
    fontSize: 18,
    color: colors.text,
  },
});
