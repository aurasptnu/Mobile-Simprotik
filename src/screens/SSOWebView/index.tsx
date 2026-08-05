import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import { SSO_LOGIN_URL } from '../../config/api';
import { loginWithSSOToken } from '../../services/mobile';
import { saveStaffUUID, saveUser } from '../../storage/auth';
import { styles } from './styles';

export default function SSOWebViewScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const handledTokenRef = useRef(false);

  const processSSOCallback = async (url: string) => {
    if (handledTokenRef.current) return;

    try {
      // Check for backend redirect parameters
      const userMatch = url.match(/[?&]sso_user=([^&]+)/);
      const pendingMatch = url.match(/[?&]sso_pending=([^&]+)/);
      const errorMatch = url.match(/[?&]sso_error=([^&]+)/);
      const tokenMatch = url.match(/[?&]token=([^&]+)/);

      if (errorMatch) {
        handledTokenRef.current = true;
        setVerifying(false);
        throw new Error(decodeURIComponent(errorMatch[1]));
      }

      if (pendingMatch) {
        handledTokenRef.current = true;
        setVerifying(false);
        throw new Error('Akun SSO sudah tercatat dan menunggu aktivasi Admin Akses.');
      }

      let matchedStaff: any = null;

      if (userMatch && userMatch[1]) {
        handledTokenRef.current = true;
        setVerifying(true);
        setError('');

        // Parse base64 sso_user payload
        let base64 = userMatch[1].replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
          base64 += new Array(5 - pad).join('=');
        }

        // Decode base64
        let jsonStr = '';
        try {
          const atobFn = (globalThis as any).atob;
          if (typeof atobFn === 'function') {
            jsonStr = decodeURIComponent(escape(atobFn(base64)));
          } else {
            throw new Error('atob not found');
          }
        } catch (e) {
          // Fallback if atob fails
          jsonStr = '{"error": "Decode failed"}';
        }

        const payload = JSON.parse(jsonStr);
        if (payload && payload.uuid) {
          matchedStaff = payload;
          if (matchedStaff.token) {
            const { saveAuthToken } = require('../../storage/auth');
            await saveAuthToken(matchedStaff.token);
          }
        }
      } else if (tokenMatch && tokenMatch[1]) {
        handledTokenRef.current = true;
        setVerifying(true);
        setError('');

        const ssoToken = decodeURIComponent(tokenMatch[1]);
        matchedStaff = await loginWithSSOToken(ssoToken);
      } else {
        return; // No match, do nothing
      }

      if (!matchedStaff || !matchedStaff.uuid) {
        throw new Error('Gagal mendapatkan data pengguna dari SSO.');
      }

      const role = String(matchedStaff.peran || matchedStaff.role || '').toLowerCase();
      if (role !== 'staf' && role !== 'staff') {
        throw new Error('Aplikasi mobile hanya tersedia untuk pengguna dengan role Staf.');
      }

      await saveUser({
        id: matchedStaff.uuid,
        uuid: matchedStaff.uuid,
        name: matchedStaff.nama_lengkap || matchedStaff.name,
        role: 'staff',
        division: matchedStaff.divisi?.nama_divisi || matchedStaff.division || '',
        nip: matchedStaff.NIP || matchedStaff.nip || '',
        raw: matchedStaff.raw || matchedStaff,
      });
      await saveStaffUUID(matchedStaff.uuid);

      navigation.replace('Main');
    } catch (err: any) {
      handledTokenRef.current = false;
      setVerifying(false);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Gagal melakukan verifikasi token SSO.',
      );
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    if (
      url.includes('/auth/sso/callback') ||
      url.includes('token=') ||
      url.includes('sso_user=') ||
      url.includes('sso_pending=') ||
      url.includes('sso_error=')
    ) {
      processSSOCallback(url);
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;

    if (
      url.includes('/auth/sso/callback') ||
      url.includes('token=') ||
      url.includes('sso_user=') ||
      url.includes('sso_pending=') ||
      url.includes('sso_error=')
    ) {
      processSSOCallback(url);
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SSO manAkses Unila</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Tutup</Text>
        </TouchableOpacity>
      </View>

      {!!error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: SSO_LOGIN_URL }}
          originWhitelist={['*']}
          setSupportMultipleWindows={false}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          style={styles.webview}
        />

        {(loading || verifying) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0052CC" />
            <Text style={styles.loadingText}>
              {verifying
                ? 'Memverifikasi sesi SSO...'
                : 'Memuat halaman SSO...'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
