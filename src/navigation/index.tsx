import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login';
import LoginManualScreen from '../screens/LoginManual';
import SSOWebViewScreen from '../screens/SSOWebView';
import MainTab from './MainTab';

import TaskDetailScreen from '../screens/TaskDetail';
import SurveyScreen from '../screens/Survey';

const Stack =
  createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* LOGIN */}
        <Stack.Screen
          name="Login"
          component={
            LoginScreen
          }
        />

        <Stack.Screen
          name="SSOWebView"
          component={
            SSOWebViewScreen
          }
        />

        <Stack.Screen
          name="LoginManual"
          component={
            LoginManualScreen
          }
        />

        {/* TAB */}
        <Stack.Screen
          name="Main"
          component={
            MainTab
          }
        />

        {/* DETAIL TASK */}
        <Stack.Screen
          name="TaskDetail"
          component={
            TaskDetailScreen
          }
        />

        {/* SURVEY */}
        <Stack.Screen
          name="Survey"
          component={
            SurveyScreen
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}