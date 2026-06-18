import React, {useEffect} from 'react';
import {NativeModules, Text, TextInput} from 'react-native';
import AppNavigation from './src/navigation';
import {loadSurveysFromFile} from './src/data/survey';
import {colors, font} from './src/theme';

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = [
  {
    fontFamily: font.family,
    color: colors.text,
    fontSize: font.size.base,
    lineHeight: font.lineHeight.base,
  },
  (Text as any).defaultProps.style,
];

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = [
  {fontFamily: font.family, color: colors.text, fontSize: font.size.base},
  (TextInput as any).defaultProps.style,
];

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
