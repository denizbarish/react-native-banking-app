import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import {
  TextInput,
  Button,
  Text,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';
import StepIndicator from '../components/StepIndicator';

export default function Step2SmsVerification({ onNext, phoneNumber, onTimeout, currentStep, maxStepReached, onStepPress }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // SMS gönder
    const sendSMS = async () => {
      try {
        await authService.sendSMS(phoneNumber);
      } catch (err) {
        console.error('SMS gönderme hatası:', err);
      }
    };
    sendSMS();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowTimeoutModal(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTimeoutConfirm = () => {
    setShowTimeoutModal(false);
    if (onTimeout) {
      onTimeout();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / 180;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleVerify = async () => {
    if (!code) {
      setError('Lütfen SMS kodunu girin');
      return;
    }

    if (code.length !== 6) {
      setError('SMS kodu 6 haneli olmalıdır');
      return;
    }

    if (timeLeft === 0) {
      setError('Süre doldu. Lütfen yeni kod isteyin');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Backend'e SMS doğrulama isteği gönder
      await authService.verifySMS(phoneNumber, code);
      onNext({ smsCode: code, smsVerified: true });
    } catch (err) {
      setError(err.message || 'SMS doğrulama başarısız. Lütfen kodu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await authService.sendSMS(phoneNumber);
      setTimeLeft(180);
      setCode('');
      setError('');
      Alert.alert('Başarılı', 'SMS kodu yeniden gönderildi.');
    } catch (err) {
      Alert.alert('Hata', err.message || 'SMS gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <StepIndicator currentStep={currentStep || 2} maxStepReached={maxStepReached} onStepPress={onStepPress} />
          <Surface style={styles.surface} elevation={2}>
            <View style={styles.header}>
              <Text style={styles.title}>SMS Onay</Text>
            </View>

            <Text style={styles.description}>
              {phoneNumber} numaralı telefonunuza gönderilen 6 haneli kodu giriniz
            </Text>

            <View style={styles.timerContainer}>
              <View style={styles.progressCircle}>
                <Svg width={120} height={120} style={styles.svg}>
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={colors.border}
                    strokeWidth="8"
                    fill="none"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={timeLeft < 60 ? colors.error : colors.primary}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 60 60)`}
                  />
                </Svg>
                <View style={styles.timerTextContainer}>
                  <Text style={[
                    styles.timerText,
                    timeLeft < 60 && styles.timerTextWarning
                  ]}>
                    {formatTime(timeLeft)}
                  </Text>
                </View>
              </View>
            </View>

            <TextInput
              label="SMS Kodu"
              value={code}
              onChangeText={setCode}
              mode="outlined"
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textAlign="center"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleVerify}
              buttonColor={colors.primary}
              style={styles.button}
              contentStyle={styles.buttonContent}
              disabled={timeLeft === 0 || loading}
              loading={loading}
            >
              {loading ? 'Doğrulanıyor...' : 'Onayla'}
            </Button>

            <Button
              mode="text"
              onPress={handleResend}
              textColor={colors.primary}
              style={styles.resendButton}
              disabled={timeLeft > 0}
            >
              Kodu Tekrar Gönder
            </Button>
          </Surface>
        </View>

        <Modal
          visible={showTimeoutModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <Surface style={styles.modalContent} elevation={5}>
              <Text style={styles.modalTitle}>Süre Doldu</Text>
              <Text style={styles.modalText}>
                Doğrulama süresi doldu. Lütfen daha sonra tekrar deneyiniz.
              </Text>
              <Button
                mode="contained"
                onPress={handleTimeoutConfirm}
                buttonColor={colors.primary}
                style={styles.modalButton}
              >
                Ana Sayfaya Dön
              </Button>
            </Surface>
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
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
  },
  surface: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressCircle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerTextWarning: {
    color: colors.error,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    fontSize: 24,
    letterSpacing: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButton: {
    borderRadius: 8,
  },
});
