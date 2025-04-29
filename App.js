import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import theme from './theme';
import CustomTabBar from './components/CustomTabBar';
import CustomHeader from './components/CustomHeader';
import { Button as CustomButton } from './components/UIComponents';
import SignUpScreen from './screens/auth/signUpScreen';
import StudentRegisterScreen from './screens/student/studentRegister/StudentRegisterScreen';
import SignInScreen from './screens/auth/signinscreen';
import StudentDashboard from './screens/student/studentProfile/StudentDashboard';
import StudentsRequest from './screens/student/studentList/studentRequests';
import TeacherDashboard from './screens/teacher/teacherProfile/TeacherDashboard';
import TeacherRequest from './screens/teacher/teacherList/teacherRequests';
import TeacherRegisterScreen from './screens/teacher/teacherRegister/TeacherRegisterScreen';
import LandingPage from './initApp';
import ChooseRoleScreen from './screens/role/ChooseRoleScreen';
import StudentDetailsScreen from './screens/student/studentList/StudentDetailsScreen';
import TeacherDetailsScreen from './screens/teacher/teacherList/TeacherDetailsScreen';
import DeveloperScreen from './screens/DeveloperScreen';
import { auth } from './firebase';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get('window');

function TutorResultsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Tutor Results Screen</Text>
      <CustomButton mode="contained" onPress={() => navigation.goBack()}>
        Back
      </CustomButton>
    </View>
  );
}

function SearchTutorScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.searchLabel}>Search for Tutors</Text>
      <CustomButton
        mode="contained"
        onPress={() => navigation.navigate('TutorResults')}
        style={styles.button}
      >
        Search
      </CustomButton>
    </View>
  );
}

function StudentScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sregistration"
        component={StudentRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetails"
        component={StudentDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TeacherScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tregistration"
        component={TeacherRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TeacherRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeacherRequestList"
        component={TeacherRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function StudentsRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentsRequestList"
        component={StudentsRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetails"
        component={StudentDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function StudentTabScreen({ navigation }) {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="TeacherRequest"
        component={TeacherRequestStack}
        options={{
          tabBarLabel: 'Find Teacher',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentRegister"
        component={StudentScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TeacherTabScreen({ navigation }) {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="StudentsRequest"
        component={StudentsRequestStack}
        options={{
          tabBarLabel: 'Find Students',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherRegister"
        component={TeacherScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const handleSignOut = async (navigation) => {
  try {
    await signOut(auth);
    console.log('Signed out successfully');
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  } catch (error) {
    console.error('Error signing out:', error);
    Alert.alert('Error', 'Failed to sign out: ' + error.message);
  }
};

function App() {
  enableScreens();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? currentUser.email : 'No user');
      setUser(currentUser);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.card,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.secondary,
          },
        }}
        linking={{
          prefixes: [],
          config: {
            screens: {
              LandingPage: 'landing',
              SignIn: 'signin',
              Register: 'register',
              ChooseRole: 'choose-role',
              StudentDashboard: 'student-dashboard',
              TeacherDashboard: 'teacher-dashboard',
              Developer: 'developer',
              TutorResults: 'tutor-results',
            },
          },
        }}
        fallback={<Text>Loading...</Text>}
        onError={(error) => {
          console.error('Navigation error:', error);
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="ChooseRole"
                component={ChooseRoleScreen}
                options={{ headerShown: false }}
                initialParams={{
                  email: user.email,
                  name: user.displayName || 'User',
                }}
              />
              <Stack.Screen
                name="StudentDashboard"
                component={StudentTabScreen}
                options={({ navigation }) => ({
                  header: (props) => (
                    <CustomHeader
                      title="Student Dashboard"
                      rightIcon="log-out-outline"
                      developerIcon="code"
                      preventBack={true}
                      showBackButton={false}
                      showTitle={false}
                      navigation={navigation}
                      onRightPress={() => {
                        Alert.alert(
                          'Sign Out',
                          'Are you sure you want to sign out?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Sign Out',
                              onPress: () => handleSignOut(navigation),
                              style: 'destructive',
                            },
                          ]
                        );
                      }}
                      onDeveloperPress={() => {
                        console.log('Navigating to Developer screen');
                        navigation.navigate('Developer');
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="TeacherDashboard"
                component={TeacherTabScreen}
                options={({ navigation }) => ({
                  header: (props) => (
                    <CustomHeader
                      title="Teacher Dashboard"
                      rightIcon="log-out-outline"
                      developerIcon="code"
                      preventBack={true}
                      showBackButton={false}
                      showTitle={false}
                      navigation={navigation}
                      onRightPress={() => {
                        Alert.alert(
                          'Sign Out',
                          'Are you sure you want to sign out?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Sign Out',
                              onPress: () => handleSignOut(navigation),
                              style: 'destructive',
                            },
                          ]
                        );
                      }}
                      onDeveloperPress={() => {
                        console.log('Navigating to Developer screen');
                        navigation.navigate('Developer');
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="Developer"
                component={DeveloperScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TutorResults"
                component={TutorResultsScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TutorResults"
                component={TutorResultsScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchLabel: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default App;