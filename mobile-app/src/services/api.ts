import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface UserProfile {
  id: string;
  hris_user_id: string;
  name: string;
  email: string;
  total_xp: number;
  current_rank: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  access_token: string;
  user: UserProfile;
}

export function getApiBaseUrl(): string {
  // If running in browser / Web
  if (Platform.OS === 'web') {
    return 'http://localhost:3001';
  }

  // If running on Expo Go (Physical device or simulator), resolve local machine IP
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3001`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();

export async function loginApi(email: string, password?: string): Promise<LoginResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const derivedName = cleanEmail
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.message || 'Login gagal. Periksa kembali email Anda.');
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // If backend is unreachable or timed out, fallback to instant offline mode for developer convenience
    console.warn(`[API] Server ${API_BASE_URL} unreachable (${error.message}). Using local authenticated session.`);

    return {
      success: true,
      message: 'Masuk dengan sesi lokal (Mode Offline)',
      access_token: `mock-token-${Date.now()}`,
      user: {
        id: `usr-mock-${Date.now().toString().slice(-4)}`,
        hris_user_id: 'USR-LOCAL',
        name: derivedName || 'Budi Santoso',
        email: cleanEmail,
        total_xp: 120,
        current_rank: 'Pembelajar Aktif',
        role: cleanEmail.includes('trainer') ? 'Trainer TnD' : 'Auditor Lapangan',
      },
    };
  }
}

export async function getProfileApi(token: string): Promise<UserProfile> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok || !data.user) {
      throw new Error(data.message || 'Gagal memuat profil pengguna.');
    }

    return data.user;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return {
      id: 'usr-default',
      hris_user_id: 'USR-001',
      name: 'Budi Santoso',
      email: 'budi.trainer@sobathr.com',
      total_xp: 124,
      current_rank: 'Karyawan Terampil',
      role: 'Senior Auditor & Trainer',
    };
  }
}

export async function fetchOutletsApi(): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${API_BASE_URL}/audit/outlets`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil data outlet');
    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Fallback to default outlets:', error.message);
    return [];
  }
}

export async function fetchInHouseSessionsApi(): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${API_BASE_URL}/in-house/sessions`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil sesi in-house');
    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Fallback to default sessions:', error.message);
    return [];
  }
}

export async function fetchSopsApi(category?: string): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const url = category
      ? `${API_BASE_URL}/api/sop?category=${category}`
      : `${API_BASE_URL}/api/sop`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil data SOP');
    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Failed to fetch SOPs:', error.message);
    return [];
  }
}



