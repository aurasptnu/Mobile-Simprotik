import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Image,
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

import { styles } from './styles';
import {colors} from '../../theme';

const arrowIcon = require('../../assets/images/panah.png');
export default function TasksScreen() {
  const navigation =
    useNavigation<any>();

  const [
    selectedTab,
    setSelectedTab,
  ] = useState(
    'Semua',
  );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    filterMenuVisible,
    setFilterMenuVisible,
  ] = useState(false);

  const [
    baseTasks,
    setBaseTasks,
  ] = useState<any[]>(
    [],
  );

  const [
    filteredTasks,
    setFilteredTasks,
  ] = useState<any[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const loadTasks = useCallback(
    async () => {
      setLoading(true);

      try {
        const user =
          await getUser();

        console.log(
          'USER LOGIN:',
          user,
        );

        if (!user) {
          setFilteredTasks(
            [],
          );

          return;
        }

        // Dapatkan UUID staf dari storage
        const staffUUID = await getStaffUUID();
        
        if (!staffUUID) {
          console.log('No staff UUID found');
          setFilteredTasks([]);
          return;
        }

        // Try fetching from backend first; fallback to local mock tasks
        let myTasks: any[] = [];

        try {
          const remote = await fetchTasks(staffUUID);

          if (Array.isArray(remote)) {
            myTasks = remote;
          } else if (remote && Array.isArray((remote as any).data)) {
            myTasks = (remote as any).data;
          }
        } catch (e) {
          console.log('remote fetch failed, using local tasks', e);
        }

        // If remote didn't provide tasks, filter local mock tasks
        if (!myTasks || myTasks.length === 0) {
          const userEmail = String(user.email || '').trim().toLowerCase();

          myTasks = tasks.filter(task => {
            const assigned = task.assignedTo;
            const isAssigned = Array.isArray(assigned)
              ? assigned.map((a: any) => String(a).trim().toLowerCase()).includes(userEmail)
              : String(assigned).trim().toLowerCase() === userEmail;

            return isAssigned && task.isStarted === true;
          });
        }

        console.log(
          'FILTERED TASK:',
          myTasks,
        );

        setBaseTasks(
          myTasks,
        );
        setFilteredTasks(
          myTasks,
        );
      } catch (error) {
        console.log(
          'LOAD TASK ERROR:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const applyFilters = useCallback(() => {
    let myTasks = [...baseTasks];

    if (
      selectedTab ===
      'Selesai'
    ) {
      myTasks =
        myTasks.filter(
          task =>
            task.status ===
            'Selesai',
        );
    } else if (
      selectedTab ===
      'Sedang Berlangsung'
    ) {
      myTasks =
        myTasks.filter(
          task =>
            task.status ===
            'Sedang Berlangsung',
        );
    } else if (
      selectedTab ===
      'Dalam Tinjauan'
    ) {
      myTasks =
        myTasks.filter(
          task =>
            task.status ===
            'Dalam Tinjauan',
        );
    }

    if (
      searchQuery.trim().length > 0
    ) {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      myTasks =
        myTasks.filter(
          task =>
            task.title
              .toLowerCase()
              .includes(query),
        );
    }

    setFilteredTasks(
      myTasks,
    );
  }, [
    baseTasks,
    selectedTab,
    searchQuery,
  ]);

  useEffect(() => {
    loadTasks();

    const unsubscribe =
      navigation.addListener(
        'focus',
        loadTasks,
      );

    return unsubscribe;
  }, [
    navigation,
    loadTasks,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getStatusStyle =
    (
      status: string,
    ) => {
      switch (
        status
      ) {
        case 'Sedang Berlangsung':
          return styles.orangeBadge;

        case 'Dalam Tinjauan':
          return styles.yellowBadge;

        case 'Selesai':
          return styles.greenBadge;

        default:
          return styles.grayBadge;
      }
    };

  const renderTask =
    ({ item }: any) => (
      <TouchableOpacity
        style={
          styles.taskCard
        }
        onPress={() =>
          navigation.navigate(
            'TaskDetail',
            {
              task:
                item,
            },
          )
        }
      >
        <View
          style={
            styles.rowBetween
          }
        >
          <View
            style={[
              styles.badge,
              getStatusStyle(
                item.status,
              ),
            ]}
          >
            <Text
              style={
                styles.badgeText
              }
            >
              {
                item.status
              }
            </Text>
          </View>

          <Image
            source={arrowIcon}
            style={{
              width: 18,
              height: 18,
              tintColor: colors.textMuted,
              resizeMode: 'contain',
            }}
          />
        </View>

        <Text
          style={
            styles.taskTitle
          }
        >
          {item.title}
        </Text>

        <Text
          style={
            styles.taskInfo
          }
        >
          Tipe: {item.type || 'Pekerjaan'}
        </Text>

        <Text
          style={
            styles.taskInfo
          }
        >
          Unit peminta: {item.assignedBy}
        </Text>

        <Text
          style={
            styles.taskInfo
          }
        >
          Lokasi: {item.location || '-'}
        </Text>

        <Text
          style={
            styles.deadline
          }
        >
          Target selesai: {item.deadline}
        </Text>

        <View style={styles.indicatorRow}>
          <Text style={styles.indicatorText}>
            Dokumen: {item.hasDocument ? 'Ada' : 'Belum'}
          </Text>
          <Text style={styles.indicatorText}>
            Survei: {item.surveyCompleted ? 'Ada' : 'Belum'}
          </Text>
        </View>
      </TouchableOpacity>
    );

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        filterMenuVisible &&
        setFilterMenuVisible(
          false,
        )
      }
    >
      <View
        style={
          styles.container
        }
      >
      <Text
        style={
          styles.header
        }
      >
        Daftar Tugas
      </Text>

      <View
        style={
          styles.searchFilterRow
        }
      >
        <View
          style={
            styles.searchBox
          }
        >
          <TextInput
            style={
              styles.searchInput
            }
            placeholder="Cari tugas"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={text =>
              setSearchQuery(text)
            }
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          style={
            styles.filterToggle
          }
          onPress={() =>
            setFilterMenuVisible(
              prev => !prev,
            )
          }
        >
          <Text
            style={
              styles.filterToggleText
            }
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {filterMenuVisible && (
        <View
          style={
            styles.filterMenu
          }
        >
          {[
            'Semua',
            'Sedang Berlangsung',
            'Dalam Tinjauan',
            'Selesai',
          ].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterOption,
                selectedTab ===
                  option &&
                  styles.activeOption,
              ]}
              onPress={() => {
                setSelectedTab(
                  option,
                );
                setFilterMenuVisible(
                  false,
                );
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedTab ===
                    option &&
                    styles.activeOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!loading && filteredTasks.length === 0 && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
          }}
        >
          <Text
            style={{
              color: colors.textSoft,
              fontSize: 16,
            }}
          >
            Belum ada tugas untuk user ini.
          </Text>
        </View>
      )}

      <FlatList
        data={
          filteredTasks
        }
        renderItem={
          renderTask
        }
        keyExtractor={item =>
          `${item.kind || item.type}-${item.id}`
        }
        showsVerticalScrollIndicator={
          false
        }
      />
    </View>
  </TouchableWithoutFeedback>
  );
}
