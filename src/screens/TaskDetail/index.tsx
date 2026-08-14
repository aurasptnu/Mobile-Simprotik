import React, {useEffect, useState, useRef} from 'react';

import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import api from '../../services/api';
import {styles} from './styles';
import {colors} from '../../theme';
import {getStaffUUID, getAuthToken} from '../../storage/auth';
import {
  getMobileTaskDetail,
  uploadFinalDocumentation,
} from '../../services/mobile';
import {surveyQuestions} from '../../data/surveyQuestions';

const arrowIcon = require('../../assets/images/panah.png');

const getApiErrorMessage = (error: any, fallback: string) => {
  const data = error?.response?.data;
  const errors = data?.errors;
  const firstError = errors ? Object.values(errors)?.[0] : null;

  if (Array.isArray(firstError) && firstError[0]) {
    return String(firstError[0]);
  }

  return data?.message || error?.message || fallback;
};

const formatJenis = (val: any) => {
  if (!val) return '-';
  const str = String(val).trim();
  if (!str) return '-';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
};

export default function TaskDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {task} = route.params;

  const [detail, setDetail] = useState<any>(task);
  const [dokumenExists, setDokumenExists] = useState(Boolean(task?.hasDocument));
  const [dokumenUrl, setDokumenUrl] = useState<string | null>(task?.documentUrl || null);
  const [dokumenId, setDokumenId] = useState<any>(task?.documentId || null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(Boolean(task?.surveyCompleted));
  const [surveyResult, setSurveyResult] = useState<any>(task?.surveyAnswers || null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [extensionHistory, setExtensionHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [cachedDocumentUri, setCachedDocumentUri] = useState<string | null>(null);
  const [downloadingDocument, setDownloadingDocument] = useState<boolean>(false);
  const [documentLoadError, setDocumentLoadError] = useState<boolean>(false);

  const isMountedRef = useRef<boolean>(true);
  const cachedFilePathRef = useRef<string | null>(null);
  const downloadCancelTokenRef = useRef<any>(null);

  const cleanupCachedDocument = async () => {
    if (cachedFilePathRef.current) {
      try {
        const pathToDelete = cachedFilePathRef.current;
        cachedFilePathRef.current = null;
        const exists = await RNFS.exists(pathToDelete);
        if (exists) {
          await RNFS.unlink(pathToDelete);
          console.log('[DEBUG] Cleaned up cached file:', pathToDelete);
        }
      } catch (err) {
        console.log('Error cleaning up cache file:', err);
      }
    }
    if (isMountedRef.current) {
      setCachedDocumentUri(null);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (downloadCancelTokenRef.current) {
        downloadCancelTokenRef.current.cancel('Component unmounted');
      }
      cleanupCachedDocument();
    };
  }, []);

  const downloadAndCacheDocument = async () => {
    if (photo) {
      if (isMountedRef.current) {
        setCachedDocumentUri(photo);
        setDownloadingDocument(false);
        setDocumentLoadError(false);
      }
      return;
    }

    if (downloadCancelTokenRef.current) {
      downloadCancelTokenRef.current.cancel('New download started');
      downloadCancelTokenRef.current = null;
    }

    if (isMountedRef.current) {
      setDownloadingDocument(true);
      setDocumentLoadError(false);
    }
    await cleanupCachedDocument();

    const cancelTokenSource = axios.CancelToken.source();
    downloadCancelTokenRef.current = cancelTokenSource;

    try {
      let endpoint = '';
      if (dokumenId) {
        endpoint = `/dokumen/${dokumenId}/file`;
      } else if (dokumenUrl) {
        endpoint = dokumenUrl;
      } else {
        throw new Error('Link atau ID dokumen tidak tersedia.');
      }

      console.log('[DEBUG] Downloading document from endpoint:', endpoint);
      const response = await api.get(endpoint, {
        responseType: 'arraybuffer',
        cancelToken: cancelTokenSource.token,
      });

      const contentType = (
        response.headers?.['content-type'] ||
        response.headers?.['Content-Type'] ||
        ''
      ).toLowerCase();

      let ext = 'jpg';
      if (contentType.includes('pdf') || endpoint.toLowerCase().includes('.pdf')) {
        ext = 'pdf';
      } else if (contentType.includes('png')) {
        ext = 'png';
      } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        ext = 'jpg';
      }

      const fileName = `temp_doc_${Date.now()}.${ext}`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const base64Data = arrayBufferToBase64(response.data);
      await RNFS.writeFile(filePath, base64Data, 'base64');

      const fileUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
      console.log('[DEBUG] File saved to cache:', fileUri);

      if (isMountedRef.current) {
        cachedFilePathRef.current = filePath;
        setCachedDocumentUri(fileUri);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('[DEBUG] Download cancelled:', error.message);
        return;
      }
      console.log('[DEBUG] Document download error:', error);
      if (isMountedRef.current) {
        setDocumentLoadError(true);
        Alert.alert(
          'Gagal Memuat Dokumentasi',
          'Gagal memuat dokumentasi. Silakan coba lagi.',
        );
      }
    } finally {
      if (isMountedRef.current) {
        setDownloadingDocument(false);
      }
    }
  };

  const loadDetail = React.useCallback(async () => {
    setLoadingDetail(true);

    try {
      const staffUUID = await getStaffUUID();

      if (!staffUUID || !isMountedRef.current) {
        return;
      }

      const remoteDetail = await getMobileTaskDetail(task, staffUUID);
      if (!isMountedRef.current) return;

      console.log('[DEBUG] remoteDetail:', JSON.stringify(remoteDetail, null, 2));
      setDetail(remoteDetail);

      setDokumenExists(remoteDetail.hasDocument);
      setDokumenId(remoteDetail.documentId || null);
      setDokumenUrl(remoteDetail.documentUrl || null);
      setSurveyCompleted(remoteDetail.surveyCompleted);
      setSurveyResult(remoteDetail.surveyAnswers || null);
    } catch (error) {
      console.log('loadDetail error', error);
    } finally {
      if (isMountedRef.current) {
        setLoadingDetail(false);
      }
    }
  }, [task]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useFocusEffect(
    React.useCallback(() => {
      loadDetail();
    }, [loadDetail]),
  );

  const openDocumentModal = () => {
    setShowPhotoModal(true);
    downloadAndCacheDocument();
  };

  const handleClosePhotoModal = async () => {
    if (downloadCancelTokenRef.current) {
      downloadCancelTokenRef.current.cancel('Modal closed by user');
      downloadCancelTokenRef.current = null;
    }
    setShowPhotoModal(false);
    await cleanupCachedDocument();
  };

  const handleUpload = async () => {
    if (dokumenExists || photo) {
      openDocumentModal();
      return;
    }

    if ((detail || task).status !== 'Sedang Berlangsung') {
      Alert.alert(
        'Belum Bisa Upload',
        'Dokumentasi akhir hanya bisa diupload saat tugas berstatus Sedang Berlangsung.',
      );
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    const asset = result.assets?.[0];
    const uri = asset?.uri;

    if (!uri) {
      return;
    }

    setUploading(true);

    try {
      const staffUUID = await getStaffUUID();

      if (!staffUUID || !isMountedRef.current) {
        return;
      }

      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const uploadRes = await uploadFinalDocumentation(task, staffUUID, {
        uri,
        name: filename,
        type: asset.type || 'image/jpeg',
      });
      console.log('[DEBUG] uploadRes:', JSON.stringify(uploadRes, null, 2));

      if (!isMountedRef.current) return;

      const uploadedTinjauan = uploadRes?.data || uploadRes;
      const uploadedDokumen = uploadedTinjauan?.dokumen;

      setDokumenExists(true);
      setDokumenId(
        uploadedTinjauan?.id_dokumen ||
          uploadedDokumen?.id_dokumen ||
          null,
      );
      setDokumenUrl(
        uploadedDokumen?.file ||
          uploadedDokumen?.url ||
          uploadedDokumen?.file_path ||
          uploadedTinjauan?.file ||
          uploadedTinjauan?.file_path ||
          uploadedTinjauan?.file_dokumentasi ||
          uploadedTinjauan?.url_dokumentasi ||
          null,
      );
      setPhoto(uri);
    } catch (error) {
      console.log('upload failed', error);
      if (isMountedRef.current) {
        Alert.alert(
          'Upload Gagal',
          getApiErrorMessage(
            error,
            'Dokumentasi akhir belum berhasil diupload ke backend.',
          ),
        );
      }
    } finally {
      if (isMountedRef.current) {
        setUploading(false);
      }
    }
  };

  const saveSurveyStatus = (status: boolean, result?: any) => {
    if (result) {
      setSurveyResult(result);
    }

    setSurveyCompleted(status);
  };

  const handleSurvey = () => {
    if (surveyCompleted) {
      setShowSurveyModal(true);
      return;
    }

    if (!dokumenExists && !photo) {
      Alert.alert(
        'Belum Bisa Isi Survei',
        'Upload dokumentasi akhir dulu. Setelah berhasil, tombol survei bisa dipakai.',
      );
      return;
    }

    navigation.navigate('Survey', {
      task: detail || task,
      onSurveyComplete: (result: any) => saveSurveyStatus(true, result),
    });
  };

  const fetchExtensionHistory = async () => {
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const response = await api.get(`/pekerjaan/${visibleTask.id_pekerjaan || visibleTask.id}/perpanjangan`);
      setExtensionHistory(response.data.data || []);
    } catch (error) {
      console.log('fetchExtensionHistory error', error);
      Alert.alert('Gagal', 'Tidak dapat memuat riwayat perpanjangan.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const visibleTask = detail || task;
  const visibleSurvey = surveyResult?.backend || surveyResult || visibleTask.surveyAnswers || null;
  const surveyAnswers = visibleSurvey?.answers || {};
  const surveyRows = surveyQuestions.slice(0, 5).map((question, index) => ({
    question: question.text,
    value: visibleSurvey?.[`jawaban${index + 1}`] ?? surveyAnswers[question.id] ?? '-',
  }));
  const surveyComment = visibleSurvey?.jawaban6 ?? visibleSurvey?.comment ?? '';
  const surveyName = visibleSurvey?.nama_klien ?? visibleSurvey?.nama ?? '-';
  const surveyNip = visibleSurvey?.nip_klien ?? visibleSurvey?.nip ?? '-';

  const canFillSurvey = surveyCompleted || dokumenExists || Boolean(photo);
  const canUploadDocument = visibleTask.status === 'Sedang Berlangsung' && !dokumenExists && !photo;
  const uploadButtonDisabled = uploading;

  if (loadingDetail) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={arrowIcon}
          style={{
            width: 18,
            height: 18,
            tintColor: colors.primaryBlue,
            transform: [{scaleX: -1}],
          }}
        />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {visibleTask.status === 'Dalam Tinjauan'
              ? 'Menunggu ACC Kepala Divisi'
              : visibleTask.status}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{visibleTask.title}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tipe</Text>
        <Text style={styles.value}>{visibleTask.type || 'Pekerjaan'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Jenis Pekerjaan</Text>
        <Text style={styles.value}>
          {formatJenis(
            visibleTask.jenis ||
              visibleTask.raw?.jenis ||
              visibleTask.raw?.jenis_pekerjaan,
          )}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Unit Peminta</Text>
        <Text style={styles.value}>{visibleTask.assignedBy || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Lokasi</Text>
        <Text style={styles.value}>{visibleTask.location || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Target Selesai</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
          <Text style={styles.value}>{visibleTask.deadline || '-'}</Text>
          {(() => {
            if (!visibleTask.deadline || visibleTask.status === 'Selesai') return null;
            const deadline = new Date(visibleTask.deadline);
            const today = new Date();
            deadline.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            
            if (today > deadline) {
              const diffTime = Math.abs(today.getTime() - deadline.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return (
                <View style={{backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8}}>
                  <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>Terlambat {diffDays} hari</Text>
                </View>
              );
            }
            return null;
          })()}
        </View>
        <TouchableOpacity style={{marginTop: 8}} onPress={fetchExtensionHistory}>
          <Text style={{color: colors.primaryBlue, fontSize: 13, fontWeight: '500'}}>Lihat Riwayat Perpanjangan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Deskripsi</Text>
        <Text style={styles.description}>{visibleTask.description || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Dokumentasi Akhir</Text>
        <Text style={styles.subText}>
          {dokumenExists || photo
            ? 'Sudah upload dokumentasi'
            : canUploadDocument
            ? 'Belum upload dokumentasi'
            : 'Upload dokumen hanya saat Sedang Berlangsung'}
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, !canUploadDocument && !dokumenExists && !photo && {backgroundColor: colors.textMuted}]}
          onPress={handleUpload}
          disabled={uploadButtonDisabled}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {dokumenExists || photo ? 'Lihat Dokumen' : 'Upload Dokumentasi'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Survei Klien</Text>
        <Text style={styles.subText}>
          {surveyCompleted
            ? 'Sudah isi survei'
            : canFillSurvey
            ? 'Belum isi survei'
            : 'Upload dokumentasi terlebih dahulu'}
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, !canFillSurvey && {backgroundColor: colors.textMuted}]}
          onPress={handleSurvey}>
          <Text style={styles.actionButtonText}>
            {surveyCompleted ? 'Lihat Survei' : 'Isi Survei'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPhotoModal}
        transparent={true}
        onRequestClose={handleClosePhotoModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClosePhotoModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {downloadingDocument ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primaryBlue} />
                <Text style={{ marginTop: 12, color: '#fff', fontSize: 14 }}>
                  Mengunduh dokumen...
                </Text>
              </View>
            ) : cachedDocumentUri && !documentLoadError ? (
              cachedDocumentUri.toLowerCase().includes('.pdf') ? (
                <WebView
                  source={{ uri: cachedDocumentUri }}
                  style={{ flex: 1, width: '100%', borderRadius: 12 }}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <ActivityIndicator size="large" color={colors.primaryBlue} style={{ flex: 1 }} />
                  )}
                  onError={(e) => {
                    console.log('WEBVIEW ERROR', e.nativeEvent);
                    if (isMountedRef.current) setDocumentLoadError(true);
                  }}
                />
              ) : (
                <Image
                  source={{ uri: cachedDocumentUri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                  onError={(e) => {
                    console.log('IMAGE ERROR', e.nativeEvent);
                    if (isMountedRef.current) setDocumentLoadError(true);
                  }}
                />
              )
            ) : (
              <View style={styles.emptyDocumentState}>
                <Text style={{ fontSize: 42, marginBottom: 12, textAlign: 'center' }}>📄</Text>
                <Text style={styles.emptyDocumentTitle}>Dokumentasi tidak dapat ditampilkan</Text>
                <Text style={styles.emptyDocumentText}>
                  Terjadi kesalahan saat memuat dokumentasi.
                </Text>
                <TouchableOpacity
                  style={[styles.actionButton, { marginTop: 16, paddingHorizontal: 24 }]}
                  onPress={downloadAndCacheDocument}>
                  <Text style={styles.actionButtonText}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSurveyModal}
        transparent={true}
        onRequestClose={() => setShowSurveyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.surveyModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSurveyModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.surveyTitle}>Survei Klien</Text>
            {visibleSurvey ? (
              <ScrollView style={styles.surveyResultScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.surveyMetaBox}>
                  <Text style={styles.surveyMetaLabel}>Nama Klien</Text>
                  <Text style={styles.surveyMetaValue}>{surveyName}</Text>
                  <Text style={styles.surveyMetaLabel}>NIP Klien</Text>
                  <Text style={styles.surveyMetaValue}>{surveyNip}</Text>
                </View>

                {surveyRows.map((row, index) => (
                  <View key={row.question} style={styles.surveyAnswerRow}>
                    <Text style={styles.surveyQuestionText}>{index + 1}. {row.question}</Text>
                    <Text style={styles.surveyAnswerValue}>{row.value}</Text>
                  </View>
                ))}

                <View style={styles.surveyCommentBox}>
                  <Text style={styles.surveyMetaLabel}>Kritik dan Saran</Text>
                  <Text style={styles.surveyCommentText}>{surveyComment || '-'}</Text>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.surveyStatus}>
                Survei sudah diselesaikan, tetapi detail jawaban belum tersedia di perangkat ini.
              </Text>
            )}

            <TouchableOpacity style={styles.surveyCloseBtn} onPress={() => setShowSurveyModal(false)}>
              <Text style={styles.surveyCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Riwayat Perpanjangan */}
      <Modal
        visible={showHistoryModal}
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.surveyModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHistoryModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.surveyTitle}>Riwayat Perpanjangan</Text>
            {loadingHistory ? (
              <ActivityIndicator size="large" color={colors.primaryBlue} style={{marginTop: 20}} />
            ) : extensionHistory.length > 0 ? (
              <ScrollView style={styles.surveyResultScroll} showsVerticalScrollIndicator={false}>
                {extensionHistory.map((item: any, index: number) => (
                  <View key={item.id_perpanjangan || index} style={{marginBottom: 16, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0'}}>
                    <Text style={{fontWeight: 'bold', color: colors.textDark, marginBottom: 4}}>Perpanjangan Ke-{extensionHistory.length - index}</Text>
                    <Text style={{fontSize: 13, color: colors.textDark}}><Text style={{fontWeight: '600'}}>Tanggal Lama:</Text> {item.tanggal_lama}</Text>
                    <Text style={{fontSize: 13, color: colors.textDark}}><Text style={{fontWeight: '600'}}>Tanggal Baru:</Text> {item.tanggal_baru}</Text>
                    <Text style={{fontSize: 13, color: colors.textDark}}><Text style={{fontWeight: '600'}}>Diajukan Oleh:</Text> {item.pengguna?.nama_lengkap || '-'}</Text>
                    <Text style={{fontSize: 13, color: colors.textDark, marginTop: 4}}><Text style={{fontWeight: '600'}}>Alasan:</Text> {item.alasan}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.surveyStatus}>Belum pernah diperpanjang.</Text>
            )}

            <TouchableOpacity style={styles.surveyCloseBtn} onPress={() => setShowHistoryModal(false)}>
              <Text style={styles.surveyCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
