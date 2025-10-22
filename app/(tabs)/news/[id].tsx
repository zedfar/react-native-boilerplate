import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@hooks/useTheme';
import { Loading } from '@components/common/Loading';
import { newsService } from '@services/newsService';
import { News } from '@/types/news.types';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadNews();
      incrementViews();
    }
  }, [id]);

  const loadNews = async () => {
    try {
      const data = await newsService.getNewsById(id as string);
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await newsService.incrementViews(id as string);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async () => {
    if (!news) return;
    
    try {
      const response = await newsService.likeNews(news.id);
      setNews({ ...news, likes: response.likes });
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking news:', error);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading article..." />;
  }

  if (!news) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.textSecondary }}>Article not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Image
        source={{ uri: news.image }}
        className="w-full h-64"
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
          {news.title}
        </Text>

        <View className="flex-row items-center mb-4">
          <View className="flex-1">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {new Date(news.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Text className="text-sm mr-1">👁️</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {news.views}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleLike}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="text-sm mr-1">{liked ? '❤️' : '🤍'}</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {news.likes}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border-t border-b py-4 mb-4" style={{ borderColor: colors.border }}>
          <Text className="text-base leading-relaxed" style={{ color: colors.text }}>
            {news.content}
          </Text>
        </View>

        {news.author && (
          <View className="flex-row items-center p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center mr-3">
              <Text className="text-xl">✍️</Text>
            </View>
            <View>
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                {news.author.name}
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Author
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}