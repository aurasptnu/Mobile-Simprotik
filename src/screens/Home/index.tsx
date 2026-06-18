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

import {
  useNavigation,
} from '@react-navigation/native';

import {
  getUser,
  getStaffUUID,
} from '../../storage/auth';

import {
  tasks,
  fetchTasks,
} from '../../data/tasks';
import { getDashboard } from '../../services/mobile';

import { styles } from './styles';
import {colors} from '../../theme';

export default function HomeScreen() {
  const navigation =
    useNavigation<any>();

  const [user, setUser] =
    useState<any>(null);

  const [
    userTasks,
    setUserTasks,
  ] = useState<any[]>([]);
  const [dashboard, setDashboard] =
    useState<any>(null);

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
      
      // Dapatkan UUID staf dari storage
      const staffUUID = await getStaffUUID();
      
      if (!staffUUID) {
        console.log('No staff UUID found');
        return;
      }

      let remoteTasks: any[] = [];
      try {
        const dashboardData = await getDashboard(staffUUID);
        setDashboard(dashboardData?.data || dashboardData);
      } catch (e) {
        console.log('fetch dashboard failed:', e);
        setDashboard(null);
      }

      // Fetch tasks dari backend menggunakan UUID
      try {
        const res = await fetchTasks(staffUUID);
        if (Array.isArray(res)) remoteTasks = res;
        else if (res && Array.isArray((res as any).data)) remoteTasks = (res as any).data;
      } catch (e) {
        console.log('fetchTasks failed:', e);
      }

      let combined = remoteTasks || [];

      if (!combined || combined.length === 0) {
        // fallback ke local mock jika backend kosong
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
    dashboard?.total_tugas ??
    dashboard?.total ??
    userTasks.length;

  const selesai =
    dashboard?.selesai ??
    userTasks.filter(
      item =>
        item.status ===
        'Selesai',
    ).length;

  const sedangBerlangsung =
    dashboard?.sedang_berlangsung ??
    dashboard?.sedangBerlangsung ??
    userTasks.filter(
      item =>
        item.status ===
        'Sedang Berlangsung',
    ).length;

  const dalamTinjauan =
    dashboard?.dalam_tinjauan ??
    dashboard?.dalamTinjauan ??
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
            { backgroundColor: colors.goldLight },
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
            { backgroundColor: colors.navy50 },
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
            { backgroundColor: '#FFF7ED' },
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
            { backgroundColor: '#ECFDF5' },
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
            Number(b.id) - Number(a.id),
        )
        .slice(0, 3)
        .map(task => (
          <TouchableOpacity
            key={`${task.kind || task.type}-${task.id}`}
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
                Target:{' '}
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
