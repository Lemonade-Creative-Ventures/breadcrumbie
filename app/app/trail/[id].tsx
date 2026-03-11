import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Colors from '../../constants/Colors';
import CrumbCard from '../../components/CrumbCard';
import ShareSheet from '../../components/ShareSheet';
import { useApp } from '../../store/AppContext';
import { Crumb } from '../../types';

export default function TrailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, fetchTrailCrumbs, getTrailById } = useApp();
  const router = useRouter();

  const trail = getTrailById(id);
  const crumbs = state.trailCrumbs[id] ?? [];

  const [refreshing, setRefreshing] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    if (id) fetchTrailCrumbs(id);
  }, [id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrailCrumbs(id);
    setRefreshing(false);
  }, [id]);

  if (!trail) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={styles.notFoundText}>Trail not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Crumb }) => (
    <CrumbCard crumb={{ ...item, trail }} showTrailBadge={false} />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerEmoji}>{trail.emoji}</Text>
              <Text style={styles.headerName}>{trail.name}</Text>
            </View>
          ),
        }}
      />

      <FlatList
        data={crumbs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.trailHeader}>
            <View style={styles.trailEmojiLarge}>
              <Text style={styles.trailEmojiLargeText}>{trail.emoji}</Text>
            </View>
            <Text style={styles.trailName}>{trail.name}</Text>
            <View style={styles.trailMetaRow}>
              <View style={[styles.trailBadge, trail.isPublic ? styles.trailBadgePublic : styles.trailBadgePrivate]}>
                <Text style={[styles.trailBadgeText, trail.isPublic ? styles.trailBadgeTextPublic : styles.trailBadgeTextPrivate]}>
                  {trail.isPublic ? '🌍 Public' : '🔒 Invite only'}
                </Text>
              </View>
              <View style={styles.membersBadge}>
                <Text style={styles.membersBadgeText}>👥 {trail.memberCount} members</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dropBtn}
              onPress={() => setShareVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.dropBtnEmoji}>🍞</Text>
              <Text style={styles.dropBtnText}>Drop a Crumb here</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌾</Text>
            <Text style={styles.emptyTitle}>No crumbs yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to drop something interesting!</Text>
            <TouchableOpacity
              style={styles.emptyDropBtn}
              onPress={() => setShareVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyDropBtnText}>🍞 Drop the first Crumb</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          crumbs.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>You're all caught up in {trail.emoji} {trail.name} 🎉</Text>
            </View>
          ) : null
        }
      />

      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        onSuccess={() => {
          setShareVisible(false);
          fetchTrailCrumbs(id);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: { fontSize: 20 },
  headerName: { fontSize: 17, fontWeight: '700', color: Colors.text },
  listContent: {
    paddingBottom: 40,
  },
  trailHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 10,
    marginBottom: 12,
  },
  trailEmojiLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  trailEmojiLargeText: { fontSize: 36 },
  trailName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
  },
  trailMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trailBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trailBadgePublic: { backgroundColor: '#E8F8EE' },
  trailBadgePrivate: { backgroundColor: Colors.inviteOnly },
  trailBadgeText: { fontSize: 12, fontWeight: '600' },
  trailBadgeTextPublic: { color: '#1D7A3E' },
  trailBadgeTextPrivate: { color: Colors.inviteOnlyText },
  membersBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.reactionBg,
  },
  membersBadgeText: { fontSize: 12, color: Colors.muted, fontWeight: '500' },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dropBtnEmoji: { fontSize: 18 },
  dropBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 12,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 20 },
  emptyDropBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
    marginTop: 4,
  },
  emptyDropBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: { fontSize: 14, color: Colors.muted, textAlign: 'center' },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundEmoji: { fontSize: 48 },
  notFoundText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  backBtnText: { color: Colors.white, fontWeight: '700' },
});
