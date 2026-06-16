import AsyncStorage from '@react-native-async-storage/async-storage';
// react-native-fs will be used to write a JSON file on device storage
// Make sure to install it: `npm install react-native-fs` and rebuild the app.
import RNFS from 'react-native-fs';

export type SurveyResponse = {
  id: number;
  // answers keyed by question id (e.g. { q1: 'Puas', q2: 'Netral', ... })
  answers: { [questionId: string]: string };
  // free-text comment (optional)
  comment?: string;
  submittedAt: string;
};

const SURVEY_STORAGE_KEY = 'surveyResponses';
const SURVEY_FILE =
  (RNFS.DocumentDirectoryPath || RNFS.ExternalDirectoryPath || RNFS.ExternalStorageDirectoryPath) +
  '/survey.json';

// This file is stored on the device in the app's document directory,
// not in the project workspace file `survey.json`.
console.log('Survey JSON file path:', SURVEY_FILE);

export const surveyResponses: SurveyResponse[] = [];

export const loadSurveyResponses = async () => {
  try {
    const json = await AsyncStorage.getItem(SURVEY_STORAGE_KEY);
    if (json) {
      const parsed: SurveyResponse[] = JSON.parse(json);
      surveyResponses.length = 0;
      surveyResponses.push(...parsed);
    }
  } catch (error) {
    console.log('LOAD SURVEY RESPONSES ERROR:', error);
  }
};

export const saveSurveysToFile = async () => {
  try {
    await RNFS.writeFile(SURVEY_FILE, JSON.stringify(surveyResponses), 'utf8');
  } catch (error) {
    console.log('SAVE SURVEY FILE ERROR:', error);
  }
};

export const loadSurveysFromFile = async () => {
  try {
    const exists = await RNFS.exists(SURVEY_FILE);
    if (!exists) {
      console.log('Survey file not found, loading from AsyncStorage instead:', SURVEY_FILE);
      await loadSurveyResponses();
      if (surveyResponses.length > 0) {
        await saveSurveysToFile();
      }
      return;
    }

    const content = await RNFS.readFile(SURVEY_FILE, 'utf8');
    const parsed: SurveyResponse[] = JSON.parse(content || '[]');
    surveyResponses.length = 0;
    surveyResponses.push(...parsed);
    console.log('Loaded survey responses from file, count=', surveyResponses.length);

    // also keep AsyncStorage in sync
    try {
      await AsyncStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(surveyResponses));
    } catch (e) {
      console.log('SYNC TO ASYNCSTORAGE ERROR:', e);
    }
  } catch (error) {
    console.log('LOAD SURVEY FILE ERROR:', error);
  }
};

export const addSurveyResponse = async (response: SurveyResponse) => {
  surveyResponses.push(response);
  try {
    await AsyncStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(surveyResponses));
    console.log('Saved survey response to AsyncStorage, count=', surveyResponses.length);
  } catch (error) {
    console.log('SAVE SURVEY RESPONSE ERROR:', error);
  }

  // write to device file so there's a real JSON file to inspect
  await saveSurveysToFile();
};

