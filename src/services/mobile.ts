import api from './api';

export type MobileTaskKind = 'pekerjaan' | 'proyek';

export type MobileTask = {
  id: string | number;
  rawId: string | number;
  kind: MobileTaskKind;
  type: 'Pekerjaan' | 'Proyek';
  title: string;
  status: string;
  assignedBy: string;
  deadline: string;
  location: string;
  description: string;
  assignedTo: string[];
  documentId?: string | number | null;
  documentUrl?: string | null;
  hasDocument: boolean;
  surveyCompleted: boolean;
  surveyId?: string | number | null;
  surveyAnswers?: any;
  incomingLetter?: any;
  review?: any;
  raw: any;
};

export type StaffUser = {
  id: string | number;
  uuid: string;
  name: string;
  email: string;
  nip: string;
  division: string;
  role: string;
  raw: any;
};

export type MobileSurveyQuestion = {
  id: string;
  text: string;
  type: 'choice' | 'text';
  options?: string[];
};

const visibleStatuses = ['Sedang Berlangsung', 'Dalam Tinjauan', 'Selesai'];

const statusMap: Record<string, string> = {
  in_progress: 'Sedang Berlangsung',
  sedang_berlangsung: 'Sedang Berlangsung',
  'sedang berlangsung': 'Sedang Berlangsung',
  review: 'Dalam Tinjauan',
  dalam_tinjauan: 'Dalam Tinjauan',
  'dalam tinjauan': 'Dalam Tinjauan',
  selesai: 'Selesai',
  completed: 'Selesai',
  done: 'Selesai',
};

const pick = <T = any>(source: any, keys: string[], fallback: T): T => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return fallback;
};

const unwrap = (payload: any) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.pekerjaan)) {
    return payload.pekerjaan;
  }

  if (Array.isArray(payload?.proyek)) {
    return payload.proyek;
  }

  if (payload?.data && typeof payload.data === 'object') {
    return payload.data;
  }

  return payload;
};

const unwrapUsers = (payload: any) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.staf)) {
    return payload.staf;
  }

  if (Array.isArray(payload?.staff)) {
    return payload.staff;
  }

  if (Array.isArray(payload?.pengguna)) {
    return payload.pengguna;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  return [];
};

export const normalizeStatus = (value: any) => {
  const raw = String(value?.nama_status || value?.name || value || '').trim();
  const key = raw.toLowerCase();

  return statusMap[key] || raw || '-';
};

export const isVisibleMobileStatus = (status: any) =>
  visibleStatuses.includes(normalizeStatus(status));

export const normalizeTask = (item: any, kind: MobileTaskKind): MobileTask => {
  const source = unwrap(item);
  const status = normalizeStatus(pick(source, ['status', 'status_tugas'], ''));
  const unitKerja = pick<any>(source, ['unit_kerja', 'unit_peminta'], null);
  const suratMasuk = pick<any>(source, ['surat_masuk'], null);
  const rawId = pick(
    source,
    kind === 'proyek'
      ? ['id_proyek', 'proyek_id', 'id']
      : ['id_pekerjaan', 'pekerjaan_id', 'id'],
    '',
  );
  const document = pick<any>(source, ['dokumen', 'dokumentasi_akhir'], null);
  const surveyAnswers = pick<any>(source, ['jawaban_survei', 'survei', 'survey'], null);
  const documentId = pick(
    source,
    ['id_dokumen', 'dokumen_id', 'id_dokumentasi_akhir'],
    document?.id_dokumen || document?.id || null,
  );
  const documentUrl = pick(
    source,
    ['file_dokumentasi', 'url_dokumentasi', 'dokumen_url', 'file_url'],
    document?.file || document?.url || document?.file_path || null,
  );
  const assignedTo = pick<any[]>(source, ['staf', 'assignedTo', 'petugas'], []);

  return {
    id: rawId,
    rawId,
    kind,
    type: kind === 'proyek' ? 'Proyek' : 'Pekerjaan',
    title: String(pick(source, ['nama_tugas', 'judul', 'nama', 'nama_pekerjaan', 'nama_proyek', 'title'], '-')),
    status,
    assignedBy: String(
      unitKerja?.nama_unit ||
        unitKerja?.name ||
        pick(source, ['assignedBy', 'klien', 'nama_unit'], '-'),
    ),
    deadline: String(pick(source, ['target_selesai', 'deadline', 'tanggal_deadline'], '-')),
    location: String(pick(source, ['lokasi', 'location'], '-')),
    description: String(
      pick(source, ['deskripsi', 'description', 'keterangan'], suratMasuk?.perihal || source?.nama_tugas || '-'),
    ),
    assignedTo: Array.isArray(assignedTo)
      ? assignedTo.map((staff: any) =>
          String(
            staff?.pengguna?.nama_lengkap ||
              staff?.nama_lengkap ||
              staff?.nama ||
              staff?.name ||
              staff?.id_pengguna ||
              '-',
          ),
        )
      : [String(assignedTo || '-')],
    documentId,
    documentUrl,
    hasDocument: Boolean(
      source?.sudah_ada_dokumentasi ||
        source?.sudah_upload_dokumentasi ||
        documentId ||
        documentUrl,
    ),
    surveyCompleted: Boolean(source?.sudah_ada_survei || source?.surveyCompleted || surveyAnswers),
    surveyId: pick(source, ['id_jawaban', 'jawaban_id', 'id_survei'], surveyAnswers?.id || null),
    surveyAnswers,
    incomingLetter: suratMasuk,
    review: pick<any>(source, ['tinjauan'], null),
    raw: source,
  };
};

const normalizeList = (payload: any, kind: MobileTaskKind) => {
  const items = unwrap(payload);
  const list = Array.isArray(items) ? items : [];

  return list.map(item => normalizeTask(item, kind)).filter(task => isVisibleMobileStatus(task.status));
};

const normalizeStaffUser = (item: any): StaffUser => {
  const role = String(pick(item, ['role', 'peran', 'level'], '')).toLowerCase();
  const division = item?.divisi?.nama_divisi || item?.division?.nama_divisi || item?.nama_divisi;
  const uuid = String(
    pick(
      item,
      ['id_pengguna', 'uuid', 'id_user', 'id_staf', 'id_staff', 'id'],
      '',
    ),
  );

  return {
    id: uuid || pick(item, ['id'], ''),
    uuid,
    name: String(pick(item, ['nama_lengkap', 'nama', 'name', 'nama_pengguna'], '-')),
    email: String(pick(item, ['email', 'surel'], '')),
    nip: String(pick(item, ['NIP', 'nip', 'no_pegawai'], '-')),
    division: String(division || '-'),
    role: role || 'staff',
    raw: item,
  };
};

const isStaffRole = (item: any) => {
  const role = String(pick(item, ['role', 'peran', 'level'], 'staff')).toLowerCase();

  return role === 'staff' || role === 'staf';
};

export const getBackendStaffUsers = async () => {
  const response = await api.get('/master/pengguna/staf');
  const staff = unwrapUsers(response.data)
    .filter(isStaffRole)
    .map(normalizeStaffUser)
    .filter((item: StaffUser) => item.uuid);

  return staff;
};

export const getDashboard = async (staffUuid: string) => {
  const response = await api.get('/dashboard/staf', {
    params: {id_pengguna: staffUuid},
  });

  return response.data;
};

export const getActiveMobileTasks = async (staffUuid: string) => {
  const [pekerjaanRes, proyekRes] = await Promise.all([
    api.get('/mobile/pekerjaan-aktif', {
      params: {id_pengguna: staffUuid},
    }),
    api.get('/mobile/proyek-aktif', {
      params: {id_pengguna: staffUuid},
    }),
  ]);

  return [
    ...normalizeList(pekerjaanRes.data, 'pekerjaan'),
    ...normalizeList(proyekRes.data, 'proyek'),
  ];
};

export const getMobileTaskDetail = async (task: Pick<MobileTask, 'rawId' | 'kind'>, staffUuid: string) => {
  const response = await api.get(`/mobile/${task.kind}/${task.rawId}`, {
    params: {id_pengguna: staffUuid},
  });

  return normalizeTask(response.data, task.kind);
};

export const uploadFinalDocumentation = async (
  task: Pick<MobileTask, 'rawId' | 'kind'>,
  staffUuid: string,
  file: {uri: string; name: string; type: string},
) => {
  const form = new FormData();
  form.append('id_pengguna', staffUuid);
  form.append('dokumentasi_akhir', file as any);

  const response = await api.post(`/mobile/${task.kind}/${task.rawId}/dokumentasi-akhir`, form, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  return response.data;
};

export const submitTaskSurvey = async (
  task: Pick<MobileTask, 'rawId' | 'kind'>,
  payload: {
    id_pengguna: string;
    nama_klien: string;
    nip_klien: string;
    jawaban1: number;
    jawaban2: number;
    jawaban3: number;
    jawaban4: number;
    jawaban5: number;
    jawaban6?: string;
  },
) => {
  const response = await api.post(`/mobile/${task.kind}/${task.rawId}/survei`, payload);

  return response.data;
};

const normalizeSurveyQuestion = (item: any, index: number): MobileSurveyQuestion => {
  const text = String(
    pick(item, ['pertanyaan', 'teks', 'text', 'question', 'nama_pertanyaan'], ''),
  );
  const type = index < 5 ? 'choice' : 'text';

  return {
    id: `q${index + 1}`,
    text: text || (type === 'choice' ? `Pertanyaan ${index + 1}` : 'Kritik dan saran (opsional)'),
    type,
    options: type === 'choice' ? ['1', '2', '3', '4', '5'] : undefined,
  };
};

export const getSurveyQuestions = async () => {
  const response = await api.get('/master/pertanyaan-survei');
  const items = unwrapUsers(response.data);
  const questions = items.map(normalizeSurveyQuestion);

  if (questions.length >= 6) {
    return questions.slice(0, 6);
  }

  return questions;
};

export const getDocumentFileUrl = (documentId: string | number) =>
  `${api.defaults.baseURL}/dokumen/${documentId}/file`;
