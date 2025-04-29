import React from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';


import { Heading } from './UIComponents';

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

/**
 * @typedef {Object} CustomHeaderProps
 * @property {string} title - Header title
 * @property {Object} navigation - React Navigation object
 * @property {boolean} [showBackButton=true] - Show back button
 * @property {boolean} [showTitle=true] - Show title
 * @property {string} [rightIcon] - Icon name for right button (e.g., 'log-out')
 * @property {string} [developerIcon] - Icon name for developer button
 * @property {Function} [onRightPress] - Callback for right button press
 * @property {Function} [onDeveloperPress] - Callback for developer button press
 * @property {boolean} [preventBack=false] - Prevent hardware back button
 */

/**
 * @param {CustomHeaderProps} props
 */
const CustomHeader = ({ 
  title, 
  navigation, 
  showBackButton = true, 
  showTitle = true, 
  rightIcon = null,
  developerIcon = null,
  onRightPress = null,
  onDeveloperPress = null,
  preventBack = false
}) => {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (preventBack) {
          return true; 
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [preventBack])
  );

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (!preventBack && navigation?.canGoBack?.()) {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        {showTitle && (
          <View style={styles.titleContainer}>
            <Heading text={title} size="lg" color="#fff" />
          </View>
        )}

        <View style={styles.rightContainer}>
          {developerIcon && onDeveloperPress && (
            <TouchableOpacity 
              style={[styles.rightButton, styles.developerButton]} 
              onPress={onDeveloperPress}
            >
              <Ionicons name={developerIcon} size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          {rightIcon && onRightPress && (
            <TouchableOpacity 
              style={styles.rightButton} 
              onPress={() => {
                console.log('Right button pressed, calling onRightPress');
                onRightPress();
              }}
            >
              <Ionicons name={rightIcon} size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 96,
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  developerButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)', 
  },
});

export default CustomHeader;