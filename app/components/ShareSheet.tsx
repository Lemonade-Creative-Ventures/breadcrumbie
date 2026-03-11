import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
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
import Colors from '../constants/Colors';
import { useApp } from '../store/AppContext';
import { UrlMetadata } from '../types';
import { isValidUrl } from '../utils/url';

interface Props {
  visible: boolean;
  initialUrl?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'input' | 'loading' | 'preview';

export default function ShareSheet({ visible, initialUrl = '', onClose, onSuccess }: Props) {
  const { state, fetchMetadata, addCrumb, addToBreadBox } = useApp();
  const { trails } = state;

  const [url, setUrl] = useState(initialUrl);
  const [step, setStep] = useState<Step>('input');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleUrlSubmit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      Alert.alert('Invalid URL', 'Please enter a valid web address.');
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
      Alert.alert('Pick a Trail', 'Select which trail to drop your crumb into.');
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
        { text: 'Great!', onPress: handleReset },
      ]);
      onSuccess?.();
    } catch {
      Alert.alert('Error', 'Could not drop crumb. Please try again.');
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
      Alert.alert('Error', 'Could not save. Please try again.');
    }
  };

  const handleReset = () => {
    setUrl('');
    setStep('input');
    setMetadata(null);
    setSelectedTrailId(null);
    setCaption('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleReset}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🍞 Drop a Crumb</Text>
            <TouchableOpacity onPress={handleReset} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* ── Step: URL Input ── */}
            {(step === 'input' || step === 'loading') && (
              <View style={styles.inputSection}>
                <Text style={styles.sectionLabel}>Paste a link</Text>
                <View style={styles.urlInputWrapper}>
                  <Text style={styles.urlIcon}>🔗</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.urlInput}
                    value={url}
                    onChangeText={setUrl}
                    placeholder="https://example.com/something-cool"
                    placeholderTextColor={Colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="go"
                    onSubmitEditing={handleUrlSubmit}
                    editable={step !== 'loading'}
                  />
                  {url.length > 0 && step !== 'loading' && (
                    <TouchableOpacity onPress={() => setUrl('')}>
                      <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {step === 'loading' ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.primary} />
                    <Text style={styles.loadingText}>Fetching link preview…</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.previewBtn, !url.trim() && styles.previewBtnDisabled]}
                    onPress={handleUrlSubmit}
                    disabled={!url.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.previewBtnText}>Preview Link →</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    💡 Copy a link from any app, then paste it here. Your crumb is anonymous — no one knows it's from you.
                  </Text>
                </View>
              </View>
            )}

            {/* ── Step: Preview + Trail selector ── */}
            {step === 'preview' && metadata && (
              <View style={styles.previewSection}>

                {/* Link preview card */}
                <View style={styles.previewCard}>
                  {metadata.thumbnail ? (
                    <Image
                      source={{ uri: metadata.thumbnail }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.previewImagePlaceholder}>
                      <Text style={styles.previewImagePlaceholderText}>🔗</Text>
                    </View>
                  )}
                  <View style={styles.previewCardContent}>
                    <Text style={styles.previewDomain}>{metadata.domain}</Text>
                    <Text style={styles.previewTitle} numberOfLines={2}>{metadata.title}</Text>
                    {!!metadata.description && (
                      <Text style={styles.previewDesc} numberOfLines={2}>{metadata.description}</Text>
                    )}
                  </View>
                  <TouchableOpacity style={styles.editUrlBtn} onPress={() => setStep('input')}>
                    <Text style={styles.editUrlText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {/* Caption */}
                <View style={styles.captionSection}>
                  <Text style={styles.sectionLabel}>Add a caption (optional)</Text>
                  <TextInput
                    style={styles.captionInput}
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="What do you think about this? (anonymous)"
                    placeholderTextColor={Colors.muted}
                    multiline
                    maxLength={280}
                  />
                  <Text style={styles.charCount}>{caption.length}/280</Text>
                </View>

                {/* Trail selector */}
                <View style={styles.trailSection}>
                  <Text style={styles.sectionLabel}>Drop into a Trail</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trailScroll}>
                    {trails.map(trail => (
                      <TouchableOpacity
                        key={trail.id}
                        style={[
                          styles.trailChip,
                          selectedTrailId === trail.id && styles.trailChipSelected,
                        ]}
                        onPress={() => setSelectedTrailId(trail.id)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.trailChipEmoji}>{trail.emoji}</Text>
                        <Text style={[
                          styles.trailChipText,
                          selectedTrailId === trail.id && styles.trailChipTextSelected,
                        ]}>
                          {trail.name}
                        </Text>
                        {!trail.isPublic && <Text style={styles.trailLock}>🔒</Text>}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.dropBtn, (!selectedTrailId || submitting) && styles.dropBtnDisabled]}
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
                    style={styles.saveBtn}
                    onPress={handleSaveToBreadBox}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.saveBtnText}>📦 Save to Bread Box</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.anonymousNote}>
                  🕵️ Your crumb is shared anonymously. No one can see it's from you.
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  kav: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.reactionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },

  // Input step
  inputSection: {
    padding: 20,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  urlInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  urlIcon: {
    fontSize: 18,
  },
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.muted,
  },
  previewBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  previewBtnDisabled: {
    opacity: 0.4,
  },
  previewBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  tipBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
  },
  tipText: {
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 19,
  },

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
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.borderLight,
  },
  previewImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImagePlaceholderText: {
    fontSize: 36,
  },
  previewCardContent: {
    padding: 14,
    gap: 5,
  },
  previewDomain: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
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
  editUrlBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  editUrlText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Caption
  captionSection: {
    gap: 8,
  },
  captionInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'right',
  },

  // Trail chips
  trailSection: {
    gap: 10,
  },
  trailScroll: {
    marginHorizontal: -4,
  },
  trailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  trailChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  trailChipEmoji: {
    fontSize: 16,
  },
  trailChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  trailChipTextSelected: {
    color: Colors.white,
  },
  trailLock: {
    fontSize: 10,
  },

  // Actions
  actions: {
    gap: 10,
  },
  dropBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  dropBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  dropBtnEmoji: {
    fontSize: 20,
  },
  dropBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  anonymousNote: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 17,
    paddingBottom: 20,
  },
});
