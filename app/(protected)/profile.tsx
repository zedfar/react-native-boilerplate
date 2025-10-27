import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { useRouter } from 'expo-router';
import { UpdateUserInput } from '@/types/user.types';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { users, loading, updateUser } = useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    avatar: '',
    joinDate: '',
  });

  // Load current user data
  useEffect(() => {
    if (user && users.length > 0) {
      const userProfile = users.find(u => u.id === user.id || u.email === user.email);
      if (userProfile) {
        setCurrentUser(userProfile);
        setProfileData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          about: userProfile.about || '',
          avatar: userProfile.avatar || '',
          joinDate: new Date(userProfile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }),
        });
      }
    }
  }, [user, users]);

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      const updateData: UpdateUserInput = {
        id: currentUser.id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        about: profileData.about,
        role: currentUser.role,
        status: currentUser.status,
        avatar: currentUser.avatar,
      };

      const result = await updateUser(updateData);

      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        about: currentUser.about || '',
        avatar: currentUser.avatar || '',
        joinDate: new Date(currentUser.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }),
      });
    }
  };

  const InfoCard = ({ icon: Icon, label, value, editable = false, fieldKey }: any) => (
    <View style={[styles.infoCard, { backgroundColor: `${colors.primary}08` }]}>
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
        {isEditing && editable ? (
          <TextInput
            style={[styles.infoInput, { color: colors.text, borderColor: colors.border }]}
            value={value}
            onChangeText={(text) => setProfileData({ ...profileData, [fieldKey]: text })}
            placeholder={label}
            placeholderTextColor={colors.textSecondary}
          />
        ) : (
          <Text style={[styles.infoValue, { color: colors.text }]}>{value || '-'}</Text>
        )}
      </View>
    </View>
  );

  const StatCard = ({ title, value, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: colors.card || colors.background }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  if (loading && !currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          variant="back"
          title="Profile"
          subtitle="Manage your personal information"
          onBackPress={() => router.back()}
          colors={colors}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          variant="back"
          title="Profile"
          subtitle="Manage your personal information"
          onBackPress={() => router.back()}
          colors={colors}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Profile not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        variant="back"
        title="Profile"
        subtitle="Manage your personal information"
        onBackPress={() => router.back()}
        colors={colors}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <Image
            source={{ uri: profileData.avatar }}
            style={styles.avatarContainer}
            defaultSource={require('@/assets/images/icon.png')} // optional fallback
          />

          <Text style={[styles.userName, { color: colors.text }]}>{profileData.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {currentUser.role.toUpperCase()}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: currentUser.status === 'active' ? '#10b98110' : '#ef444410' }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: currentUser.status === 'active' ? '#10b981' : '#ef4444' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: currentUser.status === 'active' ? '#10b981' : '#ef4444' }
            ]}>
              {currentUser.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard title="Articles Read" value="127" color="#10b981" />
          <StatCard title="Favorites" value="34" color="#f59e0b" />
          <StatCard title="Comments" value="89" color="#3b82f6" />
        </View>

        {/* Edit Button */}
        {!isEditing ? (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
          >
            <Edit2 size={18} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
              activeOpacity={0.8}
              disabled={saving}
            >
              <X size={18} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Save size={18} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>

          <InfoCard
            icon={User}
            label="Name"
            value={profileData.name}
            editable
            fieldKey="name"
          />
          <InfoCard
            icon={Mail}
            label="Email"
            value={profileData.email}
            editable
            fieldKey="email"
          />
          <InfoCard
            icon={Phone}
            label="Phone"
            value={profileData.phone}
            editable
            fieldKey="phone"
          />
          <InfoCard
            icon={MapPin}
            label="Location"
            value={profileData.location}
            editable
            fieldKey="location"
          />
          <InfoCard
            icon={Calendar}
            label="Member Since"
            value={profileData.joinDate}
          />
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={[styles.bioCard, { backgroundColor: `${colors.primary}08` }]}>
            {isEditing ? (
              <TextInput
                style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]}
                value={profileData.about}
                onChangeText={(text) => setProfileData({ ...profileData, about: text })}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text style={[styles.bioText, { color: colors.text }]}>
                {profileData.about || 'No bio available'}
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userAvatar: {
    // width: 100,
    // height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 15,
    fontWeight: '600',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  bioCard: {
    padding: 16,
    borderRadius: 16,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
});