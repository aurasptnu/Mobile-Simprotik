import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
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

const profileIcon = require('../../assets/images/profile.png');
const arrowIcon = require('../../assets/images/panah.png');

export default function TaskDetailScreen() {
  const route =
    useRoute<any>();

  const navigation =
    useNavigation<any>();

  const { task } =
    route.params;

  const [
    photo,
    setPhoto,
  ] = useState<
    string | null
  >(null);

  const [
    surveyCompleted,
    setSurveyCompleted,
  ] = useState(
    task?.surveyCompleted ?? false,
  );

  const [
    showPhotoModal,
    setShowPhotoModal,
  ] = useState(false);

  const [
    showSurveyModal,
    setShowSurveyModal,
  ] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStorageData();
    }, [task.id]),
  );

  const loadStorageData =
    async () => {
      try {
        const savedDoc =
          await AsyncStorage.getItem(
            `task_doc_${task.id}`,
          );
        if (savedDoc) {
          setPhoto(savedDoc);
        }

        const savedSurvey =
          await AsyncStorage.getItem(
            `task_survey_${task.id}`,
          );
        if (savedSurvey === 'true') {
          setSurveyCompleted(true);
        }
      } catch (error) {
        console.log(
          'Error loading storage:',
          error,
        );
      }
    };

  const handleUpload =
    async () => {
      const result =
        await launchImageLibrary(
          {
            mediaType:
              'photo',
            quality: 0.8,
          },
        );

      if (
        result.assets
      ) {
        const uri =
          result.assets[0]
            .uri || null;
        if (uri) {
          setPhoto(uri);
          await AsyncStorage.setItem(
            `task_doc_${task.id}`,
            uri,
          );
        }
      }
    };

  const handleDocumentPress =
    () => {
      if (photo) {
        setShowPhotoModal(true);
      } else {
        handleUpload();
      }
    };

  const saveSurveyStatus =
    async (status: boolean) => {
      try {
        await AsyncStorage.setItem(
          `task_survey_${task.id}`,
          String(status),
        );
        setSurveyCompleted(status);
      } catch (error) {
        console.log(
          'Error saving survey:',
          error,
        );
      }
    };

  const handleSurvey = () => {
    if (!surveyCompleted) {
      navigation.navigate(
        'Survey',
        {
          taskId: task.id,
          onSurveyComplete: () =>
            saveSurveyStatus(true),
        },
      );
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

  return (
    <ScrollView
      style={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
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
          style={
            styles.actionButton
          }
          onPress={
            handleDocumentPress
          }
        >
          <Text
            style={
              styles.actionButtonText
            }
          >
            {photo
              ? 'Lihat Dokumen'
              : 'Upload Dokumentasi'}
          </Text>
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