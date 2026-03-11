import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Pressable,
} from 'react-native';
import Colors from '../constants/Colors';
import { Crumb } from '../types';
import { formatRelativeTime } from '../utils/time';
import { useApp } from '../store/AppContext';

const REACTIONS = ['❤️', '😂', '🔥'] as const;

interface Props {
  crumb: Crumb & { trail?: { name: string; emoji: string } };
  showTrailBadge?: boolean;
}

export default function CrumbCard({ crumb, showTrailBadge }: Props) {
  const { reactToCrumb } = useApp();
  const [localReacted, setLocalReacted] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState({ ...crumb.reactions });

  const handleOpen = () => {
    const url = crumb.url.startsWith('http') ? crumb.url : `https://${crumb.url}`;
    Linking.openURL(url).catch(() => Alert.alert('Cannot open URL', crumb.url));
  };

  const handleReact = (emoji: string) => {
    const prev = localReacted;
    if (prev === emoji) {
      setLocalReacted(null);
      setLocalReactions(r => ({ ...r, [emoji]: Math.max(0, (r[emoji] ?? 0) - 1) }));
    } else {
      if (prev) {
        setLocalReactions(r => ({ ...r, [prev]: Math.max(0, (r[prev] ?? 0) - 1) }));
      }
      setLocalReacted(emoji);
      setLocalReactions(r => ({ ...r, [emoji]: (r[emoji] ?? 0) + 1 }));
      reactToCrumb(crumb.id, emoji).catch(() => {});
    }
  };

  const totalReactions = Object.values(localReactions).reduce((sum, n) => sum + n, 0);

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      {crumb.thumbnail ? (
        <Pressable onPress={handleOpen} style={styles.thumbnailWrapper}>
          <Image
            source={{ uri: crumb.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {crumb.savedByCount > 1 && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>🔁 Saved by {crumb.savedByCount} people</Text>
            </View>
          )}
        </Pressable>
      ) : crumb.savedByCount > 1 ? (
        <View style={styles.savedBadgeNoThumb}>
          <Text style={styles.savedBadgeNoThumbText}>🔁 Saved by {crumb.savedByCount} people</Text>
        </View>
      ) : null}

      {/* Content */}
      <View style={styles.content}>
        {/* Trail badge */}
        {showTrailBadge && crumb.trail && (
          <View style={styles.trailBadge}>
            <Text style={styles.trailBadgeText}>
              {crumb.trail.emoji} {crumb.trail.name}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{crumb.title}</Text>

        {/* Description */}
        {!!crumb.description && (
          <Text style={styles.description} numberOfLines={2}>{crumb.description}</Text>
        )}

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.domainPill}>
            <Text style={styles.domainText}>{crumb.domain}</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.timeText}>{formatRelativeTime(crumb.createdAt)}</Text>
        </View>
      </View>

      {/* Footer: reactions + open */}
      <View style={styles.footer}>
        <View style={styles.reactionRow}>
          {REACTIONS.map(emoji => {
            const count = localReactions[emoji] ?? 0;
            const active = localReacted === emoji;
            return (
              <TouchableOpacity
                key={emoji}
                style={[styles.reactionBtn, active && styles.reactionBtnActive]}
                onPress={() => handleReact(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {count > 0 && (
                  <Text style={[styles.reactionCount, active && styles.reactionCountActive]}>
                    {count}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}

          {crumb.commentCount > 0 && (
            <View style={styles.commentChip}>
              <Text style={styles.commentText}>💬 {crumb.commentCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.openBtn} onPress={handleOpen} activeOpacity={0.8}>
          <Text style={styles.openBtnText}>Open ↗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.borderLight,
  },
  savedBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  savedBadgeNoThumb: {
    backgroundColor: Colors.badgeBg,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  savedBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  savedBadgeNoThumbText: {
    color: Colors.badgeText,
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 14,
    paddingBottom: 8,
  },
  trailBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  trailBadgeText: {
    color: Colors.primaryDark,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  domainPill: {
    backgroundColor: Colors.reactionBg,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  domainText: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: Colors.muted,
  },
  timeText: {
    fontSize: 11,
    color: Colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.reactionBg,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 3,
  },
  reactionBtnActive: {
    backgroundColor: Colors.reactionActiveBg,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: '600',
  },
  reactionCountActive: {
    color: Colors.primaryDark,
  },
  commentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  commentText: {
    fontSize: 12,
    color: Colors.muted,
  },
  openBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  openBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
