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
  fetchTasks,
} from '../../data/tasks';
import { getDashboard } from '../../services/mobile';

import { styles } from './styles';
import {colors, font} from '../../theme';
import SandboxBanner from '../../components/SandboxBanner';

const formatJenis = (val: any) => {
  if (!val) return '-';
  const str = String(val).trim();
  if (!str) return '-';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const parseDateParts = (deadlineStr: string) => {

  if (!deadlineStr || deadlineStr === '-') return null;
  const str = deadlineStr.trim();

  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10),
      day: parseInt(isoMatch[3], 10),
    };
  }

  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    return {
      day: parseInt(dmyMatch[1], 10),
      month: parseInt(dmyMatch[2], 10),
      year: parseInt(dmyMatch[3], 10),
    };
  }

  const lowerStr = str.toLowerCase();
  const yearMatch = str.match(/\b(20\d{2})\b/);
  const dayMatch = str.match(/\b([1-9]|[12]\d|3[01])\b/);

  const monthMap: Record<string, number> = {
    jan: 1, januari: 1, january: 1,
    feb: 2, februari: 2, february: 2,
    mar: 3, maret: 3, march: 3,
    apr: 4, april: 4,
    mei: 5, may: 5,
    jun: 6, juni: 6, june: 6,
    jul: 7, juli: 7, july: 7,
    agu: 8, agustus: 8, aug: 8, august: 8,
    sep: 9, september: 9,
    okt: 10, oktober: 10, oct: 10, october: 10,
    nov: 11, november: 11,
    des: 12, desember: 12, dec: 12, december: 12,
  };

  let foundMonth: number | null = null;
  for (const [key, val] of Object.entries(monthMap)) {
    if (lowerStr.includes(key)) {
      foundMonth = val;
      break;
    }
  }

  const parsedDate = new Date(str);
  const validDate = !isNaN(parsedDate.getTime());

  return {
    day: dayMatch ? parseInt(dayMatch[1], 10) : validDate ? parsedDate.getDate() : null,
    month: foundMonth !== null ? foundMonth : validDate ? parsedDate.getMonth() + 1 : null,
    year: yearMatch ? parseInt(yearMatch[1], 10) : validDate ? parsedDate.getFullYear() : null,
  };
};

const isTaskOverdue = (task: any) => {
  if (!task.deadline || task.deadline === '-' || task.status === 'Selesai') return false;

  let deadlineDate: Date | null = null;
  const parts = parseDateParts(task.deadline);
  if (parts && parts.year !== null && parts.month !== null && parts.day !== null) {
    deadlineDate = new Date(parts.year, parts.month - 1, parts.day);
  } else {
    const d = new Date(task.deadline);
    if (!isNaN(d.getTime())) {
      deadlineDate = d;
    }
  }

  if (!deadlineDate || isNaN(deadlineDate.getTime())) return false;

  const deadline = new Date(deadlineDate);
  const today = new Date();
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return today > deadline;
};


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

      setUserTasks(remoteTasks || []);
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

  const totalTerlambat =
    dashboard?.terlambat ??
    userTasks.filter(isTaskOverdue).length;


  return (
    <View style={{flex: 1, backgroundColor: colors.surfaceAlt}}>
      <SandboxBanner />
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
            { backgroundColor: colors.orangeLight },
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
            { backgroundColor: colors.successLight },
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

      {/* CARD PERINGATAN TUGAS TERLAMBAT (FULL WIDTH) */}
      <TouchableOpacity
        style={[
          styles.warningCard,
          totalTerlambat > 0
            ? { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }
            : { backgroundColor: colors.white, borderColor: colors.borderSoft }
        ]}
        onPress={() => navigation.navigate('Tugas')}
        activeOpacity={0.8}
      >
        <View style={styles.warningCardContent}>
          <View style={[styles.warningIconContainer, totalTerlambat === 0 && { backgroundColor: colors.surface2 }]}>
            <Text style={{ fontSize: 20 }}>{totalTerlambat > 0 ? '⚠️' : '✅'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.warningCardTitle, totalTerlambat > 0 && { color: '#991b1b' }]}>
              PERINGATAN TUGAS TERLAMBAT
            </Text>
            <Text style={[styles.warningCardSub, totalTerlambat > 0 && { color: '#b91c1c' }]}>
              {totalTerlambat > 0
                ? `${totalTerlambat} tugas telah melewati target selesai`
                : 'Tidak ada tugas yang terlambat saat ini'}
            </Text>
          </View>
          <View style={[styles.warningBadge, totalTerlambat > 0 ? { backgroundColor: '#ef4444' } : { backgroundColor: colors.success || '#10b981' }]}>
            <Text style={{ color: '#ffffff', fontSize: font.size.sm, fontWeight: font.weight.bold }}>
              {totalTerlambat}
            </Text>
          </View>
        </View>
      </TouchableOpacity>


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
              <Text
                style={
                  styles.taskInfo
                }
              >
                Jenis: {formatJenis(task.jenis || task.raw?.jenis || task.raw?.jenis_pekerjaan)}
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
    </View>
  );
}
