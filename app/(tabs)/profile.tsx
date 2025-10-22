import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, theme, themeMode, setThemeMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('auto');
    } else {
      setThemeMode('light');
    }
  };

  const getThemeButtonTitle = () => {
    if (themeMode === 'light') return '☀️ Light Mode';
    if (themeMode === 'dark') return '🌙 Dark Mode';
    return '🔄 Auto Mode';
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="p-4"
    >
      <Card className="mb-4 items-center">
        <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
          {user?.name}
        </Text>
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          {user?.email}
        </Text>
        <View className="mt-3 px-3 py-1 rounded-full bg-primary-100">
          <Text className="text-xs font-semibold text-primary-700">
            {user?.role?.toUpperCase()}
          </Text>
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
          Settings
        </Text>

        <View className="mb-3">
          <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            Theme
          </Text>
          <Button
            title={getThemeButtonTitle()}
            variant="outline"
            onPress={toggleTheme}
            fullWidth
          />
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
          Account Information
        </Text>
        
        <View className="mb-3">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Member Since
          </Text>
          <Text className="text-base mt-1" style={{ color: colors.text }}>
            {new Date(user?.createdAt || '').toLocaleDateString()}
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Account Type
          </Text>
          <Text className="text-base mt-1" style={{ color: colors.text }}>
            {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
          </Text>
        </View>
      </Card>

      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        fullWidth
      />
    </ScrollView>
  );
}