import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Text as RNText, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { Button, Heading, Card } from '../../components/UIComponents';
import { useNavigation, useRoute } from '@react-navigation/native';
import { debounce } from 'lodash';

const { width } = Dimensions.get('window');

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

function ChooseRoleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('User is signed out, navigating to SignIn');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      console.log('Starting sign-out process');
      await signOut(auth);
      console.log('Firebase sign-out complete');
      await AsyncStorage.removeItem('userRole');
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
      console.log('Sign-out process complete');
    }
  };


  const handleNavigate = debounce((targetScreen) => {
    if (!isSigningOut) {
      console.log(`Navigating to: ${targetScreen}`);
      navigation.navigate(targetScreen);
    } else {
      console.log('Navigation blocked due to sign-out in progress');
    }
  }, 300);

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {isSigningOut && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View style={[styles.content, isSigningOut && { opacity: 0.5 }]}>
          <Heading
            text={`Welcome, ${route.params?.name || 'User'}!`}
            size="lg"
            color="#fff"
            style={styles.welcomeText}
          />
          <Text style={styles.subtitle} color="rgba(255, 255, 255, 0.8)">
            Choose your role to continue
          </Text>

          {/* Student Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleNavigate('StudentDashboard')}
            disabled={isSigningOut}
          >
            <Card style={styles.card}>
              <LinearGradient colors={['#ffffff', '#f7f9ff']} style={styles.cardGradient}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={theme.colors.gradient.primary}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="school-outline" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Heading text="I'm a Student" size="md" color="textPrimary" style={styles.cardTitle} />
                <Text style={styles.cardDescription}>
                  Access your courses, assignments, and grades
                </Text>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          {/* Teacher Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleNavigate('TeacherDashboard')}
            disabled={isSigningOut}
          >
            <Card style={styles.card}>
              <LinearGradient colors={['#ffffff', '#f7f9ff']} style={styles.cardGradient}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={theme.colors.gradient.secondary}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="book-outline" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Heading text="I'm a Teacher" size="md" color="textPrimary" style={styles.cardTitle} />
                <Text style={styles.cardDescription}>
                  Manage your classes, create assignments, and grade students
                </Text>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          {/* Sign Out Button */}
          <Button
            title="Sign Out"
            icon="log-out-outline"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
            disabled={isSigningOut}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  card: {
    width: width * 0.85,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  signOutButton: {
    marginTop: theme.spacing.lg,
    minWidth: 150,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default ChooseRoleScreen;