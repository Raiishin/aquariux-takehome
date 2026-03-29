import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { CastMember } from '../types/tmdb';
import { PROFILE_BASE_URL } from '../api/movies';
import { Colors, FontSize, Radius, Spacing } from '../theme/tokens';

interface CastCardProps {
  member: CastMember;
}

const CastCard: React.FC<CastCardProps> = React.memo(({ member }) => {
  return (
    <View style={styles.card}>
      <View style={styles.photoWrapper}>
        {member.profile_path ? (
          <Image
            source={{ uri: `${PROFILE_BASE_URL}${member.profile_path}` }}
            style={styles.photo}
          />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={styles.photoPlaceholderText}>
              {member.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={2}>
          {member.name}
        </Text>
        <Text style={styles.character} numberOfLines={2}>
          {member.character}
        </Text>
      </View>
    </View>
  );
});

CastCard.displayName = 'CastCard';

const styles = StyleSheet.create({
  card: {
    width: 138,
    marginHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  photoWrapper: {
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    overflow: 'hidden',
  },
  photo: {
    width: 138,
    height: 175,
  },
  photoPlaceholder: {
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  textBlock: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  character: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default CastCard;
