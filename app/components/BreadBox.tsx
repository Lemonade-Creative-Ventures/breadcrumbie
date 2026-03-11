import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import { BreadBoxItem } from '../types';
import { formatRelativeTime } from '../utils/time';

interface Props {
  visible: boolean;
  items: BreadBoxItem[];
  onClose: () => void;
}

export default function BreadBox({ visible, items, onClose }: Props) {
  const handleOpen = (item: BreadBoxItem) => {
    const url = item.url.startsWith('http') ? item.url : `https://${item.url}`;
    Linking.openURL(url).catch(() => Alert.alert('Cannot open URL'));
  };

  const renderItem = ({ item }: { item: BreadBoxItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleOpen(item)}
      activeOpacity={0.75}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Text style={styles.thumbPlaceholderText}>📎</Text>
        </View>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.itemMeta}>
          <View style={styles.domainPill}>
            <Text style={styles.domainText}>{item.domain}</Text>
          </View>
          <Text style={styles.timeText}>{formatRelativeTime(item.savedAt)}</Text>
        </View>
      </View>
      <Text style={styles.openArrow}>↗</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📦</Text>
          <View>
            <Text style={styles.headerTitle}>Bread Box</Text>
            <Text style={styles.headerSubtitle}>
              {items.length === 0 ? 'Nothing saved yet' : `${items.length} saved link${items.length === 1 ? '' : 's'}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Your Bread Box is empty</Text>
            <Text style={styles.emptySubtitle}>
              When you save links for later, they'll show up here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 1,
  },
  closeBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  thumbPlaceholderText: {
    fontSize: 22,
  },
  itemContent: {
    flex: 1,
    gap: 6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 19,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainPill: {
    backgroundColor: Colors.reactionBg,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  domainText: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    color: Colors.muted,
  },
  openArrow: {
    fontSize: 18,
    color: Colors.muted,
  },
  separator: {
    height: 10,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
