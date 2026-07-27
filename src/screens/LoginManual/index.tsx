import React, {useState} from 'react';

import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {loginManualUser} from '../../services/mobile';
import {saveStaffUUID, saveUser} from '../../storage/auth';
import {styles} from './styles';
import {colors} from '../../theme';

const arrowIcon = require('../../assets/images/panah.png');
const hideIcon = require('../../assets/images/hide.png');
const showIcon = require('../../assets/images/show.png');

export default function LoginManualScreen() {
  const navigation = useNavigation<any>();

  const [manualUsername, setManualUsername] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    const username = manualUsername.trim();
    const password = manualPassword.trim();

    setError('');

    if (!username || !password) {
      setError('Username SSO/NIP dan password wajib diisi.');
      return;
    }

    setManualLoading(true);

    try {
      const matchedStaff = await loginManualUser(username, password);

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
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Gagal login manual.',
      );
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Masuk dengan NIP</Text>

        <Text style={styles.desc}>
          Gunakan username SSO atau NIP yang sudah aktif di SIMPROTIK.
        </Text>

        {!!error && <Text style={styles.modalError}>{error}</Text>}

        <TextInput
          value={manualUsername}
          onChangeText={setManualUsername}
          placeholder="Masukkan username SSO / NIP"
          keyboardType="default"
          autoCapitalize="none"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            value={manualPassword}
            onChangeText={setManualPassword}
            placeholder="Masukkan password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.passwordInput]}
          />

          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}>
            <Image
              source={showPassword ? hideIcon : showIcon}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualLogin}
          disabled={manualLoading}>
          <Text style={styles.buttonText}>
            {manualLoading ? 'Memproses...' : 'Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}>
          <Image source={arrowIcon} style={styles.backArrow} />
          <Text style={styles.backLinkText}>Kembali ke SSO</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>2026 SIMPROTIK</Text>
    </ScrollView>
  );
}