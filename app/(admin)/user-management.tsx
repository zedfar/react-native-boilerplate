import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
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
  Check,
  MoreVertical,
} from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { Button } from '@components/common/Button';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'user'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);

  // Mock users data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-25',
    },
    {
      id: '5',
      name: 'Tom Brown',
      email: 'tom.brown@example.com',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-04-05',
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const user: UserData = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user' });
    setShowAddModal(false);
    Alert.alert('Success', 'User added successfully');
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowOptionsMenu(null);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setShowEditModal(false);
    Alert.alert('Success', 'User updated successfully');
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
          onPress: () => {
            setUsers(users.filter(u => u.id !== userId));
            setShowOptionsMenu(null);
            Alert.alert('Success', 'User deleted successfully');
          },
        },
      ]
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
    setShowOptionsMenu(null);
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Management</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Manage users and permissions
        </Text>
      </View>

      {/* Search and Filter */}
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
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <UserPlus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Role Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {['all', 'admin', 'user'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedRole === role
                  ? colors.primary
                  : `${colors.primary}10`,
              },
            ]}
            onPress={() => setSelectedRole(role as any)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selectedRole === role ? '#FFFFFF' : colors.text,
                  fontWeight: selectedRole === role ? '700' : '500',
                },
              ]}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Users Count */}
      <Text style={[styles.countText, { color: colors.textSecondary }]}>
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
      </Text>

      {/* Users List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.usersList}>
        {filteredUsers.map((user) => (
          <View
            key={user.id}
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
        ))}
      </ScrollView>

      {/* Add User Modal */}
      <UserModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
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
              onPress={() => setShowAddModal(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddUser}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Add User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </UserModal>

      {/* Edit User Modal */}
      {selectedUser && (
        <UserModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
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
                onPress={() => setShowEditModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleUpdateUser}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </UserModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 15,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  countText: {
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 13,
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});