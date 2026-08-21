import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMobileSandboxStatus } from '../services/mobile';
import { colors, font } from '../theme';

export default function SandboxBanner() {
  const [isSandbox, setIsSandbox] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMobileSandboxStatus().then((res) => {
      if (isMounted) {
        setIsSandbox(Boolean(res.is_sandbox));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isSandbox) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.warningIcon}>⚠️</Text>
      <Text style={styles.bannerText}>
        <Text style={styles.boldText}>Mode Uji Coba:</Text> Data yang tampil bukan data resmi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FFF8E6',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE699',
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  bannerText: {
    fontSize: font.size.xs,
    color: '#975A16',
    fontWeight: font.weight.medium,
    textAlign: 'center',
    flexShrink: 1,
  },
  boldText: {
    fontWeight: font.weight.bold,
  },
});
