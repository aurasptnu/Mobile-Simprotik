<<<<<<< HEAD
import React, {useEffect, useState} from 'react';

=======
import React, {useState} from 'react';
>>>>>>> 4fe53bb8d09296a860bb505e5067bb00f6119ed7
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {styles} from './styles';

const profileIcon = require('../../assets/images/profile.png');
const arrowIcon = require('../../assets/images/panah.png');

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [error, setError] = useState('');

<<<<<<< HEAD
  useEffect(() => {
    const handleIncomingUrl = async (url?: string | null) => {
      if (!url) return;

      console.log('LOGIN SCREEN URL:', url);

      const parsed = url.match(/[?&](token|code)=[^&]+/);
      if (!parsed) return;

      const paramName = parsed[1];
      const token = new URL(url).searchParams.get(paramName) || '';

      if (!token) return;

      console.log('SSO token received:', token);
    };

    Linking.getInitialURL().then(handleIncomingUrl);
    const subscription = Linking.addEventListener('url', ({url}) => handleIncomingUrl(url));

    return () => subscription?.remove();
  }, []);

  const handleSSOLogin = async () => {
=======
  const handleSSOLogin = () => {
>>>>>>> 4fe53bb8d09296a860bb505e5067bb00f6119ed7
    setError('');
    navigation.navigate('SSOWebView');
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
            <Text style={[styles.ssoHintText, styles.ssoHintStrong]}>Masuk manual</Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.modalError}>{error}</Text>}
      </View>

      <Text style={styles.footer}>2026 UPA TIK Universitas Lampung</Text>
    </ScrollView>
  );
}
