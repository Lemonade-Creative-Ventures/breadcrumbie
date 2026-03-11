import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { useApp } from '../../store/AppContext';
import { Trail } from '../../types';

const EMOJIS = ['🔥', '🌊', '🎯', '💡', '🎨', '📚', '🚀', '🌈', '⚡', '🎭', '🌍', '🍀'];

export default function ExploreScreen() {
  const { state, createTrail } = useApp();
  const { trails } = state;
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🔥');
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [creating, setCreating] = useState(false);

  const filtered = trails.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.emoji.includes(search)
  );

  const handleCreate = async () => {
    if (!newName.trim()) {
      Alert.alert('Name required', 'Give your trail a name.');
      return;
    }
    setCreating(true);
    try {
      await createTrail({ name: newName.trim(), emoji: newEmoji, isPublic: newIsPublic });
      setShowCreate(false);
      setNewName('');
      setNewEmoji('🔥');
      setNewIsPublic(true);
      Alert.alert('Trail Created! 🎉', `${newEmoji} ${newName.trim()} is ready.`);
    } finally {
      setCreating(false);
    }
  };

  const renderTrailCard = ({ item }: { item: Trail }) => (
    <TouchableOpacity
      style={styles.trailCard}
      onPress={() => router.push(`/trail/${item.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.trailEmojiWrapper}>
        <Text style={styles.trailCardEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.trailCardContent}>
        <View style={styles.trailCardTop}>
          <Text style={styles.trailCardName}>{item.name}</Text>
          {!item.isPublic && (
            <View style={styles.inviteBadge}>
              <Text style={styles.inviteBadgeText}>Invite only</Text>
            </View>
          )}
        </View>
        <Text style={styles.trailMeta}>
          👥 {item.memberCount} member{item.memberCount !== 1 ? 's' : ''}
          {item.isPublic ? '  ·  Public' : ''}
        </Text>
      </View>
      <Text style={styles.trailArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaViewNative style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Trails</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search trails…"
          placeholderTextColor={Colors.muted}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Create CTA */}
      <TouchableOpacity
        style={styles.createCta}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.85}
      >
        <View style={styles.createCtaLeft}>
          <Text style={styles.createCtaPlus}>＋</Text>
          <View>
            <Text style={styles.createCtaTitle}>Create a Community Trail</Text>
            <Text style={styles.createCtaSubtitle}>Gather your people around a topic</Text>
          </View>
        </View>
        <Text style={styles.createCtaArrow}>→</Text>
      </TouchableOpacity>

      {/* Trail list */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        renderItem={renderTrailCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No trails found for "{search}"</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {/* Create Trail Modal */}
      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Trail</Text>
            <TouchableOpacity onPress={() => setShowCreate(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            {/* Emoji picker */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Pick an emoji</Text>
              <View style={styles.emojiGrid}>
                {EMOJIS.map(e => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.emojiBtn, newEmoji === e && styles.emojiBtnSelected]}
                    onPress={() => setNewEmoji(e)}
                  >
                    <Text style={styles.emojiBtnText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Name */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Trail name</Text>
              <TextInput
                style={styles.modalInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. Cool Architecture"
                placeholderTextColor={Colors.muted}
                maxLength={40}
                autoFocus
              />
            </View>

            {/* Visibility */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Visibility</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[styles.visBtn, newIsPublic && styles.visBtnSelected]}
                  onPress={() => setNewIsPublic(true)}
                >
                  <Text style={[styles.visBtnText, newIsPublic && styles.visBtnTextSelected]}>
                    🌍 Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.visBtn, !newIsPublic && styles.visBtnSelected]}
                  onPress={() => setNewIsPublic(false)}
                >
                  <Text style={[styles.visBtnText, !newIsPublic && styles.visBtnTextSelected]}>
                    🔒 Invite only
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preview */}
            {newName.length > 0 && (
              <View style={styles.previewBox}>
                <Text style={styles.previewBoxLabel}>Preview</Text>
                <View style={styles.previewTrail}>
                  <Text style={styles.previewEmoji}>{newEmoji}</Text>
                  <Text style={styles.previewName}>{newName}</Text>
                  <Text style={styles.previewVis}>{newIsPublic ? '🌍 Public' : '🔒 Invite only'}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.createBtn, (!newName.trim() || creating) && styles.createBtnDisabled]}
              onPress={handleCreate}
              disabled={!newName.trim() || creating}
              activeOpacity={0.85}
            >
              <Text style={styles.createBtnText}>
                {creating ? 'Creating…' : `Create ${newEmoji} ${newName || 'Trail'}`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaViewNative>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearIcon: { fontSize: 13, color: Colors.muted, padding: 2 },
  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createCtaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  createCtaPlus: { fontSize: 28, color: Colors.white, fontWeight: '300' },
  createCtaTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  createCtaSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  createCtaArrow: { fontSize: 22, color: Colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  trailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trailEmojiWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailCardEmoji: { fontSize: 24 },
  trailCardContent: { flex: 1 },
  trailCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  trailCardName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  inviteBadge: {
    backgroundColor: Colors.inviteOnly,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  inviteBadgeText: { fontSize: 10, color: Colors.inviteOnlyText, fontWeight: '600' },
  trailMeta: { fontSize: 12, color: Colors.muted },
  trailArrow: { fontSize: 22, color: Colors.muted },
  empty: { alignItems: 'center', paddingTop: 40, gap: 8 },
  emptyEmoji: { fontSize: 36 },
  emptyText: { fontSize: 14, color: Colors.muted },
  // Modal
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.reactionBg, alignItems: 'center', justifyContent: 'center',
  },
  modalCloseBtnText: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  modalScroll: { padding: 20 },
  modalSection: { marginBottom: 24 },
  modalLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.muted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  emojiBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  emojiBtnText: { fontSize: 24 },
  modalInput: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    padding: 14, fontSize: 15, color: Colors.text,
  },
  visibilityRow: { flexDirection: 'row', gap: 10 },
  visBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 12,
    alignItems: 'center', backgroundColor: Colors.card,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  visBtnSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  visBtnText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  visBtnTextSelected: { color: Colors.primaryDark },
  previewBox: {
    backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: 14, marginBottom: 24,
  },
  previewBoxLabel: { fontSize: 11, fontWeight: '700', color: Colors.primaryDark, marginBottom: 8 },
  previewTrail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewEmoji: { fontSize: 24 },
  previewName: { fontSize: 16, fontWeight: '700', color: Colors.text, flex: 1 },
  previewVis: { fontSize: 12, color: Colors.muted },
  createBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 32,
  },
  createBtnDisabled: { opacity: 0.4 },
  createBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
});
