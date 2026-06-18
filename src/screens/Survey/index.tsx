import React, {useEffect, useState} from 'react';

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
import { getStaffUUID } from '../../storage/auth';

import { addSurveyResponse } from '../../data/survey';
import { surveyQuestions } from '../../data/surveyQuestions';
import { styles } from './styles';
import {
  getSurveyQuestions,
  MobileSurveyQuestion,
  submitTaskSurvey,
} from '../../services/mobile';

const arrowIcon = require('../../assets/images/panah.png');

export default function SurveyScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { task, onSurveyComplete } = route.params || {};

  // answers keyed by question id
  const [answers, setAnswers] = useState<{[k:string]: string}>({});
  const [comment, setComment] = useState('');
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<MobileSurveyQuestion[]>(surveyQuestions);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoadingQuestions(true);

    try {
      const remoteQuestions = await getSurveyQuestions();

      if (remoteQuestions.length > 0) {
        setQuestions(remoteQuestions);
      }
    } catch (error) {
      console.log('load survey questions failed, using local fallback', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

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
    const choiceQuestions = questions.filter(q => q.type === 'choice').slice(0, 5);
    const missing = choiceQuestions.find(q => !answers[q.id]);
    if (missing) {
      setSubmitting(false);
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
    if (task) {
      try {
        const staffUUID = await getStaffUUID();
        
        if (!staffUUID) {
          console.log('No staff UUID found for survey submission');
        } else {
          const payload = {
            id_pengguna: staffUUID,
            nama_klien: nama,
            nip_klien: nip,
            jawaban1: Number(answers[choiceQuestions[0].id]),
            jawaban2: Number(answers[choiceQuestions[1].id]),
            jawaban3: Number(answers[choiceQuestions[2].id]),
            jawaban4: Number(answers[choiceQuestions[3].id]),
            jawaban5: Number(answers[choiceQuestions[4].id]),
            jawaban6: comment || '',
          };

          await submitTaskSurvey(task, payload);

          await AsyncStorage.setItem(`task_survey_${task.kind}_${task.rawId || task.id}`, 'true');
        }
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
      <Text style={styles.header}>Survei Klien</Text>

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

      {loadingQuestions && (
        <View style={styles.card}>
          <ActivityIndicator color="#2563EB" />
        </View>
      )}

      {questions.map((q, idx) => (
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
