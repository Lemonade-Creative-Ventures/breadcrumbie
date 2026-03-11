import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import CrumbCard from '../../components/CrumbCard';
import TrailSlice from '../../components/TrailSlice';
import ShareSheet from '../../components/ShareSheet';
import { useApp } from '../../store/AppContext';
import { Crumb, Trail } from '../../types';

export default function HomeScreen() {
  const { state, fetchTrails, fetchFeed } = useApp();
  const { trails, feed, usingMockData } = state;
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    fetchTrails();
    fetchFeed();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchTrails(), fetchFeed()]);
    setRefreshing(false);
  }, [fetchTrails, fetchFeed]);

  const renderFeedEnd = () => (
    <View style={styles.feedEnd}>
      <Text style={styles.feedEndEmoji}>🎉</Text>
      <Text style={styles.feedEndTitle}>You're all caught up!</Text>
      <Text style={styles.feedEndSubtitle}>
        Drop some crumbs or explore new trails to keep the feed fresh.
      </Text>
      <View style={styles.feedEndButtons}>
        <TouchableOpacity
          style={styles.feedEndBtn}
          onPress={() => setShareVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.feedEndBtnText}>🍞 Drop a Crumb</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.feedEndBtn, styles.feedEndBtnSecondary]}
          onPress={() => router.push('/explore')}
          activeOpacity={0.8}
        >
          <Text style={[styles.feedEndBtnText, styles.feedEndBtnTextSecondary]}>
            🔍 Explore Trails
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* App Header */}
      <View style={styles.appHeader}>
        <Text style={styles.appHeaderLogo}>🍞 breadcrumbie</Text>
        {usingMockData && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>demo mode</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.dropHeaderBtn}
          onPress={() => setShareVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropHeaderBtnText}>+ Drop</Text>
        </TouchableOpacity>
      </View>

      {/* Trail slices */}
      <TrailSlice trails={trails} />

      {/* Feed label */}
      <View style={styles.feedHeader}>
        <Text style={styles.feedHeaderTitle}>Combined Feed</Text>
        <Text style={styles.feedHeaderCount}>{feed.length} crumbs</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Crumb & { trail?: Trail } }) => (
    <CrumbCard crumb={item} showTrailBadge />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={feed.length > 0 ? renderFeedEnd : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌾</Text>
            <Text style={styles.emptyTitle}>No crumbs yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to drop a crumb!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        onSuccess={() => setShareVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  appHeaderLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    flex: 1,
  },
  offlineBadge: {
    backgroundColor: Colors.reactionBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  offlineBadgeText: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
  },
  dropHeaderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dropHeaderBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  feedHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  feedHeaderCount: {
    fontSize: 13,
    color: Colors.muted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
  feedEnd: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 10,
  },
  feedEndEmoji: {
    fontSize: 40,
  },
  feedEndTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  feedEndSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  feedEndButtons: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  feedEndBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  feedEndBtnSecondary: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  feedEndBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  feedEndBtnTextSecondary: {
    color: Colors.text,
  },
});
