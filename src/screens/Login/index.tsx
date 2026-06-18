import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {
  getBackendStaffUsers,
  StaffUser,
} from '../../services/mobile';
import {saveStaffUUID, saveUser} from '../../storage/auth';

import {styles} from './styles';
import {colors} from '../../theme';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectingUuid, setSelectingUuid] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    loadStaffUsers();
  }, []);

  const loadStaffUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const users = await getBackendStaffUsers();
      setStaffUsers(users);

      if (users.length === 0) {
        setError('Belum ada data staf dari backend.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Gagal mengambil data staf dari backend.',
      );
      setStaffUsers([]);
    } finally {
      setLoading(false);
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
        email: staff.email,
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
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

        <Text style={styles.appName}>SIMPROTIK</Text>

        <Text style={styles.subtitle}>
          Sistem Informasi Manajemen Proyek UPA TIK
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Pilih Akun Demo Staf</Text>

        <Text style={styles.desc}>
          Sementara SSO belum tersedia, pilih salah satu staf dari data backend.
        </Text>

        {!!error && <Text style={styles.modalError}>{error}</Text>}

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
            <Text style={styles.loadingText}>Mengambil data staf...</Text>
          </View>
        ) : (
          <View style={styles.staffList}>
            {staffUsers.map(staff => (
              <TouchableOpacity
                key={staff.uuid}
                style={styles.staffItem}
                onPress={() => handleSelectStaff(staff)}
                disabled={Boolean(selectingUuid)}>
                <View style={styles.staffAvatar}>
                  <Text style={styles.staffAvatarText}>{getInitials(staff.name)}</Text>
                </View>

                <View style={styles.staffInfo}>
                  <Text style={styles.staffName} numberOfLines={1}>
                    {staff.name}
                  </Text>
                  <Text style={styles.staffMeta} numberOfLines={2}>
                    {staff.division}
                  </Text>
                  <Text style={styles.staffNip}>{staff.nip}</Text>
                </View>

                {selectingUuid === staff.uuid && (
                  <ActivityIndicator color={colors.primaryBlue} />
                )}
              </TouchableOpacity>
            ))}

            {staffUsers.length === 0 && !error && (
              <Text style={styles.emptyText}>Data staf belum tersedia.</Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={loadStaffUsers} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Memuat...' : 'Muat Ulang Staf'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>2026 SIMPROTIK</Text>
    </ScrollView>
  );
}
