import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  variant?: 'cosmic' | 'aurora' | 'sunset' | 'ocean';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  children, 
  variant = 'cosmic' 
}) => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const createAnimation = (animatedValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createAnimation(animatedValue1, 8000);
    const animation2 = createAnimation(animatedValue2, 12000);
    const animation3 = createAnimation(animatedValue3, 15000);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [animatedValue1, animatedValue2, animatedValue3]);

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'aurora':
        return ["#4facfe", "#00f2fe", "#43e97b"] as const;
      case 'sunset':
        return ["#fa709a", "#fee140", "#ffeaa7"] as const;
      case 'ocean':
        return ["#2196F3", "#21CBF3", "#4ECDC4"] as const;
      default:
        return ["#667eea", "#764ba2", "#f093fb"] as const;
    }
  };

  const getReversedGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'aurora':
        return ["#43e97b", "#00f2fe", "#4facfe"] as const;
      case 'sunset':
        return ["#ffeaa7", "#fee140", "#fa709a"] as const;
      case 'ocean':
        return ["#4ECDC4", "#21CBF3", "#2196F3"] as const;
      default:
        return ["#f093fb", "#764ba2", "#667eea"] as const;
    }
  };

  const getSlicedGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'aurora':
        return ["#00f2fe", "#43e97b"] as const;
      case 'sunset':
        return ["#fee140", "#ffeaa7"] as const;
      case 'ocean':
        return ["#21CBF3", "#4ECDC4"] as const;
      default:
        return ["#764ba2", "#f093fb"] as const;
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={colors.gradient.background}
          style={styles.staticBackground}
        />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  const translateX1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width * 0.5],
  });

  const translateY1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.3, height * 0.3],
  });

  const translateX2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.3, -width * 0.3],
  });

  const translateY2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.2, -height * 0.2],
  });

  const translateX3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.4],
  });

  const translateY3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.4, -height * 0.1],
  });

  const opacity1 = animatedValue1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  const opacity2 = animatedValue2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  const opacity3 = animatedValue3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.9, 0.4],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.staticBackground}
      />
      
      <Animated.View
        style={[
          styles.floatingOrb,
          styles.orb1,
          {
            transform: [
              { translateX: translateX1 },
              { translateY: translateY1 },
            ],
            opacity: opacity1,
          },
        ]}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingOrb,
          styles.orb2,
          {
            transform: [
              { translateX: translateX2 },
              { translateY: translateY2 },
            ],
            opacity: opacity2,
          },
        ]}
      >
        <LinearGradient
          colors={getReversedGradientColors()}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingOrb,
          styles.orb3,
          {
            transform: [
              { translateX: translateX3 },
              { translateY: translateY3 },
            ],
            opacity: opacity3,
          },
        ]}
      >
        <LinearGradient
          colors={getSlicedGradientColors()}
          style={styles.orbGradient}
        />
      </Animated.View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  staticBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orb1: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.1,
    left: width * 0.1,
  },
  orb2: {
    width: width * 0.6,
    height: width * 0.6,
    top: height * 0.4,
    right: width * 0.1,
  },
  orb3: {
    width: width * 0.7,
    height: width * 0.7,
    bottom: height * 0.2,
    left: width * 0.2,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 9999,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default AnimatedBackground;