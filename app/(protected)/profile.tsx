import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    bio: 'Passionate about technology and innovation. Always learning something new.',
    joinDate: 'January 2024',
  });


  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const InfoCard = ({ icon: Icon, label, value, editable = false }: any) => (
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
            onChangeText={(text) => setProfileData({ ...profileData, [label.toLowerCase()]: text })}
            placeholder={label}
            placeholderTextColor={colors.textSecondary}
          />
        ) : (
          <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
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
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{profileData.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {user?.role || 'User'}
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
            >
              <X size={18} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Save size={18} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>

          <InfoCard icon={User} label="Name" value={profileData.name} editable />
          <InfoCard icon={Mail} label="Email" value={profileData.email} editable />
          <InfoCard icon={Phone} label="Phone" value={profileData.phone} editable />
          <InfoCard icon={MapPin} label="Location" value={profileData.location} editable />
          <InfoCard icon={Calendar} label="Member Since" value={profileData.joinDate} />
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={[styles.bioCard, { backgroundColor: `${colors.primary}08` }]}>
            {isEditing ? (
              <TextInput
                style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text style={[styles.bioText, { color: colors.text }]}>{profileData.bio}</Text>
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
  userName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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