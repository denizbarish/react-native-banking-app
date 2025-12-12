import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  Checkbox,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';

export default function Step5CustomerRepresentative({ onComplete, currentStep, maxStepReached, onStepPress }) {
  const [hearingImpaired, setHearingImpaired] = useState(false);

  const handleConnect = () => {
    onComplete({ hearingImpaired });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StepIndicator currentStep={currentStep || 5} maxStepReached={maxStepReached} onStepPress={onStepPress} />
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.header}>
            <Text style={styles.title}>Müşteri Temsilcisi</Text>
          </View>

          <Text style={styles.mainText}>
            Müşteri Temsilcisine Bağlanacaksınız
          </Text>

          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/call-centre.jpg')}
              style={styles.representativeImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.infoContainer}>
            <Surface style={styles.infoCard} elevation={1}>
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={styles.infoText}>
                Görüşme ortalama 5-10 dakika sürmektedir
              </Text>
            </Surface>

            <Surface style={styles.infoCard} elevation={1}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>
                Görüşme kaydedilecek ve güvenlik amaçlı saklanacaktır
              </Text>
            </Surface>

            <Surface style={styles.infoCard} elevation={1}>
              <Text style={styles.infoIcon}>✅</Text>
              <Text style={styles.infoText}>
                Kimlik doğrulama ve son kontroller yapılacaktır
              </Text>
            </Surface>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox.Android
              status={hearingImpaired ? 'checked' : 'unchecked'}
              onPress={() => setHearingImpaired(!hearingImpaired)}
              color={colors.primary}
              uncheckedColor={colors.textSecondary}
            />
            <Text style={styles.checkboxText}>İşitme Engelliyim</Text>
          </View>

          {hearingImpaired && (
            <Surface style={styles.noticeCard} elevation={0}>
              <Text style={styles.noticeText}>
                İşitme engelli müşterilerimiz için özel temsilcimiz size yazılı
                iletişim ile yardımcı olacaktır.
              </Text>
            </Surface>
          )}

          <Button
            mode="contained"
            onPress={handleConnect}
            buttonColor={colors.primary}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Müşteri Temsilcisine Bağlan
          </Button>

          <Text style={styles.footerText}>
            Başvurunuz tamamlandığında size bilgi verilecektir
          </Text>
        </Surface>
      </ScrollView>
    </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  mainText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  representativeImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  noticeCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  button: {
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
