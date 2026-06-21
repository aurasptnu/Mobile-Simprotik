import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  getUser,
  logoutUser,
} from '../../storage/auth';

import { styles } from './styles';

export default function ProfileScreen() {
  const navigation =
    useNavigation<any>();

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    loadUser();

    const unsubscribe =
      navigation.addListener(
        'focus',
        loadUser,
      );

    return unsubscribe;
  }, [navigation]);

  const loadUser =
    async () => {
      const loggedUser =
        await getUser();

      setUser(loggedUser);
    };

  const handleLogout =
    async () => {
      await logoutUser();

      navigation.replace(
        'Login',
      );
    };

  const roleLabel = user?.role
    ? `Peran: ${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`
    : 'Peran: Staf';

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Profil Saya</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{roleLabel}</Text>
        <Text style={styles.identity}>{user?.nip}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>Data Diri</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Divisi</Text>
          <Text style={styles.detailValue}>{user?.division ?? '-'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>NIP</Text>
          <Text style={styles.detailValue}>{user?.nip ?? '-'}</Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
