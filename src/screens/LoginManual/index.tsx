import React, {useState} from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {getBackendStaffUsers, StaffUser} from '../../services/mobile';
import {saveStaffUUID, saveUser} from '../../storage/auth';
import {styles} from './styles';
import {colors} from '../../theme';

const arrowIcon = require('../../assets/images/panah.png');

export default function LoginManualScreen() {
  const navigation = useNavigation<any>();

  const [manualNip, setManualNip] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState('');

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
      const users = await getBackendStaffUsers();
      const matchedStaff = users.find(staff => String(staff.nip).trim() === nip);

      if (!matchedStaff) {
        setError('NIP tidak terdaftar sebagai staf SIMPROTIK.');
        return;
      }

      if (password !== 'simprotik123') {
        setError('Password salah.');
        return;
      }

      await saveUser({
        id: matchedStaff.uuid,
        uuid: matchedStaff.uuid,
        name: matchedStaff.name,
        role: 'staff',
        division: matchedStaff.division,
        nip: matchedStaff.nip,
        raw: matchedStaff.raw,
      });
      await saveStaffUUID(matchedStaff.uuid);

      navigation.replace('Main');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal login manual.');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Masuk dengan NIP</Text>

        <Text style={styles.desc}>
          Pastikan NIP terdaftar.
        </Text>

        {!!error && <Text style={styles.modalError}>{error}</Text>}

        <TextInput
          value={manualNip}
          onChangeText={setManualNip}
          placeholder="Masukkan NIP"
          keyboardType="number-pad"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          value={manualPassword}
          onChangeText={setManualPassword}
          placeholder="Masukkan password"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualLogin}
          disabled={manualLoading}
        >
          <Text style={styles.buttonText}>
            {manualLoading ? 'Memproses...' : 'Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Image source={arrowIcon} style={styles.backArrow} />
          <Text style={styles.backLinkText}>Kembali ke SSO</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>2026 SIMPROTIK</Text>
    </ScrollView>
  );
}
