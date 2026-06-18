import AsyncStorage from '@react-native-async-storage/async-storage';

// Try to load MMKV if installed; if not, we'll fallback to AsyncStorage then in-memory.
let mmkvStore: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createMMKV } = require('react-native-mmkv');
  if (typeof createMMKV === 'function') {
    mmkvStore = createMMKV({ id: 'simprotik' });
  }
  console.log('MMKV: initialized');
} catch (e) {
  mmkvStore = null;
  console.log('MMKV not available, will use AsyncStorage/fallback');
}

// In-memory fallback storage used when native storage modules are unavailable.
const inMemoryStore: Record<string, string> = {};

export const saveUser = async (user: any) => {
  const value = JSON.stringify(user);

  // Try MMKV first
  if (mmkvStore) {
    try {
      mmkvStore.set('loggedUser', value);
      return;
    } catch (e) {
      console.log('MMKV SAVE ERROR:', e);
    }
  }

  // Fallback to AsyncStorage
  try {
    await AsyncStorage.setItem('loggedUser', value);
    return;
  } catch (error) {
    console.log('SAVE ERROR (AsyncStorage), using fallback:', error);
    inMemoryStore['loggedUser'] = value;
  }
};

export const getUser = async () => {
  // Try MMKV first
  if (mmkvStore) {
    try {
      const v = mmkvStore.getString('loggedUser');
      if (v) return JSON.parse(v);
    } catch (e) {
      console.log('MMKV GET ERROR:', e);
    }
  }

  // Try AsyncStorage
  try {
    const user = await AsyncStorage.getItem('loggedUser');
    if (user) return JSON.parse(user);
  } catch (error) {
    console.log('GET ERROR (AsyncStorage), using fallback:', error);
  }

  // In-memory fallback
  if (inMemoryStore['loggedUser']) {
    try {
      return JSON.parse(inMemoryStore['loggedUser']);
    } catch (e) {
      return null;
    }
  }

  return null;
};

// Save staff UUID from backend
export const saveStaffUUID = async (uuid: string) => {
  // Try MMKV first
  if (mmkvStore) {
    try {
      mmkvStore.set('staffUUID', uuid);
      return;
    } catch (e) {
      console.log('MMKV SAVE UUID ERROR:', e);
    }
  }

  // Fallback to AsyncStorage
  try {
    await AsyncStorage.setItem('staffUUID', uuid);
    return;
  } catch (error) {
    console.log('SAVE UUID ERROR (AsyncStorage), using fallback:', error);
    inMemoryStore['staffUUID'] = uuid;
  }
};

// Get staff UUID from storage
export const getStaffUUID = async (): Promise<string | null> => {
  // Try MMKV first
  if (mmkvStore) {
    try {
      const v = mmkvStore.getString('staffUUID');
      if (v) return v;
    } catch (e) {
      console.log('MMKV GET UUID ERROR:', e);
    }
  }

  // Try AsyncStorage
  try {
    const uuid = await AsyncStorage.getItem('staffUUID');
    if (uuid) return uuid;
  } catch (error) {
    console.log('GET UUID ERROR (AsyncStorage), using fallback:', error);
  }

  // In-memory fallback
  if (inMemoryStore['staffUUID']) {
    return inMemoryStore['staffUUID'];
  }

  return null;
};

export const logoutUser = async () => {
  // Try MMKV
  if (mmkvStore) {
    try {
      mmkvStore.remove('loggedUser');
      mmkvStore.remove('staffUUID');
    } catch (e) {
      console.log('MMKV DELETE ERROR:', e);
    }
  }

  // Try AsyncStorage
  try {
    await AsyncStorage.removeItem('loggedUser');
    await AsyncStorage.removeItem('staffUUID');
  } catch (error) {
    console.log('LOGOUT ERROR (AsyncStorage):', error);
  }

  // always clear fallback
  delete inMemoryStore['loggedUser'];
  delete inMemoryStore['staffUUID'];
};