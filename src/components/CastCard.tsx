import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {CastMember} from '../types/tmdb';
import {PROFILE_BASE_URL} from '../api/movies';
import {Colors, FontSize, Spacing} from '../theme/tokens';

interface CastCardProps {
  member: CastMember;
}

const CastCard: React.FC<CastCardProps> = React.memo(({member}) => {
  return (
    <View style={styles.card}>
      {member.profile_path ? (
        <Image
          source={{uri: `${PROFILE_BASE_URL}${member.profile_path}`}}
          style={styles.photo}
        />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={styles.photoPlaceholderText}>
            {member.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {member.name}
      </Text>
      <Text style={styles.character} numberOfLines={2}>
        {member.character}
      </Text>
    </View>
  );
});

CastCard.displayName = 'CastCard';

const styles = StyleSheet.create({
  card: {
    width: 100,
    marginHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.sm,
  },
  photoPlaceholder: {
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  name: {
    fontSize: FontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  character: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default CastCard;
