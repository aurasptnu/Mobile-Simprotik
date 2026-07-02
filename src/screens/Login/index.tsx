import React, {useState} from 'react';

import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {styles} from './styles';
import {SSO_LOGIN_URL} from '../../config/api';

const profileIcon = require('../../assets/images/profile.png');
const arrowIcon = require('../../assets/images/panah.png');

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [error, setError] = useState('');

  const handleSSOLogin = async () => {
    setError('');

    try {
      const supported = await Linking.canOpenURL(SSO_LOGIN_URL);
      if (!supported) {
        setError('Perangkat tidak bisa membuka halaman SSO.');
        return;
      }

      await Linking.openURL(SSO_LOGIN_URL);
    } catch (err: any) {
      setError(err?.message || 'Gagal membuka halaman SSO.');
    }
  };

  const handleNavigateManual = () => {
    navigation.navigate('LoginManual');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

        <Text style={styles.appName}>SIMPROTIK</Text>

        <Text style={styles.subtitle}>
          Sistem Informasi Manajemen Proyek UPA TIK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Masuk ke SIMPROTIK</Text>

        <Text style={styles.desc}>
          Gunakan akun SSO Universitas Lampung untuk mengakses sistem.
        </Text>

        <TouchableOpacity style={styles.ssoButton} onPress={handleSSOLogin}>
          <View style={styles.ssoButtonContent}>
            <View style={styles.ssoButtonLabel}>
              <Image source={profileIcon} style={styles.buttonIcon} />
              <View style={styles.ssoLabelText}>
                <Text style={styles.ssoButtonText}>Masuk dengan SSO Unila</Text>
                <Text style={styles.ssoButtonSubtitle}>sso.unila.ac.id - akun civitas academica</Text>
              </View>
            </View>
            <Image source={arrowIcon} style={styles.buttonArrow} />
          </View>
        </TouchableOpacity>

        <View style={styles.ssoHintLink}>
          <Text style={styles.ssoHintText}>SSO dalam maintenance?</Text>
          <TouchableOpacity onPress={handleNavigateManual}>
            <Text style={[styles.ssoHintText, styles.ssoHintStrong]}>Masuk dengan NIP</Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.modalError}>{error}</Text>}
      </View>

      <Text style={styles.footer}>2026 UPA TIK Universitas Lampung</Text>
    </ScrollView>
  );
}


