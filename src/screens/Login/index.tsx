import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import { loginUser } from '../../services/auth';

import {
  saveUser,
} from '../../storage/auth';

import { styles } from './styles';

export default function LoginScreen() {
  const navigation =
    useNavigation<any>();

  const [email, setEmail] =
    useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {
      if (
        !email ||
        !password
      ) {
        setError(
          'Email dan password wajib diisi',
        );
        return;
      }

      setLoading(true);
      setError('');

      try {
        const user = await loginUser(
          email,
          password,
        );

        if (!user) {
          setError(
            'Email atau password salah',
          );
          return;
        }

        await saveUser(user);
        navigation.replace('Main');
      } catch (err: any) {
        console.log('LOGIN ERROR:', err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Terjadi kesalahan saat login';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View
          style={styles.header}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />

          <Text
            style={
              styles.appName
            }
          >
            SIMPROTIK
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Sistem Informasi
            Manajemen Proyek
            UPA TIK
          </Text>
        </View>

        {/* FORM */}
        <View
          style={styles.card}
        >
          <Text
            style={
              styles.title
            }
          >
            Selamat Datang
          </Text>

          <Text
            style={styles.desc}
          >
            Silakan login
            untuk
            melanjutkan
          </Text>

          {/* EMAIL */}
          <Text
            style={
              styles.label
            }
          >
            Email
          </Text>

          <TextInput
            placeholder="Masukkan email"
            value={email}
            onChangeText={
              setEmail
            }
            style={
              styles.input
            }
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <Text
            style={
              styles.label
            }
          >
            Password
          </Text>

          <TextInput
            placeholder="Masukkan password"
            secureTextEntry
            value={password}
            onChangeText={
              setPassword
            }
            style={
              styles.input
            }
          />

          {!!error && (
            <Text
              style={
                styles.error
              }
            >
              {error}
            </Text>
          )}

          {/* BUTTON */}
          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              handleLogin
            }
            disabled={loading}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Text
          style={
            styles.footer
          }
        >
          © 2026
          SIMPROTIK
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}