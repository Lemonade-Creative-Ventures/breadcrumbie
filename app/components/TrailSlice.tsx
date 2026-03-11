import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { Trail } from '../types';

interface Props {
  trails: Trail[];
  onTrailPress?: (trail: Trail) => void;
}

export default function TrailSlice({ trails, onTrailPress }: Props) {
  const router = useRouter();

  const handlePress = (trail: Trail) => {
    if (onTrailPress) {
      onTrailPress(trail);
    } else {
      router.push(`/trail/${trail.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {trails.map((trail) => (
          <TouchableOpacity
            key={trail.id}
            style={styles.bubble}
            onPress={() => handlePress(trail)}
            activeOpacity={0.75}
          >
            <View style={styles.emojiRing}>
              <Text style={styles.emoji}>{trail.emoji}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>{trail.name}</Text>
            {!trail.isPublic && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockText}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Add trail CTA */}
        <TouchableOpacity
          style={styles.addBubble}
          onPress={() => router.push('/explore')}
          activeOpacity={0.75}
        >
          <View style={styles.addRing}>
            <Text style={styles.addIcon}>＋</Text>
          </View>
          <Text style={styles.name}>Explore</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 4,
  },
  bubble: {
    alignItems: 'center',
    width: 72,
    marginRight: 8,
    position: 'relative',
  },
  emojiRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    width: 68,
  },
  lockBadge: {
    position: 'absolute',
    top: 38,
    right: 4,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  lockText: {
    fontSize: 9,
  },
  addBubble: {
    alignItems: 'center',
    width: 72,
    marginRight: 8,
  },
  addRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  addIcon: {
    fontSize: 22,
    color: Colors.muted,
    fontWeight: '300',
  },
});
