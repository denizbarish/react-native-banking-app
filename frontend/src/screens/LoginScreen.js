import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';

export default function LoginScreen({ onStartApplication }) {
  const [tcNo, setTcNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!tcNo || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
      setError('TC Kimlik No 11 haneli olmalıdır');
      return;
    }

    if (!/^\d+$/.test(password)) {
      setError('Şifre sadece rakamlardan oluşmalıdır');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authService.login(tcNo, password);
      console.log('Login successful:', response);
    } catch (err) {
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.bankName}>DOU BANK</Text>
            <Text style={styles.tagline}>Güvenli Bankacılık</Text>
          </View>

        <Surface style={styles.formContainer} elevation={2}>
          <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

          <TextInput
            label="TC Kimlik No"
            value={tcNo}
            onChangeText={setTcNo}
            mode="outlined"
            keyboardType="numeric"
            maxLength={11}
            autoCapitalize="none"
            left={<TextInput.Icon icon="card-account-details-outline" />}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholder="11 haneli TC Kimlik No"
          />

          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            keyboardType="numeric"
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholder="Sadece rakam"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            buttonColor={colors.primary}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>

          <Button
            mode="text"
            onPress={() => {
              console.log('Navigate to forgot password');
            }}
            textColor={colors.primary}
            style={styles.forgotButton}
          >
            Şifremi Unuttum
          </Button>
        </Surface>

        <View style={styles.applicationContainer}>
          <Text style={styles.applicationText}>
            Dijital Bankacılık müşterimiz olmak için
          </Text>
          <Button
            mode="contained"
            onPress={onStartApplication}
            buttonColor={colors.primary}
            style={styles.applicationButton}
            contentStyle={styles.applicationButtonContent}
          >
            Hemen Başvur
          </Button>
        </View>

        <Text style={styles.versionText}>v0.0.1</Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  bankName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    marginTop: 8,
  },
  applicationContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  applicationText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  applicationButton: {
    borderRadius: 8,
    width: '100%',
  },
  applicationButtonContent: {
    paddingVertical: 8,
  },
  versionText: {
    textAlign: 'center',
    color: colors.placeholder,
    fontSize: 12,
    marginTop: 24,
  },
});
