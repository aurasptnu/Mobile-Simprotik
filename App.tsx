import React, {useEffect} from 'react';
import {Linking, NativeModules, Text, TextInput} from 'react-native';
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
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = [
  {fontFamily: font.family, color: colors.text, fontSize: font.size.base},
  (TextInput as any).defaultProps.style,
];
(TextInput as any).defaultProps.allowFontScaling = false;

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

    const handleUrl = (url?: string | null) => {
      if (!url) {
        return;
      }

      console.log('SSO DEEPLINK URL:', url);
    };

    Linking.getInitialURL().then(handleUrl);
    const subscription = Linking.addEventListener('url', ({url}) => handleUrl(url));

    return () => {
      subscription?.remove();
    };
  }, []);

  return <AppNavigation />;
}
