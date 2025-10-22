import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@hooks/useTheme';
import { useAuth } from '@hooks/useAuth';
import { Card } from '@components/common/Card';
import { Loading } from '@components/common/Loading';
import { newsService } from '@services/newsService';
import { News } from '@/types/news.types';
// import { News } from '@types/news.types';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await newsService.getNews({ limit: 20 });
      console.log(response);
      
      setNews(response.data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const renderNewsItem = ({ item }: { item: News }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/news/${item.id}`)}
      activeOpacity={0.7}
    >
      <Card className="mb-4">
        <Text className="text-lg font-bold mb-2" style={{ color: colors.text }}>
          {item.title}
        </Text>
        <Text className="text-sm mb-3" style={{ color: colors.textSecondary }} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs mr-3" style={{ color: colors.textSecondary }}>
              👁️ {item.views}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              ❤️ {item.likes}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading fullScreen text="Loading news..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Welcome, {user?.name}!
            </Text>
            <Text className="text-base mt-2" style={{ color: colors.textSecondary }}>
              Latest news and updates
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text style={{ color: colors.textSecondary }}>No news available</Text>
          </View>
        }
      />
    </View>
  );
}