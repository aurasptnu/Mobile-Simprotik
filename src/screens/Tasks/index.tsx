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

const parseDateParts = (deadlineStr: string) => {
  if (!deadlineStr || deadlineStr === '-') return null;
  const str = deadlineStr.trim();

  // 1. YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-08-20 or 2026-08-20 14:30:00)
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10),
      day: parseInt(isoMatch[3], 10),
    };
  }

  // 2. DD-MM-YYYY or DD/MM/YYYY (e.g. 20-08-2026 or 20/08/2026)
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    return {
      day: parseInt(dmyMatch[1], 10),
      month: parseInt(dmyMatch[2], 10),
      year: parseInt(dmyMatch[3], 10),
    };
  }

  // 3. Textual / Word format (e.g. "20 Agustus 2026", "20-Aug-2026")
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

const matchDeadlineDate = (deadlineStr: string, day: string, month: string, year: string) => {
  if (!day && !month && !year) return true;
  if (!deadlineStr || deadlineStr === '-') return false;

  const dateParts = parseDateParts(deadlineStr);
  if (!dateParts) return false;

  if (year.trim()) {
    const yNum = parseInt(year.trim(), 10);
    if (!isNaN(yNum) && dateParts.year !== null && dateParts.year !== yNum) {
      return false;
    }
  }

  if (month.trim()) {
    const mNum = parseInt(month.trim(), 10);
    if (!isNaN(mNum) && dateParts.month !== null && dateParts.month !== mNum) {
      return false;
    }
  }

  if (day.trim()) {
    const dNum = parseInt(day.trim(), 10);
    if (!isNaN(dNum) && dateParts.day !== null && dateParts.day !== dNum) {
      return false;
    }
  }

  return true;
};

const getLateDays = (deadlineStr?: string, status?: string) => {
  if (!deadlineStr || deadlineStr === '-' || status === 'Selesai') return 0;

  let deadlineDate: Date | null = null;
  const parts = parseDateParts(deadlineStr);
  if (parts && parts.year !== null && parts.month !== null && parts.day !== null) {
    deadlineDate = new Date(parts.year, parts.month - 1, parts.day);
  } else {
    const d = new Date(deadlineStr);
    if (!isNaN(d.getTime())) {
      deadlineDate = d;
    }
  }

  if (!deadlineDate || isNaN(deadlineDate.getTime())) return 0;

  const deadline = new Date(deadlineDate);
  const today = new Date();
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today > deadline) {
    const diffTime = Math.abs(today.getTime() - deadline.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
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
          task.jenis || task.jenisPekerjaan || task.raw?.jenis || task.raw?.jenis_pekerjaan || task.raw?.jenis_proyek || '',
        ).toLowerCase();

        const isProyek =
          rawJ.includes('panjang') ||
          rawJ.includes('proyek') ||
          task.kind === 'proyek' ||
          task.type === 'Proyek';

        if (selectedJenis === 'Jangka Panjang') {
          return isProyek;
        }
        if (selectedJenis === 'Jangka Pendek') {
          return !isProyek;
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
          {(() => {
            const lateDays = getLateDays(item.deadline, item.status);
            if (lateDays > 0) {
              return (
                <Text style={[styles.indicatorText, {backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 'bold'}]}>
                  Terlambat {lateDays} hari
                </Text>
              );
            }
            return null;
          })()}
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
