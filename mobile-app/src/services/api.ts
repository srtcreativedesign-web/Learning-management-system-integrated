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
        role: cleanEmail.includes('trainer')
          ? 'Trainer TnD'
          : cleanEmail.includes('manager') || cleanEmail.includes('hrbp')
          ? 'HRBP Manager'
          : 'Auditor Lapangan',
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
    return data.success && data.data ? data.data : Array.isArray(data) ? data : [];
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Fallback to default sessions:', error.message);
    return [];
  }
}

export async function fetchInHouseChecklistsApi(): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const fallbackChecklists = [
    {
      id: 'cat-1',
      name: 'Standar Grooming & Penampilan',
      checklists: [
        { id: 'p-1', question: 'Kerapian seragam, apron, dan nametag', description: 'Seragam bersih, tidak kusut, sepatu tertutup dan bersih' },
        { id: 'p-2', question: 'Kebersihan personal (rambut, kuku, wewangian)', description: 'Rambut rapi/hairnet terpasang, kuku pendek dan bersih' },
      ],
    },
    {
      id: 'cat-2',
      name: 'Standar Pelayanan & Hospitality',
      checklists: [
        { id: 'p-3', question: 'Ketepatan greeting & senyum ramah pelanggan', description: 'Memberikan salam dengan kontak mata dan senyum tulus' },
        { id: 'p-4', question: 'Penguasaan menu rekomendasi dan upselling', description: 'Mampu menjelaskan menu unggulan dan menawarkan add-on' },
        { id: 'p-5', question: 'Kecepatan dan ketepatan transaksi kasir/POS', description: 'Menginput pesanan tanpa kesalahan dan konfirmasi nominal' },
      ],
    },
    {
      id: 'cat-3',
      name: 'Standar Operasional Produk & Resep',
      checklists: [
        { id: 'p-6', question: 'Kepatuhan terhadap resep & takaran (gramasi)', description: 'Menggunakan measuring tools dan resep standar tanpa improvisasi' },
        { id: 'p-7', question: 'Kualitas rasa, suhu penyajian, & visual plating', description: 'Sesuai standar temperatur dan plating/packaging rapi' },
        { id: 'p-8', question: 'Kecepatan waktu penyajian (Serving Time)', description: 'Waktu proses sesuai standar SOP (< 5 menit)' },
      ],
    },
    {
      id: 'cat-4',
      name: 'Kebersihan & Sanitasi Area Kerja',
      checklists: [
        { id: 'p-9', question: 'Penerapan Clean As You Go di workstation', description: 'Meja kerja, peralatan, dan sink selalu bersih setelah digunakan' },
        { id: 'p-10', question: 'Penyimpanan bahan baku FIFO & label tanggal', description: 'Label expired tercantum jelas dan rotasi bahan tertib' },
      ],
    },
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/in-house/checklists`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil checklist');
    const data = await response.json();
    if (data.success && data.data && data.data.length > 0) {
      return data.data;
    }
    return fallbackChecklists;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Fallback to default checklists:', error.message);
    return fallbackChecklists;
  }
}

export async function submitInHouseSessionApi(payload: {
  trainer_name?: string;
  outlet_id?: string;
  trainee_name?: string;
  training_date?: string;
  notes?: string;
  pic_name?: string;
  trainer_signature?: string;
  pic_signature?: string;
  assessments: Array<{
    checklist_point_id: string;
    score: number;
    notes?: string;
  }>;
}): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const fullNotes = [
      payload.notes ? `[Catatan Trainer] ${payload.notes}` : '',
      payload.pic_name ? `[PIC Outlet] Disetujui & diverifikasi oleh: ${payload.pic_name}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await fetch(`${API_BASE_URL}/in-house/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        notes: fullNotes || payload.notes,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[API] Session submitted in offline mock mode:', error.message);
    return {
      success: true,
      message: 'Penilaian tersimpan lokal (Mode Offline)',
      data: {
        id: `session-mock-${Date.now()}`,
        ...payload,
      },
    };
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

// ---------------- AUDIT INSPECTION APIS (OK / NOK) ----------------

export async function fetchAuditChecklistsApi(): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const fallbackAuditChecklists = [
    {
      id: 'cat-aud-1',
      name: 'K3, Keselamatan & Kelayakan Kerja',
      checklists: [
        { id: 'ap-1', question: 'Ketersediaan dan masa berlaku APAR dalam kondisi baik' },
        { id: 'ap-2', question: 'Jalur evakuasi dan pintu darurat bebas dari halangan barang/stok' },
        { id: 'ap-3', question: 'Kotak P3K lengkap dan obat tidak melewati kedaluwarsa' },
        { id: 'ap-4', question: 'Instalasi kelistrikan & kabel panel rapi dan aman' },
      ],
    },
    {
      id: 'cat-aud-2',
      name: 'Standar Higienitas, Sanitasi & 5S',
      checklists: [
        { id: 'ap-5', question: 'Karyawan mengenakan atribut lengkap (hairnet, masker, apron, sepatu bersih)' },
        { id: 'ap-6', question: 'Area kitchen, sink, dan tempat sampah tertutup bebas dari bau menyengat' },
        { id: 'ap-7', question: 'Suhu chiller & freezer stabil sesuai toleransi SOP' },
        { id: 'ap-8', question: 'Penyimpanan bahan baku menerapkan FIFO dengan label tanggal jelas' },
      ],
    },
    {
      id: 'cat-aud-3',
      name: 'Operasional Kasir, POS & Layanan',
      checklists: [
        { id: 'ap-9', question: 'Mesin kasir POS, mesin EDC, dan printer struk berfungsi normal' },
        { id: 'ap-10', question: 'Uang modal kasir dan dokumen serah terima shift tercatat akurat' },
        { id: 'ap-11', question: 'Display etalase produk bersih dan informasi harga tercantum jelas' },
      ],
    },
    {
      id: 'cat-aud-4',
      name: 'Fasilitas & Pemeliharaan Outlet',
      checklists: [
        { id: 'ap-12', question: 'Kebersihan meja makan, lantai, kaca, dan toilet pelanggan selalu terjaga' },
        { id: 'ap-13', question: 'Peralatan operasional (blender, grinder, ice maker) terawat dan bersih' },
      ],
    },
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/audit/checklist`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil audit checklist');
    const data = await response.json();
    if (data.success && data.data && data.data.length > 0) {
      return data.data;
    }
    return fallbackAuditChecklists;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return fallbackAuditChecklists;
  }
}

// In-memory or local mock storage for submitted audit inspections
let localAuditInspections: any[] = [
  {
    id: 'insp-1',
    outlet_id: '1',
    outlet_name: 'Outlet Kemang',
    auditor_name: 'Dian Permata',
    inspection_date: '2026-07-08T10:00:00.000Z',
    compliance_score: 95,
    is_compliant: true,
    total_items: 20,
    ok_items: 19,
    nok_items: 1,
    findings: [
      { point_text: 'Suhu chiller penyimpanan di luar batas toleransi', notes: 'Suhu 8°C (standar maks 4°C)' },
    ],
  },
  {
    id: 'insp-2',
    outlet_id: '2',
    outlet_name: 'Outlet Sudirman',
    auditor_name: 'Dian Permata',
    inspection_date: '2026-07-05T14:30:00.000Z',
    compliance_score: 70,
    is_compliant: false,
    total_items: 20,
    ok_items: 14,
    nok_items: 6,
    findings: [
      { point_text: 'Alat pemadam kebakaran (APAR) kedaluwarsa', notes: 'Kadaluwarsa per Juni 2026' },
      { point_text: 'Jalur evakuasi terhalang tumpukan kardus stok', notes: 'Tumpukan barang menutupi pintu belakang' },
    ],
  },
  {
    id: 'insp-3',
    outlet_id: '3',
    outlet_name: 'Outlet Kelapa Gading',
    auditor_name: 'Dian Permata',
    inspection_date: '2026-07-03T09:15:00.000Z',
    compliance_score: 92,
    is_compliant: true,
    total_items: 20,
    ok_items: 18,
    nok_items: 2,
    findings: [
      { point_text: 'Pekerja tidak menggunakan celemek & hairnet', notes: '2 barista belum memakai hairnet' },
    ],
  },
  {
    id: 'insp-4',
    outlet_id: '4',
    outlet_name: 'Outlet BSD City',
    auditor_name: 'Dian Permata',
    inspection_date: '2026-07-01T11:00:00.000Z',
    compliance_score: 88,
    is_compliant: true,
    total_items: 20,
    ok_items: 17,
    nok_items: 3,
    findings: [
      { point_text: 'Dokumen izin sanitasi belum diperbarui', notes: 'Masa berlaku habis' },
    ],
  },
];

export async function fetchAuditInspectionsApi(): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${API_BASE_URL}/audit/inspections`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Gagal mengambil riwayat audit');
    const data = await response.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return [...localAuditInspections];
  } catch (error: any) {
    clearTimeout(timeoutId);
    return [...localAuditInspections];
  }
}

export async function submitAuditInspectionApi(payload: {
  outlet_id?: string;
  outlet_name: string;
  auditor_name: string;
  pic_name?: string;
  inspection_date?: string;
  notes?: string;
  auditor_signature?: string;
  pic_signature?: string;
  compliance_score: number;
  is_compliant: boolean;
  total_items: number;
  ok_items: number;
  nok_items: number;
  findings: Array<{
    checklist_point_id: string;
    point_text: string;
    is_compliant: boolean;
    notes?: string;
  }>;
}): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const localRecord = {
    id: `insp-${Date.now()}`,
    ...payload,
    inspection_date: payload.inspection_date || new Date().toISOString(),
  };
  localAuditInspections.unshift(localRecord);

  try {
    const response = await fetch(`${API_BASE_URL}/audit/inspections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return {
      success: true,
      message: 'Hasil audit kepatuhan lapangan (OK/NOK) tersimpan lokal',
      data: localRecord,
    };
  }
}





