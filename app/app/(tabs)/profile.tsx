import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import BreadBox from '../../components/BreadBox';
import { useApp } from '../../store/AppContext';
import { Trail } from '../../types';

export default function ProfileScreen() {
  const { state, fetchBreadBox } = useApp();
  const { trails, breadbox, notifications } = state;
  const router = useRouter();
  const [breadboxVisible, setBreadboxVisible] = useState(false);

  useEffect(() => {
    fetchBreadBox();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderTrailRow = ({ item }: { item: Trail }) => (
    <TouchableOpacity
      style={styles.trailRow}
      onPress={() => router.push(`/trail/${item.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.trailRowLeft}>
        <View style={styles.trailRowEmoji}>
          <Text style={styles.trailRowEmojiText}>{item.emoji}</Text>
        </View>
        <View>
          <Text style={styles.trailRowName}>{item.name}</Text>
          <Text style={styles.trailRowMeta}>
            {item.isPublic ? '🌍 Public' : '🔒 Invite only'} · {item.memberCount} members
          </Text>
        </View>
      </View>
      <Text style={styles.trailRowArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={trails}
        keyExtractor={t => t.id}
        renderItem={renderTrailRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={
          <>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🍞</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Anonymous Crumber</Text>
                <Text style={styles.profileHandle}>@you · breadcrumbie</Text>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{trails.length}</Text>
                <Text style={styles.statLabel}>Trails</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{breadbox.length}</Text>
                <Text style={styles.statLabel}>Bread Box</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
            </View>

            {/* Bread Box access */}
            <TouchableOpacity
              style={styles.breadboxCard}
              onPress={() => setBreadboxVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.breadboxCardLeft}>
                <Text style={styles.breadboxCardEmoji}>📦</Text>
                <View>
                  <Text style={styles.breadboxCardTitle}>Bread Box</Text>
                  <Text style={styles.breadboxCardSubtitle}>
                    {breadbox.length > 0
                      ? `${breadbox.length} saved link${breadbox.length === 1 ? '' : 's'}`
                      : 'Save links for later'}
                  </Text>
                </View>
              </View>
              {breadbox.length > 0 && (
                <View style={styles.breadboxBadge}>
                  <Text style={styles.breadboxBadgeText}>{breadbox.length}</Text>
                </View>
              )}
              <Text style={styles.breadboxArrow}>›</Text>
            </TouchableOpacity>

            {/* My Trails header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Trails</Text>
              <TouchableOpacity
                onPress={() => router.push('/explore')}
                style={styles.sectionAction}
              >
                <Text style={styles.sectionActionText}>+ Join more</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Settings</Text>
            {[
              { icon: '🔔', label: 'Notifications' },
              { icon: '🔒', label: 'Privacy' },
              { icon: '🎨', label: 'Appearance' },
              { icon: '❓', label: 'Help & Feedback' },
              { icon: 'ℹ️', label: 'About Breadcrumbie' },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.settingsRow}
                onPress={() => Alert.alert(item.label, 'Coming soon!')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsIcon}>{item.icon}</Text>
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Text style={styles.settingsArrow}>›</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.versionRow}>
              <Text style={styles.versionText}>Breadcrumbie v1.0 · Made with 🍞</Text>
            </View>
          </View>
        }
      />

      <BreadBox
        visible={breadboxVisible}
        items={breadbox}
        onClose={() => setBreadboxVisible(false)}
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  profileHandle: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.muted,
    marginTop: 3,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  breadboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  breadboxCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  breadboxCardEmoji: { fontSize: 26 },
  breadboxCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  breadboxCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  breadboxBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  breadboxBadgeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  breadboxArrow: {
    fontSize: 22,
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionAction: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sectionActionText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  trailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  trailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  trailRowEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailRowEmojiText: { fontSize: 22 },
  trailRowName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  trailRowMeta: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  trailRowArrow: {
    fontSize: 22,
    color: Colors.muted,
  },
  settingsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 16,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  settingsIcon: { fontSize: 18 },
  settingsLabel: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '500' },
  settingsArrow: { fontSize: 18, color: Colors.muted },
  versionRow: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  versionText: { fontSize: 12, color: Colors.muted },
});
