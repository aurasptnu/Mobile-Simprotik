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

import { users } from '../../data/users';

import {
  saveUser,
  getUser,
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

      const user =
        users.find(
          u =>
            u.email
              .trim()
              .toLowerCase() ===
              email
                .trim()
                .toLowerCase() &&
            u.password ===
              password,
        );

      if (user) {
        try {
          console.log(
            'LOGIN SUCCESS:',
            user,
          );

          await saveUser(
            user,
          );

          const savedUser =
            await getUser();

          console.log(
            'USER TERSIMPAN:',
            savedUser,
          );

          navigation.replace(
            'Main',
          );
        } catch (err) {
          console.log(
            'LOGIN ERROR:',
            err,
          );
        }
      } else {
        setError(
          'Email atau password salah',
        );
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
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Masuk
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