import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAMERA_SIZE = SCREEN_WIDTH * 0.8;

export default function Step4FaceVerification({ onNext, currentStep, maxStepReached, onStepPress }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [verificationStep, setVerificationStep] = useState('permission'); // permission, scanning, turnLeft, turnRight, complete
  const [instruction, setInstruction] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    if (cameraPermissionGranted && verificationStep === 'permission') {
      setVerificationStep('scanning');
      startFaceScanning();
    }
  }, [cameraPermissionGranted]);

  const requestCameraPermission = async () => {
    setLoading(true);
    setInstruction('Kamera erişimi isteniyor...');
    
    try {
      const result = await requestPermission();
      console.log('Kamera izni sonucu:', result);
      
      if (result.granted) {
        setCameraPermissionGranted(true);
        setInstruction('Kamera erişimi sağlandı');
        setLoading(false);
      } else {
        setLoading(false);
        setInstruction('Kamera erişimi reddedildi');
        Alert.alert(
          'Kamera İzni Gerekli',
          'Yüz doğrulama için kamera erişimine izin vermeniz gerekmektedir.',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Tekrar İzin İste', onPress: requestCameraPermission }
          ]
        );
      }
    } catch (error) {
      console.error('Kamera izni hatası:', error);
      setLoading(false);
      setInstruction('Kamera erişimi sağlanamadı');
      Alert.alert(
        'Hata', 
        'Kamera erişimi sağlanamadı. Lütfen uygulama ayarlarından kamera iznini kontrol edin.\n\nHata: ' + (error.message || 'Bilinmeyen hata')
      );
    }
  };

  const startFaceScanning = () => {
    setLoading(true);
    setInstruction('Yüzünüz taranıyor...');
    
    setTimeout(() => {
      setVerificationStep('turnLeft');
      setInstruction('Lütfen başınızı SOLA çevirin');
      setLoading(false);
      
      setTimeout(() => {
        checkLeftTurn();
      }, 3000);
    }, 2000);
  };

  const checkLeftTurn = () => {
    setLoading(true);
    setInstruction('Sol tarafa bakış doğrulanıyor...');
    
    setTimeout(() => {
      setVerificationStep('turnRight');
      setInstruction('Lütfen başınızı SAĞA çevirin');
      setLoading(false);
      
      setTimeout(() => {
        checkRightTurn();
      }, 3000);
    }, 2000);
  };

  const checkRightTurn = () => {
    setLoading(true);
    setInstruction('Sağ tarafa bakış doğrulanıyor...');
    
    setTimeout(() => {
      setVerificationStep('complete');
      setLoading(false);
      setVerified(true);
      setInstruction('Yüz doğrulama başarılı!');
      
      setTimeout(() => {
        onNext({ faceVerified: true });
      }, 2000);
    }, 2000);
  };

  const handleVerify = async () => {
    if (!cameraPermissionGranted) {
      requestCameraPermission();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <StepIndicator currentStep={currentStep || 4} maxStepReached={maxStepReached} onStepPress={onStepPress} />
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.header}>
            <Text style={styles.title}>Yüz Doğrulama</Text>
          </View>

          {cameraPermissionGranted && !verified && (
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.faceFrame} />
                  {verificationStep === 'turnLeft' && (
                    <View style={styles.arrowLeft}>
                      <View style={styles.arrowCircle}>
                        <Text style={styles.arrowIcon}>←</Text>
                      </View>
                    </View>
                  )}
                  {verificationStep === 'turnRight' && (
                    <View style={styles.arrowRight}>
                      <View style={styles.arrowCircle}>
                        <Text style={styles.arrowIcon}>→</Text>
                      </View>
                    </View>
                  )}
                </View>
              </CameraView>
            </View>
          )}

          {!cameraPermissionGranted && !verified && (
            <View style={styles.iconContainer}>
              <Text style={styles.faceIcon}>👤</Text>
            </View>
          )}

          {verified && (
            <View style={styles.iconContainer}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}

          {verificationStep === 'permission' && !cameraPermissionGranted && (
            <>
              <Text style={styles.description}>
                Kimlik doğrulama için yüz tanıma sistemini kullanacağız.
              </Text>
              <Text style={styles.instructions}>
                • Yüzünüzün tamamen görünür olduğundan emin olun{'\n'}
                • İyi aydınlatılmış bir ortamda bulunun{'\n'}
                • Gözlük takıyorsanız çıkarın{'\n'}
                • Talimatları takip edin
              </Text>
            </>
          )}

          {cameraPermissionGranted && !verified && (
            <Surface style={styles.instructionBox} elevation={1}>
              <Text style={styles.instructionTitle}>Talimat</Text>
              <Text style={styles.instructionText}>
                {verificationStep === 'scanning' && 'Lütfen yüzünüzü kameraya doğru tutun ve hareketsiz kalın.'}
                {verificationStep === 'turnLeft' && 'Başınızı yavaşça SOLA çevirin ve birkaç saniye bekleyin.'}
                {verificationStep === 'turnRight' && 'Başınızı yavaşça SAĞA çevirin ve birkaç saniye bekleyin.'}
              </Text>
            </Surface>
          )}

          {instruction && (
            <Text style={[styles.loadingText, verified && styles.successText]}>
              {instruction}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleVerify}
            buttonColor={colors.primary}
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={loading || verified || cameraPermissionGranted}
          >
            {verified ? 'Devam Ediliyor...' : cameraPermissionGranted ? 'Doğrulama Devam Ediyor...' : 'Yüz Doğrulamayı Başlat'}
          </Button>
        </Surface>
      </View>
    </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  cameraContainer: {
    alignItems: 'center',
    marginVertical: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 20,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: CAMERA_SIZE * 0.7,
    height: CAMERA_SIZE * 0.9,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: CAMERA_SIZE * 0.35,
    backgroundColor: 'transparent',
  },
  arrowLeft: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -40,
  },
  arrowRight: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -40,
  },
  arrowCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(139, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowIcon: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  faceIcon: {
    fontSize: 80,
  },
  verifiedIcon: {
    fontSize: 80,
    color: colors.success,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  instructionBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginVertical: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 24,
    fontWeight: '600',
  },
  successText: {
    fontSize: 18,
    color: colors.success,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 24,
  },
  button: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
