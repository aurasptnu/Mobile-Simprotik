import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

import {SSO_LOGIN_URL} from '../../config/api';
import {loginWithSSOToken} from '../../services/mobile';
import {saveStaffUUID, saveUser} from '../../storage/auth';
import {styles} from './styles';

export default function SSOWebViewScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const handledTokenRef = useRef(false);

  const processSSOCallback = async (url: string) => {
    if (handledTokenRef.current) return;

    try {
      // Find token query parameter from callback URL
      const tokenMatch = url.match(/[?&]token=([^&]+)/);
      if (!tokenMatch || !tokenMatch[1]) return;

      handledTokenRef.current = true;
      setVerifying(true);
      setError('');

      const ssoToken = decodeURIComponent(tokenMatch[1]);
      const matchedStaff = await loginWithSSOToken(ssoToken);

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
    const {url} = navState;

    if (
      url.includes('/auth/sso/callback') ||
      url.includes('token=')
    ) {
      processSSOCallback(url);
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    const {url} = request;

    if (
      url.includes('/auth/sso/callback') ||
      url.includes('token=')
    ) {
      processSSOCallback(url);
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
          source={{uri: SSO_LOGIN_URL}}
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
