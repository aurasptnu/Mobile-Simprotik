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

<<<<<<< HEAD
=======
import {
  getBackendStaffUsers,
  loginManualUser,
  StaffUser,
} from '../../services/mobile';
import {saveStaffUUID, saveUser} from '../../storage/auth';

>>>>>>> 05964b50a2d725bf61e8721fcda4635c89242ba3
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

<<<<<<< HEAD
  const handleNavigateManual = () => {
    navigation.navigate('LoginManual');
=======
  const handleManualLogin = async () => {
    const nip = manualNip.trim();
    const password = manualPassword.trim();
    setError('');

    if (!nip || !password) {
      setError('NIP dan password wajib diisi.');
      return;
    }

    setManualLoading(true);

    try {
      const matchedStaff = await loginManualUser(nip, password);
      await handleSelectStaff(matchedStaff);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Gagal login manual.',
      );
    } finally {
      setManualLoading(false);
    }
  };

  const handleSelectStaff = async (staff: StaffUser) => {
    setSelectingUuid(staff.uuid);
    setError('');

    try {
      await saveUser({
        id: staff.uuid,
        uuid: staff.uuid,
        name: staff.name,
        role: 'staff',
        division: staff.division,
        nip: staff.nip,
        raw: staff.raw,
      });
      await saveStaffUUID(staff.uuid);

      navigation.replace('Main');
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan akun demo.');
    } finally {
      setSelectingUuid(null);
    }
>>>>>>> 05964b50a2d725bf61e8721fcda4635c89242ba3
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


