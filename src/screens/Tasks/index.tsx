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
  ScrollView,
  Modal,
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
  fetchTasks,
} from '../../data/tasks';

import { styles } from './styles';
import {colors, font} from '../../theme';

const arrowIcon = require('../../assets/images/panah.png');

const formatJenis = (val: any) => {
  if (!val) return '-';
  const str = String(val).trim();
  if (!str) return '-';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const MONTH_OPTIONS = [
  { label: 'Semua Bulan', value: '' },
  { label: 'Januari', value: '1' },
  { label: 'Februari', value: '2' },
  { label: 'Maret', value: '3' },
  { label: 'April', value: '4' },
  { label: 'Mei', value: '5' },
  { label: 'Juni', value: '6' },
  { label: 'Juli', value: '7' },
  { label: 'Agustus', value: '8' },
  { label: 'September', value: '9' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
];

const getAvailableYears = (tasks: any[]) => {
  const currentYear = new Date().getFullYear();
  const yearSet = new Set<string>();
  yearSet.add(String(currentYear));
  yearSet.add(String(currentYear - 1));
  yearSet.add(String(currentYear + 1));

  tasks.forEach(task => {
    const deadline = String(task.deadline || task.raw?.target_selesai || '');
    const match = deadline.match(/\b(20\d{2})\b/);
    if (match && match[1]) {
      yearSet.add(match[1]);
    }
  });

  return Array.from(yearSet).sort();
};

const matchDeadlineDate = (deadlineStr: string, day: string, month: string, year: string) => {
  if (!day && !month && !year) return true;
  if (!deadlineStr || deadlineStr === '-') return false;

  const str = deadlineStr.toLowerCase();

  if (year.trim() && !str.includes(year.trim())) {
    return false;
  }

  if (day.trim()) {
    const dNum = parseInt(day.trim(), 10);
    if (!isNaN(dNum)) {
      const dPadded = dNum < 10 ? `0${dNum}` : `${dNum}`;
      const dayRegex = new RegExp(`\\b0?${dNum}\\b`);
      if (!dayRegex.test(str) && !str.includes(dPadded)) {
        return false;
      }
    }
  }

  if (month.trim()) {
    const mNum = parseInt(month.trim(), 10);
    const monthNames = [
      'jan', 'feb', 'mar', 'apr', 'mei', 'may', 'jun',
      'jul', 'agu', 'aug', 'sep', 'okt', 'oct', 'nov', 'des', 'dec',
    ];
    if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) {
      const mPadded = mNum < 10 ? `0${mNum}` : `${mNum}`;
      const mName = monthNames[mNum - 1];
      const matchNum =
        str.includes(`-${mPadded}-`) ||
        str.includes(`/${mPadded}/`) ||
        str.includes(`-${mNum}-`) ||
        str.includes(`/${mNum}/`);
      const matchText = str.includes(mName);
      if (!matchNum && !matchText) {
        return false;
      }
    } else if (!str.includes(month.trim().toLowerCase())) {
      return false;
    }
  }

  return true;
};

export default function TasksScreen() {
  const navigation =
    useNavigation<any>();

  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedJenis, setSelectedJenis] = useState('Semua');
  const [filterDay, setFilterDay] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [activePickerModal, setActivePickerModal] = useState<'day' | 'month' | 'year' | null>(null);

  const getMonthLabel = (val: string) => {
    const found = MONTH_OPTIONS.find(m => m.value === val);
    return found ? (found.value === '' ? 'Semua' : found.label) : 'Semua';
  };

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

        // Ambil tugas langsung dari backend.
        let myTasks: any[] = [];

        try {
          const remote = await fetchTasks(staffUUID);

          if (Array.isArray(remote)) {
            myTasks = remote;
          } else if (remote && Array.isArray((remote as any).data)) {
            myTasks = (remote as any).data;
          }
        } catch (e) {
          console.log('remote fetch failed', e);
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

    // 1. Filter Status
    if (selectedStatus !== 'Semua') {
      myTasks = myTasks.filter(
        task => String(task.status).toLowerCase() === selectedStatus.toLowerCase(),
      );
    }

    // 2. Filter Jenis Pekerjaan
    if (selectedJenis !== 'Semua') {
      myTasks = myTasks.filter(task => {
        const rawJ = String(
          task.jenis || task.raw?.jenis || task.raw?.jenis_pekerjaan || '',
        ).toLowerCase();
        if (selectedJenis === 'Jangka Panjang') {
          return rawJ.includes('panjang') || task.type === 'Proyek';
        }
        if (selectedJenis === 'Jangka Pendek') {
          return rawJ.includes('pendek') || task.type === 'Pekerjaan';
        }
        return true;
      });
    }

    // 3. Filter Tanggal / Bulan / Tahun
    if (filterDay || filterMonth || filterYear) {
      myTasks = myTasks.filter(task =>
        matchDeadlineDate(
          task.deadline || task.raw?.target_selesai || '',
          filterDay,
          filterMonth,
          filterYear,
        ),
      );
    }

    // 4. Search Query
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      myTasks = myTasks.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          String(task.description || '').toLowerCase().includes(query),
      );
    }

    setFilteredTasks(myTasks);
  }, [
    baseTasks,
    selectedStatus,
    selectedJenis,
    filterDay,
    filterMonth,
    filterYear,
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
          return styles.blueBadge;

        case 'Dalam Tinjauan':
          return styles.orangeBadge;

        case 'Selesai':
          return styles.greenBadge;

        case 'Ditugaskan':
          return styles.purpleBadge;

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
          Jenis Pekerjaan: {formatJenis(item.jenis || item.raw?.jenis || item.raw?.jenis_pekerjaan)}
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
          style={[
            styles.filterToggle,
            (selectedStatus !== 'Semua' ||
              selectedJenis !== 'Semua' ||
              Boolean(filterDay) ||
              Boolean(filterMonth) ||
              Boolean(filterYear)) &&
              styles.activeFilterToggle,
          ]}
          onPress={() => setFilterMenuVisible(prev => !prev)}>
          <Text
            style={[
              styles.filterToggleText,
              (selectedStatus !== 'Semua' ||
                selectedJenis !== 'Semua' ||
                Boolean(filterDay) ||
                Boolean(filterMonth) ||
                Boolean(filterYear)) &&
                styles.activeFilterToggleText,
            ]}>
            {selectedStatus !== 'Semua' ||
            selectedJenis !== 'Semua' ||
            Boolean(filterDay) ||
            Boolean(filterMonth) ||
            Boolean(filterYear)
              ? 'Filter •'
              : 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      {filterMenuVisible && (
        <View style={styles.filterMenu}>
          {/* Section: Status */}
          <Text style={styles.filterSectionTitle}>Status Pekerjaan</Text>
          <View style={styles.wrapChipRow}>
            {['Semua', 'Ditugaskan', 'Sedang Berlangsung', 'Dalam Tinjauan', 'Selesai'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  selectedStatus === status && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedStatus(status)}>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatus === status && styles.activeFilterChipText,
                  ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: Jenis Pekerjaan */}
          <Text style={styles.filterSectionTitle}>Jenis Pekerjaan</Text>
          <View style={styles.wrapChipRow}>
            {['Semua', 'Jangka Panjang', 'Jangka Pendek'].map(jenis => (
              <TouchableOpacity
                key={jenis}
                style={[
                  styles.filterChip,
                  selectedJenis === jenis && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedJenis(jenis)}>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedJenis === jenis && styles.activeFilterChipText,
                  ]}>
                  {jenis}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: Target Selesai (1 Row Dropdown Selectors) */}
          <Text style={styles.filterSectionTitle}>Target Selesai (Tgl / Bln / Thn)</Text>
          <View style={styles.dropdownRow}>
            <TouchableOpacity
              style={[styles.dropdownButton, filterDay !== '' && styles.activeDropdownButton]}
              onPress={() => setActivePickerModal('day')}>
              <Text style={styles.dropdownLabel}>Tgl: </Text>
              <Text style={styles.dropdownValue}>{filterDay ? filterDay : 'Semua'}</Text>
              <Text style={styles.dropdownArrow}> ▾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownButton, filterMonth !== '' && styles.activeDropdownButton]}
              onPress={() => setActivePickerModal('month')}>
              <Text style={styles.dropdownLabel}>Bln: </Text>
              <Text style={styles.dropdownValue}>{getMonthLabel(filterMonth)}</Text>
              <Text style={styles.dropdownArrow}> ▾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownButton, filterYear !== '' && styles.activeDropdownButton]}
              onPress={() => setActivePickerModal('year')}>
              <Text style={styles.dropdownLabel}>Thn: </Text>
              <Text style={styles.dropdownValue}>{filterYear ? filterYear : 'Semua'}</Text>
              <Text style={styles.dropdownArrow}> ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Action Row */}
          <View style={styles.filterActionRow}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedStatus('Semua');
                setSelectedJenis('Semua');
                setFilterDay('');
                setFilterMonth('');
                setFilterYear('');
              }}>
              <Text style={styles.resetButtonText}>Reset Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterMenuVisible(false)}>
              <Text style={styles.applyButtonText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal Picker for Selecting Date / Month / Year */}
      <Modal
        visible={activePickerModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActivePickerModal(null)}>
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setActivePickerModal(null)}>
          <View style={styles.pickerContent} onStartShouldSetResponder={() => true}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {activePickerModal === 'day'
                  ? 'Pilih Tanggal'
                  : activePickerModal === 'month'
                  ? 'Pilih Bulan'
                  : 'Pilih Tahun'}
              </Text>
              <TouchableOpacity onPress={() => setActivePickerModal(null)}>
                <Text style={styles.pickerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
              {activePickerModal === 'month' &&
                MONTH_OPTIONS.map(m => (
                  <TouchableOpacity
                    key={m.label}
                    style={[
                      styles.pickerItem,
                      filterMonth === m.value && styles.activePickerItem,
                    ]}
                    onPress={() => {
                      setFilterMonth(m.value);
                      setActivePickerModal(null);
                    }}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        filterMonth === m.value && styles.activePickerItemText,
                      ]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}

              {activePickerModal === 'year' &&
                ['Semua Tahun', ...getAvailableYears(baseTasks)].map(y => {
                  const val = y === 'Semua Tahun' ? '' : y;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.pickerItem,
                        filterYear === val && styles.activePickerItem,
                      ]}
                      onPress={() => {
                        setFilterYear(val);
                        setActivePickerModal(null);
                      }}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          filterYear === val && styles.activePickerItemText,
                        ]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

              {activePickerModal === 'day' && (
                <View style={styles.dayGrid}>
                  {['Semua', ...Array.from({ length: 31 }, (_, i) => String(i + 1))].map(d => {
                    const val = d === 'Semua' ? '' : d;
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.dayGridItem,
                          filterDay === val && styles.activePickerItem,
                        ]}
                        onPress={() => {
                          setFilterDay(val);
                          setActivePickerModal(null);
                        }}>
                        <Text
                          style={[
                            styles.dayGridItemText,
                            filterDay === val && styles.activePickerItemText,
                          ]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
              fontSize: font.size.lg,
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
