import React, {useState} from 'react';

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

import {useNavigation} from '@react-navigation/native';

import {getStaffUUIDFromBackend, loginUser} from '../../services/auth';
import {saveStaffUUID, saveUser} from '../../storage/auth';

import {styles} from './styles';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await loginUser(email, password);

      if (!user) {
        setError('Email atau password salah');
        return;
      }

      const staffUUID = await getStaffUUIDFromBackend(user.email);

      if (!staffUUID) {
        setError('UUID staf tidak ditemukan dari backend.');
        return;
      }

      await saveUser(user);
      await saveStaffUUID(staffUUID);

      navigation.replace('Main');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

          <Text style={styles.appName}>SIMPROTIK</Text>

          <Text style={styles.subtitle}>
            Sistem Informasi Manajemen Proyek UPA TIK
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Selamat Datang</Text>

          <Text style={styles.desc}>Silakan login untuk melanjutkan</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Masukkan password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Memuat...' : 'Masuk'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>2026 SIMPROTIK</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
