import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Search, Filter, Heart, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 6;

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  categoryId: string;
  authorId: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

// Sample categories
const categories = [
  { id: 'all', name: 'All' },
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Sports' },
  { id: '3', name: 'Business' },
  { id: '4', name: 'Entertainment' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with actual API call
  const mockNews: News[] = [
    {
      id: "1",
      title: "Breaking: New Technology Advances",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Revolutionary AI breakthrough changes everything",
      image: "https://picsum.photos/400/300?random=1",
      categoryId: "1",
      authorId: "1",
      publishedAt: "2024-10-22T14:00:00.000Z",
      createdAt: "2024-10-22T13:00:00.000Z",
      updatedAt: "2024-10-22T13:00:00.000Z",
      views: 1245,
      likes: 89
    },
    {
      id: "2",
      title: "Sports Championship Finals This Weekend",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Championship finals set for this weekend",
      image: "https://picsum.photos/400/300?random=2",
      categoryId: "2",
      authorId: "1",
      publishedAt: "2024-10-21T14:00:00.000Z",
      createdAt: "2024-10-21T13:00:00.000Z",
      updatedAt: "2024-10-21T13:00:00.000Z",
      views: 987,
      likes: 45
    },
    {
      id: "3",
      title: "Global Markets Show Strong Recovery",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Economic indicators point to sustained growth",
      image: "https://picsum.photos/400/300?random=3",
      categoryId: "3",
      authorId: "2",
      publishedAt: "2024-10-20T14:00:00.000Z",
      createdAt: "2024-10-20T13:00:00.000Z",
      updatedAt: "2024-10-20T13:00:00.000Z",
      views: 756,
      likes: 34
    },
    {
      id: "4",
      title: "New Movie Breaks Box Office Records",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Hollywood blockbuster exceeds all expectations",
      image: "https://picsum.photos/400/300?random=4",
      categoryId: "4",
      authorId: "2",
      publishedAt: "2024-10-19T14:00:00.000Z",
      createdAt: "2024-10-19T13:00:00.000Z",
      updatedAt: "2024-10-19T13:00:00.000Z",
      views: 2103,
      likes: 156
    },
    {
      id: "5",
      title: "Climate Summit Reaches Historic Agreement",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "World leaders commit to ambitious climate goals",
      image: "https://picsum.photos/400/300?random=5",
      categoryId: "1",
      authorId: "3",
      publishedAt: "2024-10-18T14:00:00.000Z",
      createdAt: "2024-10-18T13:00:00.000Z",
      updatedAt: "2024-10-18T13:00:00.000Z",
      views: 1876,
      likes: 203
    },
    {
      id: "6",
      title: "Tech Giant Unveils Revolutionary Product",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "New gadget promises to transform daily life",
      image: "https://picsum.photos/400/300?random=6",
      categoryId: "1",
      authorId: "1",
      publishedAt: "2024-10-17T14:00:00.000Z",
      createdAt: "2024-10-17T13:00:00.000Z",
      updatedAt: "2024-10-17T13:00:00.000Z",
      views: 3421,
      likes: 287
    },
    {
      id: "7",
      title: "Olympic Athlete Sets New World Record",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Historic performance stuns sports world",
      image: "https://picsum.photos/400/300?random=7",
      categoryId: "2",
      authorId: "2",
      publishedAt: "2024-10-16T14:00:00.000Z",
      createdAt: "2024-10-16T13:00:00.000Z",
      updatedAt: "2024-10-16T13:00:00.000Z",
      views: 1654,
      likes: 98
    },
    {
      id: "8",
      title: "Startup Valued at $1 Billion After Funding",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt: "Tech unicorn emerges from latest funding round",
      image: "https://picsum.photos/400/300?random=8",
      categoryId: "3",
      authorId: "3",
      publishedAt: "2024-10-15T14:00:00.000Z",
      createdAt: "2024-10-15T13:00:00.000Z",
      updatedAt: "2024-10-15T13:00:00.000Z",
      views: 892,
      likes: 67
    },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [searchQuery, selectedCategory, newsList]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setNewsList(mockNews);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const filterNews = () => {
    let filtered = [...newsList];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.username, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: `${colors.primary}08` }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search news..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id
                    ? colors.primary
                    : `${colors.primary}10`,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id
                      ? '#FFFFFF'
                      : colors.text,
                    fontWeight: selectedCategory === category.id ? '700' : '500',
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          Showing {currentNews.length} of {filteredNews.length} articles
        </Text>

        {/* News List */}
        {currentNews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No articles found
            </Text>
          </View>
        ) : (
          <View style={styles.newsList}>
            {currentNews.map((news) => (
              <TouchableOpacity
                key={news.id}
                style={[styles.newsCard, { 
                  backgroundColor: colors.card || colors.background,
                  shadowColor: colors.text,
                }]}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: news.image }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
                <View style={styles.newsContent}>
                  <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>
                    {news.title}
                  </Text>
                  <Text style={[styles.newsExcerpt, { color: colors.textSecondary }]} numberOfLines={2}>
                    {news.excerpt}
                  </Text>
                  
                  <View style={styles.newsFooter}>
                    <View style={styles.newsStats}>
                      <View style={styles.statItem}>
                        <Eye size={14} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                          {formatNumber(news.views)}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Heart size={14} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                          {formatNumber(news.likes)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dateContainer}>
                      <Calendar size={12} color={colors.textSecondary} />
                      <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                        {formatDate(news.publishedAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                {
                  backgroundColor: currentPage === 1 ? `${colors.primary}10` : colors.primary,
                },
              ]}
              onPress={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={currentPage === 1 ? colors.textSecondary : '#FFFFFF'} />
            </TouchableOpacity>

            <View style={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <TouchableOpacity
                  key={page}
                  style={[
                    styles.pageNumber,
                    {
                      backgroundColor: currentPage === page ? colors.primary : `${colors.primary}10`,
                    },
                  ]}
                  onPress={() => goToPage(page)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pageNumberText,
                      {
                        color: currentPage === page ? '#FFFFFF' : colors.text,
                        fontWeight: currentPage === page ? '700' : '500',
                      },
                    ]}
                  >
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                {
                  backgroundColor: currentPage === totalPages ? `${colors.primary}10` : colors.primary,
                },
              ]}
              onPress={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              activeOpacity={0.7}
            >
              <ChevronRight
                size={20}
                color={currentPage === totalPages ? colors.textSecondary : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  resultsText: {
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 13,
  },
  newsList: {
    paddingHorizontal: 24,
  },
  newsCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberText: {
    fontSize: 14,
  },
});