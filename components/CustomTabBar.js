import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;
  const indicatorPosition = useSharedValue(state.index * tabWidth);
  
  React.useEffect(() => {
    indicatorPosition.value = withTiming(state.index * tabWidth, { 
      duration: 300 
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.tabBar}
      >
        {/* Animated indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.indicatorGradient}
          />
        </Animated.View>
        
     
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          
          const iconName = options.tabBarIcon ? 
            options.tabBarIcon({ focused: isFocused, color: '', size: 24 }).props.name : 
            'help-circle';
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabItem 
                icon={iconName} 
                label={label} 
                isFocused={isFocused} 
              />
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};
const TabItem = ({ icon, label, isFocused }) => {
  const scale = useSharedValue(isFocused ? 1 : 0.85);
  

  React.useEffect(() => {
    scale.value = withTiming(isFocused ? 1 : 0.85, { duration: 200 });
  }, [isFocused]);
  
  const progress = useDerivedValue(() => {
    return isFocused ? 1 : 0;
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.textSecondary, theme.colors.primary]
    );
    
    return {
      color,
      transform: [{ scale: scale.value }],
    };
  });
  
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.textSecondary, theme.colors.primary]
    );
    
    return {
      color,
      transform: [{ scale: scale.value }],
      opacity: isFocused ? 1 : 0.7,
    };
  });

  return (
    <View style={styles.tabItem}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </Animated.View>
      <Animated.Text style={[styles.tabLabel, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: width / 2, 
    height: 3,
    zIndex: 10,
  },
  indicatorGradient: {
    width: '50%',
    height: '100%',
    alignSelf: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 4,
  },
});

export default CustomTabBar; 