import React, { useState, useEffect } from 'react';

import {
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

import {
  launchImageLibrary,
} from 'react-native-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';
import { api } from '../../services/api';
import { getUser } from '../../storage/auth';

const profileIcon = require('../../assets/images/profile.png');
const arrowIcon = require('../../assets/images/panah.png');

export default function TaskDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { task } = route.params;

  const [detail, setDetail] = useState<any>(null);
  const [dokumenExists, setDokumenExists] = useState(false);
  const [dokumenUrl, setDokumenUrl] = useState<string | null>(null);
  const [dokumenId, setDokumenId] = useState<any>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(task?.surveyCompleted ?? false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    loadDetail();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDetail();
    }, [task.id]),
  );

  const loadDetail = async () => {
    setLoadingDetail(true);
    try {
      const user = await getUser();
      const id_pengguna = user?.id || user?.nip || user?.email;

      const endpoint = (task.type || '').toLowerCase().includes('proyek')
        ? `/mobile/proyek/${task.id}`
        : `/mobile/pekerjaan/${task.id}`;

      const res = await api.get(endpoint, { params: { id_pengguna } });

      if (res && res.data) {
        setDetail(res.data);

        if (res.data.sudah_ada_dokumentasi) setDokumenExists(true);
        if (res.data.id_dokumen) setDokumenId(res.data.id_dokumen);
        if (res.data.dokumen && (res.data.dokumen.file || res.data.dokumen.url)) {
          setDokumenUrl(res.data.dokumen.file || res.data.dokumen.url);
        }
        if (res.data.sudah_ada_survei) setSurveyCompleted(true);
      } else {
        // fallback to local storage
        const savedDoc = await AsyncStorage.getItem(`task_doc_${task.id}`);
        if (savedDoc) setPhoto(savedDoc);
        const savedSurvey = await AsyncStorage.getItem(`task_survey_${task.id}`);
        if (savedSurvey === 'true') setSurveyCompleted(true);
      }
    } catch (error) {
      console.log('loadDetail error, falling back to local storage', error);
      try {
        const savedDoc = await AsyncStorage.getItem(`task_doc_${task.id}`);
        if (savedDoc) setPhoto(savedDoc);
        const savedSurvey = await AsyncStorage.getItem(`task_survey_${task.id}`);
        if (savedSurvey === 'true') setSurveyCompleted(true);
      } catch (e) {
        console.log('fallback load error', e);
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpload = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });

    if (!result.assets) return;

    const uri = result.assets[0].uri || null;
    if (!uri) return;

    setUploading(true);
    try {
      const user = await getUser();
      const id_pengguna = user?.id || user?.nip || user?.email;

      const endpoint = (task.type || '').toLowerCase().includes('proyek')
        ? `/mobile/proyek/${task.id}/dokumentasi-akhir`
        : `/mobile/pekerjaan/${task.id}/dokumentasi-akhir`;

      const form: any = new FormData();
      form.append('id_pengguna', id_pengguna);

      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const fileType = result.assets[0].type || 'image/jpeg';

      // @ts-ignore
      form.append('dokumentasi_akhir', { uri, name: filename, type: fileType });

      const uploadRes = await api.post(endpoint, form, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (uploadRes && uploadRes.data) {
        setDokumenExists(true);
        setDokumenId(uploadRes.data.id_dokumen || uploadRes.data.id || null);
        if (uploadRes.data.dokumen && (uploadRes.data.dokumen.file || uploadRes.data.dokumen.url)) {
          setDokumenUrl(uploadRes.data.dokumen.file || uploadRes.data.dokumen.url);
        }
        setPhoto(uri);
        await AsyncStorage.setItem(`task_doc_${task.id}`, uri);
      }
    } catch (uploadErr) {
      console.log('upload failed, saving locally', uploadErr);
      setPhoto(uri);
      await AsyncStorage.setItem(`task_doc_${task.id}`, uri);
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentPress = () => {
    if (photo || dokumenExists) {
      setShowPhotoModal(true);
    } else {
      handleUpload();
    }
  };

  const saveSurveyStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem(`task_survey_${task.id}`, String(status));
      setSurveyCompleted(status);
    } catch (error) {
      console.log('Error saving survey:', error);
    }
  };

  const handleSurvey = () => {
    if (!surveyCompleted) {
      navigation.navigate('Survey', { taskId: task.id, taskType: task.type, onSurveyComplete: () => saveSurveyStatus(true) });
    } else {
      setShowSurveyModal(true);
    }
  };

  const staffList =
    Array.isArray(
      task.assignedTo,
    )
      ? task.assignedTo
      : [task.assignedTo];
  if (loadingDetail) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={arrowIcon}
          style={{
            width: 18,
            height: 18,
            tintColor: '#2563EB',
            transform: [{ scaleX: -1 }],
          }}
        />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {task.status === 'Dalam Tinjauan'
              ? 'Menunggu ACC Kepala Divisi'
              : task.status === 'Selesai'
              ? 'Selesai'
              : task.status}
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.title
        }
      >
        {task.title}
      </Text>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Tipe
        </Text>
        <Text
          style={
            styles.value
          }
        >
          {task.type || 'Pekerjaan'}
        </Text>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Unit Peminta
        </Text>
        <Text
          style={
            styles.value
          }
        >
          {task.assignedBy || '-'}
        </Text>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Lokasi
        </Text>
        <Text
          style={
            styles.value
          }
        >
          {task.location || '-'}
        </Text>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Deadline
        </Text>
        <Text
          style={
            styles.value
          }
        >
          {task.deadline}
        </Text>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Deskripsi
        </Text>
        <Text
          style={
            styles.description
          }
        >
          {task.description}
        </Text>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Daftar Staf
        </Text>
        {staffList.map(
          (staff: string, index: number) => (
            <Text
              key={index}
              style={
                styles.value
              }
            >
              {staff}
            </Text>
          ),
        )}
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Dokumentasi Akhir
        </Text>
        <Text
          style={
            styles.subText
          }
        >
          {photo
            ? 'Sudah upload dokumentasi'
            : 'Belum upload dokumentasi'}
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDocumentPress}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>{photo ? 'Lihat Dokumen' : 'Upload Dokumentasi'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.label
          }
        >
          Survei Klien
        </Text>
        <Text
          style={
            styles.subText
          }
        >
          {surveyCompleted
            ? 'Sudah isi survei'
            : 'Belum isi survei'}
        </Text>
        <TouchableOpacity
          style={
            styles.actionButton
          }
          onPress={
            handleSurvey
          }
        >
          <Text
            style={
              styles.actionButtonText
            }
          >
            {surveyCompleted
              ? 'Lihat Survei'
              : 'Isi Survei'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={
          showPhotoModal
        }
        transparent={true}
        onRequestClose={() =>
          setShowPhotoModal(
            false,
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalContent
            }
          >
            <TouchableOpacity
              style={
                styles.closeButton
              }
              onPress={() =>
                setShowPhotoModal(
                  false,
                )
              }
            >
              <Text
                style={
                  styles.closeButtonText
                }
              >
                ✕
              </Text>
            </TouchableOpacity>

            <Image
              source={{
                uri: photo ||
                  '',
              }}
              style={
                styles.fullImage
              }
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={
          showSurveyModal
        }
        transparent={true}
        onRequestClose={() =>
          setShowSurveyModal(
            false,
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.surveyModalContent
            }
          >
            <TouchableOpacity
              style={
                styles.closeButton
              }
              onPress={() =>
                setShowSurveyModal(
                  false,
                )
              }
            >
              <Text
                style={
                  styles.closeButtonText
                }
              >
                ✕
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.surveyTitle
              }
            >
              Survei Klien
            </Text>

            <Text
              style={
                styles.surveyStatus
              }
            >
              ✓ Survei sudah
              diselesaikan
            </Text>

            <TouchableOpacity
              style={
                styles.surveyCloseBtn
              }
              onPress={() =>
                setShowSurveyModal(
                  false,
                )
              }
            >
              <Text
                style={
                  styles.surveyCloseBtnText
                }
              >
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}