import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useApp } from '../../store/AppContext';
import { UrlMetadata } from '../../types';
import { isValidUrl } from '../../utils/url';

type Step = 'input' | 'loading' | 'preview';

export default function ShareScreen() {
  const { state, fetchMetadata, addCrumb, addToBreadBox } = useApp();
  const { trails } = state;

  const [url, setUrl] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (step === 'input') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);

  const handleUrlSubmit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      Alert.alert('Invalid URL', 'Please enter a full web address, e.g. https://example.com');
      return;
    }
    setStep('loading');
    try {
      const meta = await fetchMetadata(trimmed);
      setMetadata(meta);
      setStep('preview');
    } catch {
      const domain = trimmed.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      setMetadata({ url: trimmed, title: trimmed, description: '', thumbnail: null, domain, favicon: null });
      setStep('preview');
    }
  };

  const handleDropCrumb = async () => {
    if (!metadata) return;
    if (!selectedTrailId) {
      Alert.alert('Pick a Trail', 'Select a trail to drop your crumb into.');
      return;
    }
    setSubmitting(true);
    try {
      await addCrumb(selectedTrailId, {
        url: metadata.url,
        title: metadata.title || metadata.url,
        description: caption.trim() || metadata.description,
        thumbnail: metadata.thumbnail,
      });
      Alert.alert('Crumb Dropped! 🍞', 'Your crumb is live in the trail.', [
        { text: 'Drop another', onPress: handleReset },
        { text: 'Done', style: 'cancel' },
      ]);
    } catch {
      Alert.alert(
        'Could not drop crumb',
        'Check your connection and try again. Your crumb was not saved.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveToBreadBox = async () => {
    if (!metadata) return;
    try {
      await addToBreadBox({
        url: metadata.url,
        title: metadata.title || metadata.url,
        description: metadata.description,
        thumbnail: metadata.thumbnail,
      });
      Alert.alert('Saved to Bread Box 📦', 'Find it later in your profile.');
    } catch {
      Alert.alert('Error', 'Could not save. Try again.');
    }
  };

  const handleReset = () => {
    setUrl('');
    setStep('input');
    setMetadata(null);
    setSelectedTrailId(null);
    setCaption('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍞 Drop a Crumb</Text>
          <Text style={styles.headerSubtitle}>Share something you found online</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── URL input step ── */}
          {(step === 'input' || step === 'loading') && (
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Paste a link</Text>

              <View style={[styles.urlBox, step === 'loading' && styles.urlBoxLoading]}>
                <Text style={styles.urlBoxIcon}>🔗</Text>
                <TextInput
                  ref={inputRef}
                  style={styles.urlInput}
                  value={url}
                  onChangeText={setUrl}
                  placeholder="https://cool-article.com/…"
                  placeholderTextColor={Colors.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  returnKeyType="go"
                  onSubmitEditing={handleUrlSubmit}
                  editable={step !== 'loading'}
                  selectTextOnFocus
                />
                {url.length > 0 && step !== 'loading' && (
                  <TouchableOpacity onPress={() => setUrl('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {step === 'loading' ? (
                <View style={styles.loadingCard}>
                  <ActivityIndicator color={Colors.primary} size="small" />
                  <Text style={styles.loadingText}>Fetching link preview…</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.primaryBtn, !url.trim() && styles.btnDisabled]}
                  onPress={handleUrlSubmit}
                  disabled={!url.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Preview Link →</Text>
                </TouchableOpacity>
              )}

              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>💡 How it works</Text>
                <Text style={styles.tipText}>
                  Copy any link from Safari, Chrome, or another app — then paste it here to create a crumb. Your crumb is {' '}
                  <Text style={styles.tipBold}>completely anonymous</Text>.
                </Text>
              </View>

              {/* Quick trail previews */}
              <View style={styles.trailsPreviewSection}>
                <Text style={styles.sectionLabel}>Your Trails</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trailsPreviewScroll}>
                  {trails.slice(0, 5).map(trail => (
                    <View key={trail.id} style={styles.miniTrailChip}>
                      <Text style={styles.miniTrailEmoji}>{trail.emoji}</Text>
                      <Text style={styles.miniTrailName}>{trail.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* ── Preview step ── */}
          {step === 'preview' && metadata && (
            <View style={styles.previewSection}>

              {/* Preview card */}
              <Text style={styles.sectionLabel}>Link Preview</Text>
              <View style={styles.previewCard}>
                {metadata.thumbnail ? (
                  <Image
                    source={{ uri: metadata.thumbnail }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.previewImagePlaceholder}>
                    <Text style={styles.previewImagePlaceholderIcon}>🔗</Text>
                    <Text style={styles.previewImagePlaceholderDomain}>{metadata.domain}</Text>
                  </View>
                )}
                <View style={styles.previewCardBody}>
                  <Text style={styles.previewDomain}>{metadata.domain}</Text>
                  <Text style={styles.previewTitle} numberOfLines={2}>{metadata.title}</Text>
                  {!!metadata.description && (
                    <Text style={styles.previewDesc} numberOfLines={2}>{metadata.description}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.changeUrlBtn}
                  onPress={handleReset}
                >
                  <Text style={styles.changeUrlText}>↩ Change link</Text>
                </TouchableOpacity>
              </View>

              {/* Caption */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Add a note (optional)</Text>
                <TextInput
                  style={styles.captionInput}
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="What do you think? Your note is anonymous…"
                  placeholderTextColor={Colors.muted}
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{caption.length} / 280</Text>
              </View>

              {/* Trail selector */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Drop into which trail?</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.trailChipScroll}
                  contentContainerStyle={styles.trailChipContent}
                >
                  {trails.map(trail => {
                    const selected = selectedTrailId === trail.id;
                    return (
                      <TouchableOpacity
                        key={trail.id}
                        style={[styles.trailChip, selected && styles.trailChipSelected]}
                        onPress={() => setSelectedTrailId(selected ? null : trail.id)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.trailChipEmoji}>{trail.emoji}</Text>
                        <Text style={[styles.trailChipText, selected && styles.trailChipTextSel]}>
                          {trail.name}
                        </Text>
                        {selected && <Text style={styles.trailChipCheck}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {!selectedTrailId && (
                  <Text style={styles.trailHint}>← Scroll to pick a trail</Text>
                )}
              </View>

              {/* CTA buttons */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={[
                    styles.dropBtn,
                    (!selectedTrailId || submitting) && styles.btnDisabled,
                  ]}
                  onPress={handleDropCrumb}
                  disabled={!selectedTrailId || submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <>
                      <Text style={styles.dropBtnEmoji}>🍞</Text>
                      <Text style={styles.dropBtnText}>Drop Crumb</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.breadboxBtn}
                  onPress={handleSaveToBreadBox}
                  activeOpacity={0.75}
                >
                  <Text style={styles.breadboxBtnText}>📦 Save to Bread Box instead</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.anonNote}>
                <Text style={styles.anonNoteText}>
                  🕵️ Anonymous — no one can see this came from you
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 3,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Input step
  inputSection: {
    padding: 20,
    gap: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  urlBoxLoading: {
    borderColor: Colors.primary,
    opacity: 0.7,
  },
  urlBoxIcon: { fontSize: 20 },
  urlInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 13,
    color: Colors.muted,
    padding: 4,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: {
    opacity: 0.38,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  tipCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  tipText: {
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 19,
  },
  tipBold: {
    fontWeight: '700',
  },
  trailsPreviewSection: { gap: 10 },
  trailsPreviewScroll: { marginHorizontal: -4 },
  miniTrailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniTrailEmoji: { fontSize: 14 },
  miniTrailName: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  // Preview step
  previewSection: {
    padding: 20,
    gap: 20,
  },
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 170,
    backgroundColor: Colors.borderLight,
  },
  previewImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  previewImagePlaceholderIcon: { fontSize: 32 },
  previewImagePlaceholderDomain: { fontSize: 13, color: Colors.primaryDark, fontWeight: '600' },
  previewCardBody: {
    padding: 14,
    gap: 4,
  },
  previewDomain: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },
  previewDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  changeUrlBtn: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  changeUrlText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '500',
  },
  section: { gap: 10 },
  captionInput: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 88,
  },
  charCount: {
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'right',
  },
  trailChipScroll: { marginHorizontal: -4 },
  trailChipContent: { paddingHorizontal: 4, gap: 8 },
  trailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  trailChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  trailChipEmoji: { fontSize: 16 },
  trailChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  trailChipTextSel: { color: Colors.white },
  trailChipCheck: { fontSize: 13, color: Colors.white, fontWeight: '700' },
  trailHint: { fontSize: 12, color: Colors.muted, paddingLeft: 4 },
  dropBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  dropBtnEmoji: { fontSize: 20 },
  dropBtnText: { color: Colors.white, fontSize: 17, fontWeight: '900' },
  breadboxBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  breadboxBtnText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  anonNote: {
    backgroundColor: Colors.reactionBg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  anonNoteText: { fontSize: 12, color: Colors.muted, lineHeight: 17 },
});
