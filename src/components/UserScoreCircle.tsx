import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {Colors} from '../theme/tokens';

interface UserScoreCircleProps {
  score: number;
}

const SIZE = 64;
const CENTER = SIZE / 2;
const STROKE_WIDTH = 5;
const RADIUS = CENTER - STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const UserScoreCircle: React.FC<UserScoreCircleProps> = ({score}) => {
  const percentage = Math.round(score * 10);
  const arcColor =
    percentage >= 70
      ? Colors.scoreArcGreen
      : percentage >= 40
      ? Colors.scoreArcYellow
      : Colors.scoreArcRed;

  const strokeDashoffset = CIRCUMFERENCE * (1 - percentage / 100);

  return (
    <View style={styles.wrapper}>
      <View style={styles.circleContainer}>
        <Svg width={SIZE} height={SIZE}>
          {/* Dark background fill + track */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill={Colors.primaryDark}
            stroke={Colors.primaryDark}
            strokeWidth={STROKE_WIDTH}
          />
          {/* Coloured arc — starts from 12 o'clock, fills clockwise */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${CENTER}, ${CENTER}`}
          />
        </Svg>
        {/* Percentage text overlaid on the SVG */}
        <View style={styles.textOverlay}>
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
  circleContainer: {
    width: SIZE,
    height: SIZE,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
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
