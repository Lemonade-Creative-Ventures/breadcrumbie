import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useApp } from '../../store/AppContext';
import { AppNotification } from '../../types';
import { formatRelativeTime } from '../../utils/time';

const ICON_MAP: Record<AppNotification['type'], string> = {
  reaction: '❤️',
  comment: '💬',
  invite: '📬',
};

export default function ActivityScreen() {
  const { state, markNotificationRead } = useApp();
  const { notifications } = state;

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotification = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.notifItem, !item.read && styles.notifItemUnread]}
      onPress={() => markNotificationRead(item.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.notifIcon, { backgroundColor: item.read ? Colors.reactionBg : Colors.primaryLight }]}>
        <Text style={styles.notifIconText}>{ICON_MAP[item.type]}</Text>
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifMessage, !item.read && styles.notifMessageUnread]}>
          {item.message}
        </Text>
        <View style={styles.notifMeta}>
          <Text style={styles.notifTrail}>{item.trailEmoji} {item.trailName}</Text>
          <Text style={styles.notifDot}>·</Text>
          <Text style={styles.notifTime}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>Nothing yet</Text>
            <Text style={styles.emptySubtitle}>
              Drop some crumbs! When people react or comment, you'll see it here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  notifItemUnread: {
    backgroundColor: '#FFFBF2',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIconText: {
    fontSize: 20,
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  notifMessageUnread: {
    color: Colors.text,
    fontWeight: '600',
  },
  notifMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  notifTrail: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: '500',
  },
  notifDot: {
    fontSize: 10,
    color: Colors.muted,
  },
  notifTime: {
    fontSize: 12,
    color: Colors.muted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    flexShrink: 0,
  },
  separator: {
    height: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
});
