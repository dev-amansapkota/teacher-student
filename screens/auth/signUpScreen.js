import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import theme from '../../theme';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(height * 0.2)).current;
  const inputScale = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.spring(inputScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const onSignUpPress = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = cred.user;


      await updateProfile(user, { displayName: displayName.trim() });

      await sendEmailVerification(user);

  
      await signOut(auth);

  
      alert(
        'Account created! A verification email has been sent to your inbox. ' +
        'Please verify your email before signing in.'
      )
      setDisplayName('');
      setEmail('');
      setPassword('');

  
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (err) {
      console.error('Sign-up error:', err);
      let errorMessage = 'An error occurred during sign-up.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in or use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = err.message;
      }
      alert(errorMessage);
      setPassword('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backgroundPattern} pointerEvents="none">
          {[...Array(20)].map((_, i) => (
            <View key={i} style={styles.patternDot} />
          ))}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideUpAnim },
                    { scale: inputScale }
                  ]
                }
              ]}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our community of learners</Text>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.linksContainer}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate('SignIn')}
                >
                  <Text style={styles.linkText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPress={onSignUpPress}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={loading}
                  style={styles.button}
                >
                  <LinearGradient
                    colors={[theme.colors.secondary, theme.colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? 'Creating Account…' : 'Sign Up'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: 0.1
  },
  patternDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', margin: 10 },
  formContainer: { width: width * 0.9, padding: 20, alignItems: 'center', alignSelf: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10, letterSpacing: 0.5 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    marginBottom: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  icon: { marginRight: 10 },
  eyeIcon: { marginLeft: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, height: '100%' },
  linksContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  linkButton: { padding: 5 },
  linkText: { color: '#ffffff', fontSize: 14 },
  button: {
    width: width * 0.85,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20
  },
  buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 }
});