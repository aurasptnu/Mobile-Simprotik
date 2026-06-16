import React, {useState} from 'react';

import {
  Alert,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { getUser } from '../../storage/auth';

import { addSurveyResponse } from '../../data/survey';
import { surveyQuestions } from '../../data/surveyQuestions';
import { styles } from './styles';

const arrowIcon = require('../../assets/images/panah.png');

export default function SurveyScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { taskId, taskType, onSurveyComplete } = route.params || {};

  // answers keyed by question id
  const [answers, setAnswers] = useState<{[k:string]: string}>({});
  const [comment, setComment] = useState('');
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitSurvey = async () => {
    setSubmitting(true);
    // validate personal info
    if (!nama.trim()) {
      setSubmitting(false);
      Alert.alert('Perhatian', 'Harap isi nama Anda.');
      return;
    }
    if (!nip.trim()) {
      setSubmitting(false);
      Alert.alert('Perhatian', 'Harap isi NIP Anda.');
      return;
    }

    // ensure all choice questions answered
    const choiceQuestions = surveyQuestions.filter(q => q.type === 'choice');
    const missing = choiceQuestions.find(q => !answers[q.id]);
    if (missing) {
      Alert.alert('Perhatian', 'Harap jawab semua pertanyaan survey terlebih dahulu.');
      return;
    }

    const newSurvey = {
      id: Date.now(),
      nama,
      nip,
      answers,
      comment,
      submittedAt: new Date().toISOString(),
    } as any;
    // save locally as before
    await addSurveyResponse(newSurvey);

    // if invoked from TaskDetail with taskId, try submit to backend
    if (taskId) {
      try {
        const user = await getUser();
        const id_pengguna = user?.id || user?.nip || user?.email;

        const payload: any = {
          id_pengguna,
          nama_klien: nama,
          nip_klien: nip,
          jawaban1: answers['q1'] || '',
          jawaban2: answers['q2'] || '',
          jawaban3: answers['q3'] || '',
          jawaban4: answers['q4'] || '',
          jawaban5: answers['q5'] || '',
          jawaban6: comment || '',
        };

        const endpoint = (taskType || '').toLowerCase().includes('proyek')
          ? `/mobile/proyek/${taskId}/survei`
          : `/mobile/pekerjaan/${taskId}/survei`;

        await api.post(endpoint, payload);

        await AsyncStorage.setItem(`task_survey_${taskId}`, 'true');
      } catch (err) {
        console.log('submitSurvey backend error', err);
      }
    }

    if (typeof onSurveyComplete === 'function') {
      onSurveyComplete();
    }

    setAnswers({});
    setComment('');
    setNama('');
    setNip('');
    setSubmitting(false);
    Alert.alert('Berhasil', 'Survey berhasil disubmit', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const renderOption = (questionId: string, value: string, selected: string, onSelect: (v:string)=>void) => (
    <TouchableOpacity
      style={[styles.option, selected === value && styles.selectedOption]}
      onPress={() => onSelect(value)}
    >
      <Text style={[styles.optionText, selected === value && styles.selectedText]}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
      <Text style={styles.header}>Survey Pekerjaan</Text>

      {/* Personal Info Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Diri</Text>
        
        <Text style={styles.label}>Nama</Text>
        <TextInput
          placeholder="Masukkan nama Anda"
          value={nama}
          onChangeText={setNama}
          style={styles.inputSmall}
        />

        <Text style={styles.label}>NIP</Text>
        <TextInput
          placeholder="Masukkan NIP Anda"
          value={nip}
          onChangeText={setNip}
          style={styles.inputSmall}
        />
      </View>

      {/* Survey Scale Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Keterangan Nilai Survey</Text>
        <Text style={styles.scaleInfo}>1 = Sangat Tidak Puas</Text>
        <Text style={styles.scaleInfo}>2 = Tidak Puas</Text>
        <Text style={styles.scaleInfo}>3 = Netral</Text>
        <Text style={styles.scaleInfo}>4 = Puas</Text>
        <Text style={styles.scaleInfo}>5 = Sangat Puas</Text>
      </View>

      {surveyQuestions.map((q, idx) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.question}>{idx+1}. {q.text}</Text>

          {q.type === 'choice' && q.options?.map(opt => (
            renderOption(q.id, opt, answers[q.id] || '', (v) => setAnswers(prev => ({...prev, [q.id]: v})))
          ))}

          {q.type === 'text' && (
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Tulis kritik dan saran..."
              value={comment}
              onChangeText={setComment}
              style={styles.input}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={submitSurvey} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Survey</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}