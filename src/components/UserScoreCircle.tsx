import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/tokens';

interface UserScoreCircleProps {
  score: number;
}

const SIZE = 58;
const HALF = SIZE / 2;
const INNER = 44;

const UserScoreCircle: React.FC<UserScoreCircleProps> = ({score}) => {
  const percentage = Math.round(score * 10);
  const arcColor =
    percentage >= 70
      ? Colors.scoreArcGreen
      : percentage >= 40
      ? Colors.scoreArcYellow
      : Colors.scoreArcRed;

  // Two-half rotation technique:
  // Right half container clips the right side of a full circle.
  // The circle inside rotates around its own center, which coincides with the
  // outer circle's center — so no custom transformOrigin needed.
  const rightDeg = percentage <= 50 ? percentage * 3.6 : 180;
  const leftDeg = percentage > 50 ? (percentage - 50) * 3.6 : 0;
  const leftColor = percentage > 50 ? arcColor : Colors.primaryDark;

  return (
    <View style={styles.wrapper}>
      <View style={styles.outerCircle}>
        {/* Right half — rotates to fill 0–50% */}
        <View style={styles.rightHalfContainer}>
          <View
            style={[
              styles.halfCircle,
              {backgroundColor: arcColor, right: 0},
              {transform: [{rotate: `${rightDeg}deg`}]},
            ]}
          />
        </View>
        {/* Left half — rotates to fill 50–100% */}
        <View style={styles.leftHalfContainer}>
          <View
            style={[
              styles.halfCircle,
              {backgroundColor: leftColor, left: 0},
              {transform: [{rotate: `${leftDeg}deg`}]},
            ]}
          />
        </View>
        {/* Inner circle creates the donut effect */}
        <View style={styles.innerCircle}>
          <View style={styles.textRow}>
            <Text style={styles.number}>{percentage}</Text>
            <Text style={styles.percent}>%</Text>
          </View>
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
  outerCircle: {
    width: SIZE,
    height: SIZE,
    borderRadius: HALF,
    backgroundColor: Colors.primaryDark,
    overflow: 'hidden',
  },
  rightHalfContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: HALF,
    height: SIZE,
    overflow: 'hidden',
  },
  leftHalfContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: HALF,
    height: SIZE,
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: HALF,
  },
  innerCircle: {
    position: 'absolute',
    top: (SIZE - INNER) / 2,
    left: (SIZE - INNER) / 2,
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: Colors.primaryDark,
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
