import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  getUser,
} from '../../storage/auth';

import {
  tasks,
  fetchTasks,
} from '../../data/tasks';
import api from '../../services/api';

import { styles } from './styles';

export default function HomeScreen() {
  const navigation =
    useNavigation<any>();

  const [user, setUser] =
    useState<any>(null);

  const [
    userTasks,
    setUserTasks,
  ] = useState<any[]>([]);

  useEffect(() => {
    loadData();

    const unsubscribe =
      navigation.addListener(
        'focus',
        loadData,
      );

    return unsubscribe;
  }, [navigation]);

  const loadData =
    async () => {
      const loggedUser =
        await getUser();

      if (!loggedUser) {
        return;
      }

      setUser(loggedUser);
      // Try backend endpoints first (ngrok), fallback to local mock data
      const identifier = loggedUser.id || loggedUser.nip || loggedUser.email;

      let remoteTasks: any[] = [];
      let remoteProjects: any[] = [];

      try {
        const res = await fetchTasks(identifier);
        if (Array.isArray(res)) remoteTasks = res;
        else if (res && Array.isArray((res as any).data)) remoteTasks = (res as any).data;
      } catch (e) {
        console.log('fetchTasks failed:', e);
      }

      try {
        const resp = await api.get('/mobile/proyek-aktif', {
          params: { id_pengguna: identifier },
        });
        if (Array.isArray(resp.data)) remoteProjects = resp.data;
      } catch (e) {
        console.log('fetch proyek failed:', e);
      }

      let combined = [...(remoteTasks || []), ...(remoteProjects || [])];

      if (!combined || combined.length === 0) {
        // fallback to local mock filtering
        const userEmail = String(loggedUser.email || '').trim().toLowerCase();

        combined = tasks.filter(task => {
          const assigned = task.assignedTo;
          const isAssigned = Array.isArray(assigned)
            ? assigned.map(a => String(a).trim().toLowerCase()).includes(userEmail)
            : String(assigned).trim().toLowerCase() === userEmail;

          return isAssigned && task.isStarted;
        });
      }

      setUserTasks(combined);
    };

  // Statistik
  const totalTasks =
    userTasks.length;

  const selesai =
    userTasks.filter(
      item =>
        item.status ===
        'Selesai',
    ).length;

  const sedangBerlangsung =
    userTasks.filter(
      item =>
        item.status ===
        'Sedang Berlangsung',
    ).length;

  const dalamTinjauan =
    userTasks.filter(
      item =>
        item.status ===
        'Dalam Tinjauan',
    ).length;

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={{
        paddingBottom: 220,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}
      <View
        style={
          styles.header
        }
      >
        <View>
          <Text
            style={
              styles.welcome
            }
          >
            Selamat Datang,
          </Text>

          <Text
            style={
              styles.name
            }
          >
            {
              user?.name
            }
          </Text>
        </View>

        {/* notification button removed */}
      </View>

      {/* STATISTIK - All 4 cards in one row */}
      <View
        style={
          styles.statRow
        }
      >
        <View
          style={[
            styles.statCard,
            { backgroundColor: '#D1FAE5' },
          ]}
        >
          <Text
            style={
              styles.statTitle
            }
          >
            TOTAL
            TUGAS
          </Text>

          <Text
            style={
              styles.statNumber
            }
          >
            {
              totalTasks
            }
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: '#DBEAFE' },
          ]}
        >
          <Text
            style={
              styles.statTitle
            }
          >
            SEDANG
            BERLANGSUNG
          </Text>

          <Text
            style={
              styles.statNumber
            }
          >
            {
              sedangBerlangsung
            }
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: '#FED7AA' },
          ]}
        >
          <Text
            style={
              styles.statTitle
            }
          >
            DALAM
            TINJAUAN
          </Text>

          <Text
            style={
              styles.statNumber
            }
          >
            {
              dalamTinjauan
            }
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: '#CFFAFE' },
          ]}
        >
          <Text
            style={
              styles.statTitle
            }
          >
            SELESAI
          </Text>

          <Text
            style={
              styles.statNumber
            }
          >
            {
              selesai
            }
          </Text>
        </View>
      </View>

      {/* PROGRESS */}
      <Text
        style={
          styles.sectionTitle
        }
      >
        PENYELESAIAN
        MINGGU INI
      </Text>

      <View
        style={
          styles.progressCard
        }
      >
        <View
          style={
            styles.rowBetween
          }
        >
          <Text
            style={
              styles.progressText2
            }
          >
            {selesai} dari{' '}
            {totalTasks}{' '}
            tugas selesai
          </Text>

          <Text
            style={
              styles.progressPercent
            }
          >
            {
              totalTasks > 0
                ? Math.round(
                    (selesai /
                      totalTasks) *
                      100,
                  )
                : 0
            }
            %
          </Text>
        </View>

        <View
          style={
            styles.progressBg
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  totalTasks > 0
                    ? Math.round(
                        (selesai /
                          totalTasks) *
                          100,
                      )
                    : 0
                }%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Notifications removed from UI */}

      {/* TUGAS */}
      <View
        style={
          styles.rowBetween
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          TUGAS
          TERBARU
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Tugas',
            )
          }
        >
          <Text
            style={
              styles.link
            }
          >
            Lihat Semua
          </Text>
        </TouchableOpacity>
      </View>

      {userTasks
        .sort(
          (a, b) =>
            b.id - a.id,
        )
        .slice(0, 3)
        .map(task => (
          <TouchableOpacity
            key={task.id}
            style={
              styles.taskCard
            }
            onPress={() =>
              navigation.navigate(
                'Tugas',
              )
            }
          >
            <Text
              style={
                styles.taskTitle
              }
            >
              {
                task.title
              }
            </Text>

            <View
              style={
                styles.taskInfoRow
              }
            >
              <Text
                style={
                  styles.taskInfo
                }
              >
                Tipe:{' '}
                {
                  task.type ||
                  'Pekerjaan'
                }
              </Text>
            </View>

            <View
              style={
                styles.taskFooter
              }
            >
              <Text
                style={
                  styles.taskStatus
                }
              >
                {
                  task.status
                }
              </Text>

              <Text
                style={
                  styles.taskDeadline
                }
              >
                Deadline:{' '}
                {
                  task.deadline
                }
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}