import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';
import AppNavigation from './src/navigation';
import {loadSurveysFromFile} from './src/data/survey';

export default function App() {
  useEffect(() => {
    const loadSurveyData = async () => {
      await loadSurveysFromFile();

      console.log('NATIVE MODULE AsyncStorage:', NativeModules.AsyncStorage);
      try {
        console.log('NATIVE MODULE KEYS:', Object.keys(NativeModules));
      } catch (e) {
        console.log('NATIVE MODULE KEYS ERROR:', e);
      }
    };

    loadSurveyData();
  }, []);

  return <AppNavigation />;
}