import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  User,
  Mail,
  X,
  MoreVertical,
  AlertCircle,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { userService } from '@/services/userServices';
import { CreateUserInput, UpdateUserInput, UserData, UserFilters } from '@/types/user.types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { useRouter } from 'expo-router';

const ITEMS_PER_PAGE = 10;

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: 'latest',
  });
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'user'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserInput | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const [newUser, setNewUser] = useState<CreateUserInput>({
    name: '',
    password: '',
    status: 'active',
    email: '',
    role: 'user' as 'admin' | 'user',
  });


  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);


  // Load users when filters change
  useEffect(() => {
    loadUsers(true);
  }, [filters]);

  const loadUsers = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const data = await userService.getAll(filters);

      if (reset) {
        setUsers(data);
      } else {
        setUsers(prev => [...prev, ...data]);
      }

      // Check if there are more items
      setHasMore(data.length === ITEMS_PER_PAGE);
      setTotalUsers(data.length); // In real API, this would come from response headers
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setFilters(prev => ({ ...prev, page: 1 }));
    await loadUsers(true);
    setRefreshing(false);
  };


  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const user = await userService.create(newUser);
      setNewUser({ name: '', email: '', role: 'user', password: '' });
      setShowAddModal(false);
      Alert.alert('Success', 'User added successfully');
      onRefresh(); // Refresh list
    } catch (err) {
      Alert.alert('Error', 'Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UpdateUserInput) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowOptionsMenu(null);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await userService.update(selectedUser);
      setShowEditModal(false);
      Alert.alert('Success', 'User updated successfully');
      onRefresh();
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await userService.delete(userId);
              setShowOptionsMenu(null);
              Alert.alert('Success', 'User deleted successfully');
              onRefresh();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete user');
              console.error('Error deleting user:', err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      await userService.update({
        ...user,
        status: user.status === 'active' ? 'inactive' : 'active',
      });
      setShowOptionsMenu(null);
      onRefresh();
    } catch (err) {
      Alert.alert('Error', 'Failed to update user status');
      console.error('Error toggling status:', err);
    }
  };

  const applyFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      page: 1,
      limit: ITEMS_PER_PAGE,
      sortBy: 'latest',
    });
    setShowFilterModal(false);
  };


  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.role) count++;
    if (filters.status) count++;
    if (filters.sortBy && filters.sortBy !== 'latest') count++;
    return count;
  };

  const RoleChip = ({ role }: { role: string }) => (
    <View style={[
      styles.roleChip,
      { backgroundColor: role === 'admin' ? '#ef444410' : '#3b82f610' }
    ]}>
      <Text style={[
        styles.roleText,
        { color: role === 'admin' ? '#ef4444' : '#3b82f6' }
      ]}>
        {role.toUpperCase()}
      </Text>
    </View>
  );

  const StatusBadge = ({ status }: { status: string }) => (
    <View style={[
      styles.statusBadge,
      { backgroundColor: status === 'active' ? '#10b98110' : '#6b728010' }
    ]}>
      <View style={[
        styles.statusDot,
        { backgroundColor: status === 'active' ? '#10b981' : '#6b7280' }
      ]} />
      <Text style={[
        styles.statusText,
        { color: status === 'active' ? '#10b981' : '#6b7280' }
      ]}>
        {status}
      </Text>
    </View>
  );

  const UserModal = ({ visible, onClose, title, children }: any) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <User size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No users found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery || filters.role || filters.status
          ? 'Try adjusting your filters'
          : 'Add your first user to get started'}
      </Text>
      {(searchQuery || filters.role || filters.status) && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.primary }]}
          onPress={clearFilters}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const ErrorState = () => (
    <View style={styles.emptyState}>
      <AlertCircle size={48} color="#ef4444" />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Failed to load users</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {error}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)} activeOpacity={0.7}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterModalBody}>
            {/* Role Filter */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Role</Text>
              <View style={styles.filterOptions}>
                {[
                  { value: undefined, label: 'All' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'User' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.role === option.value
                          ? colors.primary
                          : `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => setFilters((prev: any) => ({ ...prev, role: option.value }))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: filters.role === option.value ? '#FFFFFF' : colors.text,
                          fontWeight: filters.role === option.value ? '700' : '500',
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Status</Text>
              <View style={styles.filterOptions}>
                {[
                  { value: undefined, label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.status === option.value
                          ? colors.primary
                          : `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => setFilters((prev: any) => ({ ...prev, status: option.value }))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: filters.status === option.value ? '#FFFFFF' : colors.text,
                          fontWeight: filters.status === option.value ? '700' : '500',
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Sort By</Text>
              <View style={styles.filterOptions}>
                {[
                  { value: 'latest', label: 'Latest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'name', label: 'Name' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.sortBy === option.value
                          ? colors.primary
                          : `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: filters.sortBy === option.value ? '#FFFFFF' : colors.text,
                          fontWeight: filters.sortBy === option.value ? '700' : '500',
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={clearFilters}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilterModal(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderUserCard = ({ item: user }: { item: UserData }) => (
    <View
      style={[styles.userCard, {
        backgroundColor: colors.card || colors.background,
        shadowColor: colors.text,
      }]}
    >
      <View style={styles.userInfo}>
        <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user.email}
          </Text>
          <View style={styles.userMeta}>
            <RoleChip role={user.role} />
            <StatusBadge status={user.status} />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => setShowOptionsMenu(showOptionsMenu === user.id ? null : user.id)}
        activeOpacity={0.7}
      >
        <MoreVertical size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {showOptionsMenu === user.id && (
        <View style={[styles.optionsMenu, {
          backgroundColor: colors.card || colors.background,
          shadowColor: colors.text,
        }]}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleEditUser(user)}
            activeOpacity={0.7}
          >
            <Edit2 size={16} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleToggleStatus(user.id)}
            activeOpacity={0.7}
          >
            <Shield size={16} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleDeleteUser(user.id)}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={[styles.optionText, { color: '#ef4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading users...
        </Text>
      </View>
    );
  }

  if (error && users.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>User Management</Text>
        </View>
        <ErrorState />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <AppHeader
        variant="back"
        title="User Management"
        subtitle={`${users.length} ${users.length === 1 ? 'user' : 'users'} • Manage users and permissions`}
        onBackPress={() => router.back()}
        colors={colors}
      />

      {/* Search and Actions */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: `${colors.primary}08` }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search users..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterButton, {
            backgroundColor: getActiveFilterCount() > 0 ? colors.primary : `${colors.primary}10`,
          }]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <ArrowUpDown size={20} color={getActiveFilterCount() > 0 ? '#FFFFFF' : colors.text} />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <UserPlus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {(filters.role || filters.status || (filters.sortBy && filters.sortBy !== 'latest')) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersScroll}
          contentContainerStyle={styles.activeFiltersContainer}
        >
          {filters.role && (
            <View style={[styles.activeFilterChip, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                Role: {filters.role}
              </Text>
              <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, role: undefined }))}>
                <X size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {filters.status && (
            <View style={[styles.activeFilterChip, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                Status: {filters.status}
              </Text>
              <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, status: undefined }))}>
                <X size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {filters.sortBy && filters.sortBy !== 'latest' && (
            <View style={[styles.activeFilterChip, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                Sort: {filters.sortBy}
              </Text>
              <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, sortBy: 'latest' }))}>
                <X size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.usersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingMoreText, { color: colors.textSecondary }]}>
                Loading more...
              </Text>
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <FilterModal />

      {/* Add User Modal */}
      <UserModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewUser({ name: '', email: '', role: 'user', password: '' });
        }}
        title="Add New User"
      >
        <View style={styles.modalBody}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: `${colors.primary}08` }]}>
              <User size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter name"
                placeholderTextColor={colors.textSecondary}
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: `${colors.primary}08` }]}>
              <Mail size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter email"
                placeholderTextColor={colors.textSecondary}
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
            <View style={styles.roleSelector}>
              {['user', 'admin'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    {
                      backgroundColor: newUser.role === role
                        ? colors.primary
                        : `${colors.primary}10`,
                    },
                  ]}
                  onPress={() => setNewUser({ ...newUser, role: role as any })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      {
                        color: newUser.role === role ? '#FFFFFF' : colors.text,
                        fontWeight: newUser.role === role ? '700' : '500',
                      },
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => {
                setShowAddModal(false);
                setNewUser({ name: '', email: '', role: 'user', password: '' });
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddUser}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Add User</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </UserModal>

      {/* Edit User Modal */}
      {selectedUser && (
        <UserModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          title="Edit User"
        >
          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: `${colors.primary}08` }]}>
                <User size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                  value={selectedUser.name}
                  onChangeText={(text) => setSelectedUser({ ...selectedUser, name: text })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { backgroundColor: `${colors.primary}08` }]}>
                <Mail size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  value={selectedUser.email}
                  onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
              <View style={styles.roleSelector}>
                {['user', 'admin'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      {
                        backgroundColor: selectedUser.role === role
                          ? colors.primary
                          : `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => setSelectedUser({ ...selectedUser, role: role as any })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        {
                          color: selectedUser.role === role ? '#FFFFFF' : colors.text,
                          fontWeight: selectedUser.role === role ? '700' : '500',
                        },
                      ]}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleUpdateUser}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </UserModal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFiltersScroll: {
    marginBottom: 12,
    maxHeight: 40,
  },
  activeFiltersContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  usersList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    position: 'relative',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  optionsButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 12,
    padding: 8,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    zIndex: 10,
    minWidth: 150,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  clearButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  modalBody: {
    gap: 16,
  },
  filterModalBody: {
    gap: 20,
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 14,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleOptionText: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});