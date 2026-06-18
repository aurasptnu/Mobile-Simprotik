import React, {useEffect, useState} from 'react';

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

import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {styles} from './styles';
import {getStaffUUID} from '../../storage/auth';
import {
  getDocumentFileUrl,
  getMobileTaskDetail,
  uploadFinalDocumentation,
} from '../../services/mobile';

const arrowIcon = require('../../assets/images/panah.png');

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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [uploading, setUploading] = useState(false);

  const storageKey = `${task.kind}_${task.rawId || task.id}`;

  useEffect(() => {
    loadDetail();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDetail();
    }, [task.rawId, task.kind]),
  );

  const loadDetail = async () => {
    setLoadingDetail(true);

    try {
      const staffUUID = await getStaffUUID();

      if (!staffUUID) {
        console.log('No staff UUID found');
        return;
      }

      const remoteDetail = await getMobileTaskDetail(task, staffUUID);
      setDetail(remoteDetail);
      setDokumenExists(remoteDetail.hasDocument);
      setDokumenId(remoteDetail.documentId || null);
      setDokumenUrl(remoteDetail.documentUrl || null);
      setSurveyCompleted(remoteDetail.surveyCompleted);
    } catch (error) {
      console.log('loadDetail error, falling back to local storage', error);
    } finally {
      try {
        const savedDoc = await AsyncStorage.getItem(`task_doc_${storageKey}`);
        const savedSurvey = await AsyncStorage.getItem(`task_survey_${storageKey}`);

        if (savedDoc) {
          setPhoto(savedDoc);
          setDokumenExists(true);
        }

        if (savedSurvey === 'true') {
          setSurveyCompleted(true);
        }
      } catch (error) {
        console.log('fallback load error', error);
      }

      setLoadingDetail(false);
    }
  };

  const handleUpload = async () => {
    if (dokumenExists || photo) {
      setShowPhotoModal(true);
      return;
    }

    if ((detail || task).status !== 'Sedang Berlangsung') {
      return;
    }

    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});

    const asset = result.assets?.[0];
    const uri = asset?.uri;

    if (!uri) {
      return;
    }

    setUploading(true);

    try {
      const staffUUID = await getStaffUUID();

      if (!staffUUID) {
        console.log('No staff UUID found');
        return;
      }

      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const uploadRes = await uploadFinalDocumentation(task, staffUUID, {
        uri,
        name: filename,
        type: asset.type || 'image/jpeg',
      });

      setDokumenExists(true);
      setDokumenId(uploadRes?.id_dokumen || uploadRes?.id || null);
      setDokumenUrl(uploadRes?.dokumen?.file || uploadRes?.dokumen?.url || null);
      setPhoto(uri);
      await AsyncStorage.setItem(`task_doc_${storageKey}`, uri);
    } catch (error) {
      console.log('upload failed, saving locally', error);
      setDokumenExists(true);
      setPhoto(uri);
      await AsyncStorage.setItem(`task_doc_${storageKey}`, uri);
    } finally {
      setUploading(false);
    }
  };

  const saveSurveyStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem(`task_survey_${storageKey}`, String(status));
      setSurveyCompleted(status);
    } catch (error) {
      console.log('Error saving survey:', error);
    }
  };

  const handleSurvey = () => {
    if (surveyCompleted) {
      setShowSurveyModal(true);
      return;
    }

    if (!dokumenExists && !photo) {
      return;
    }

    navigation.navigate('Survey', {
      task: detail || task,
      onSurveyComplete: () => saveSurveyStatus(true),
    });
  };

  const visibleTask = detail || task;
  const documentUri = photo || dokumenUrl || (dokumenId ? getDocumentFileUrl(dokumenId) : '');
  const canFillSurvey = surveyCompleted || dokumenExists || Boolean(photo);
  const canUploadDocument = visibleTask.status === 'Sedang Berlangsung' && !dokumenExists && !photo;

  if (loadingDetail) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#2563EB" />
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
            tintColor: '#2563EB',
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
        <Text style={styles.label}>Unit Peminta</Text>
        <Text style={styles.value}>{visibleTask.assignedBy || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Lokasi</Text>
        <Text style={styles.value}>{visibleTask.location || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Target Selesai</Text>
        <Text style={styles.value}>{visibleTask.deadline || '-'}</Text>
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
          style={[styles.actionButton, !canUploadDocument && !dokumenExists && !photo && {backgroundColor: '#9CA3AF'}]}
          onPress={handleUpload}
          disabled={uploading || (!canUploadDocument && !dokumenExists && !photo)}>
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
          style={[styles.actionButton, !canFillSurvey && {backgroundColor: '#9CA3AF'}]}
          onPress={handleSurvey}
          disabled={!canFillSurvey}>
          <Text style={styles.actionButtonText}>
            {surveyCompleted ? 'Lihat Survei' : 'Isi Survei'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPhotoModal}
        transparent={true}
        onRequestClose={() => setShowPhotoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Image source={{uri: documentUri}} style={styles.fullImage} resizeMode="contain" />
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
            <Text style={styles.surveyStatus}>Survei sudah diselesaikan</Text>

            <TouchableOpacity style={styles.surveyCloseBtn} onPress={() => setShowSurveyModal(false)}>
              <Text style={styles.surveyCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
