import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/tokens';

interface UserScoreCircleProps {
  score: number;
}

const UserScoreCircle: React.FC<UserScoreCircleProps> = ({score}) => {
  const percentage = Math.round(score * 10);
  const borderColor =
    percentage >= 70
      ? Colors.scoreArcGreen
      : percentage >= 40
      ? Colors.scoreArcYellow
      : Colors.scoreArcRed;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, {borderColor}]}>
        <View style={styles.textRow}>
          <Text style={styles.number}>{percentage}</Text>
          <Text style={styles.percent}>%</Text>
        </View>
      </View>
      <Text style={styles.label}>User Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryDark,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  percent: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginTop: 3,
  },
  label: {
    fontSize: 10,
    color: Colors.textOnDark,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default UserScoreCircle;
