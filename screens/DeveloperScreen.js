import React, { useEffect } from 'react';
import { View, Text as RNText, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { Heading } from '../components/UIComponents';


const Text = ({ style, color, children, ...props }) => {
  const textColor = color || theme.colors.text;
  return (
    <RNText 
      style={[{ color: textColor, fontFamily: theme.typography.fontFamily.regular }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const DeveloperScreen = () => {
  const navigation = useNavigation();
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const ankitScale = useSharedValue(1);
  const utkarshScale = useSharedValue(1);


  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const ankitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ankitScale.value }],
  }));
  const utkarshAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: utkarshScale.value }],
  }));

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardTranslateY.value = withTiming(0, { duration: 600 });
  }, [cardOpacity, cardTranslateY]);

  const handlePressIn = (scale) => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = (scale) => {
    scale.value = withSpring(1);
  };

  const handleContactPress = () => {
    Linking.openURL('mailto:ankit.kapilvatu@gmail.com');
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary || ['#4c669f', '#3b5998', '#192f6a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Animated.View style={[styles.content, cardAnimatedStyle]}>
          <Heading text="Developer Information" size="xl" color="#fff" style={styles.title} />
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Our Developers</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => handlePressIn(ankitScale)}
              onPressOut={() => handlePressOut(ankitScale)}
            >
              <Animated.View style={[styles.developer, ankitAnimatedStyle]}>
                <View style={styles.developerHeader}>
                  <Ionicons name="code-slash" size={24} color="#ffffff" style={styles.developerIcon} />
                  <Text style={styles.developerName}>Ankit Gupta</Text>
                </View>
                <Text style={styles.developerDescription}>
                  A passionate tech enthusiast from Kapilvastu.
                </Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => handlePressIn(utkarshScale)}
              onPressOut={() => handlePressOut(utkarshScale)}
            >
              <Animated.View style={[styles.developer, utkarshAnimatedStyle]}>
                <View style={styles.developerHeader}>
                  <Ionicons name="bulb-outline" size={24} color="#ffffff" style={styles.developerIcon} />
                  <Text style={styles.developerName}>Utkarsh Lal Karn</Text>
                </View>
                <Text style={styles.developerDescription}>
                  A great planner from Janakpur.
                </Text>
              </Animated.View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <Text style={styles.text}>App Version: 1.0.0</Text>
            <Text style={styles.text}>Contact: ankit.kapilvatu@gmail.com</Text>
            <Text style={styles.description}>
              This app connects students and teachers for seamless tutoring experiences.
            </Text>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
              <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.lg || 24,
    left: theme.spacing.md || 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg || 24,
    paddingTop: (theme.spacing.lg || 24) + 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.lg || 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.lg || 16,
    padding: theme.spacing.lg || 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...theme.shadows.large || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    width: '95%',
    maxWidth: 450,
    marginVertical: theme.spacing.md || 16, 
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg || 20,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.md || 16,
  },
  developer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md || 12,
    padding: theme.spacing.md || 16,
    marginVertical: theme.spacing.sm || 8,
    width: '100%',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs || 4,
  },
  developerIcon: {
    marginRight: theme.spacing.sm || 8,
  },
  developerName: {
    fontSize: theme.typography.fontSize.lg || 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  developerDescription: {
    fontSize: theme.typography.fontSize.sm || 14,
    color: '#e6e6e6',
    textAlign: 'left',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '80%',
    marginVertical: theme.spacing.md || 16,
  },
  text: {
    fontSize: theme.typography.fontSize.md || 16,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: theme.spacing.sm || 8,
  },
  description: {
    fontSize: theme.typography.fontSize.sm || 14,
    color: '#e6e6e6',
    textAlign: 'center',
    marginVertical: theme.spacing.sm || 8,
    lineHeight: 22,
  },
  contactButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.sm || 8,
    paddingVertical: theme.spacing.sm || 8,
    paddingHorizontal: theme.spacing.md || 16,
    marginTop: theme.spacing.md || 16,
  },
  contactButtonText: {
    fontSize: theme.typography.fontSize.md || 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DeveloperScreen;