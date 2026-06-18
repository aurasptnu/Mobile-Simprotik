import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Image,
  View,
} from 'react-native';

import HomeScreen from '../screens/Home';
import TasksScreen from '../screens/Tasks';
import ProfileScreen from '../screens/Profile';
import {colors, font, radius} from '../theme';

const homeIcon = require('../assets/images/home.png');
const taskIcon = require('../assets/images/task.png');
const profileIcon = require('../assets/images/profile.png');

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }) => ({
        headerShown:
          false,

        tabBarShowLabel:
          true,

        tabBarStyle: {
          position:
            'absolute',

          bottom: 18,

          left: 20,

          right: 20,

          borderRadius: radius.xxl,

          height: 75,

          paddingTop: 10,

          backgroundColor:
            colors.white,

          elevation: 12,

          shadowColor:
            colors.navy700,

          shadowOpacity:
            0.1,

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowRadius: 8,

          borderTopWidth: 0,
        },

        tabBarActiveTintColor:
          colors.primaryBlue,

        tabBarInactiveTintColor:
          colors.textMuted,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight:
            font.weight.semibold,
          marginBottom: 6,
        },

        tabBarIcon: ({
          focused,
          color,
        }) => {
          let iconSource;
          let size = 24;

          switch (route.name) {
            case 'Home':
              iconSource = homeIcon;
              size = 24;
              break;

            case 'Tugas':
              iconSource = taskIcon;
              size = 24;
              break;

            case 'Profil':
              iconSource = profileIcon;
              size = 24;
              break;
          }

          return (
            <View
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.6,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={iconSource}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  tintColor: color,
                }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={
          HomeScreen
        }
      />

      <Tab.Screen
        name="Tugas"
        component={
          TasksScreen
        }
      />

      <Tab.Screen
        name="Profil"
        component={
          ProfileScreen
        }
      />
    </Tab.Navigator>
  );
}
