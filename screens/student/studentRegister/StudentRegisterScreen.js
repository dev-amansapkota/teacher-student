import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text as RNText, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Image,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import { createTodoTask } from '../../../firestore/create';
import { auth } from '../../../firebase';
import { pickImage, uploadToCloudinary } from '../../../utils/cloudinary';
import theme from '../../../theme';
import { Button, Heading, Card, Input } from '../../../components/UIComponents';

const { width } = Dimensions.get('window');


const nepal_districts = {
  "Province 1": ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
  "Madhesh Province": ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
  "Bagmati Province": ["Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"],
  "Gandaki Province": ["Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"],
  "Lumbini Province": ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi", "Palpa", "Pyuthan", "Rolpa", "Rukum (East)", "Rupandehi"],
  "Karnali Province": ["Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum (West)", "Salyan", "Surkhet"],
  "Sudurpashchim Province": ["Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"]
};


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

function StudentRegisterScreen({ navigation, route }) {
  const studentData = route.params?.studentData;
  const isEditing = !!studentData;


  const [name, setName] = useState(studentData?.name || '');
  const [province, setProvince] = useState(studentData?.province || null);
  const [district, setDistrict] = useState(studentData?.district || null);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [provinces] = useState(Object.keys(nepal_districts).map(prov => ({
    label: prov,
    value: prov
  })));
  const [districts, setDistricts] = useState([]);
  const [specificLocation, setSpecificLocation] = useState(studentData?.specificLocation || '');
  const [grade, setGrade] = useState(studentData?.grade || '');
  const [subject, setSubject] = useState(studentData?.subject || '');
  const [phoneNumber, setPhoneNumber] = useState(studentData?.phoneNumber || '');
  const [photoUri, setPhotoUri] = useState(studentData?.photoURL || null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [salary, setSalary] = useState(studentData?.salary || '');
  const [teachingHours, setTeachingHours] = useState(studentData?.teachingHours || '');

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

 
  console.log('nepal_districts keys:', Object.keys(nepal_districts));


  useEffect(() => {
    console.log('useEffect triggered - Province:', province, 'isEditing:', isEditing);
    let selectedProvince = province;
    

    if (isEditing && !province && studentData?.province) {
      selectedProvince = studentData.province;
      setProvince(selectedProvince);
    }

    if (selectedProvince && nepal_districts[selectedProvince]) {
      const districtOptions = nepal_districts[selectedProvince].map(dist => ({
        label: dist,
        value: dist
      }));
      console.log('Setting districts:', districtOptions);
      setDistricts(districtOptions);
      if (district && !nepal_districts[selectedProvince].includes(district)) {
        console.log('Resetting invalid district:', district);
        setDistrict(null);
      }
    } else {
      console.log('Clearing districts - No valid province');
      setDistricts([]);
      setDistrict(null);
    }
  }, [province, isEditing, studentData]);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhotoUri(uri);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!grade.trim()) newErrors.grade = "Grade is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!province) newErrors.province = "Province is required";
    if (!district) newErrors.district = "District is required";
    if (salary && isNaN(salary)) newErrors.salary = "Salary must be a number";
    if (teachingHours && isNaN(teachingHours)) newErrors.teachingHours = "Teaching hours must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to create a profile');
        setUploading(false);
        return;
      }

      let photoURL = photoUri;
      if (photoUri && !photoUri.startsWith('http')) {
        photoURL = await uploadToCloudinary(photoUri);
      } else if (studentData?.photoURL) {
        photoURL = studentData.photoURL;
      }

      const studentProfileData = {
        name: name.trim(),
        grade: grade.trim(),
        subject: subject.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL: photoURL || '',
        province,
        district,
        specificLocation: specificLocation.trim(),
        salary: salary ? parseFloat(salary) : null,
        teachingHours: teachingHours ? parseInt(teachingHours) : null,
        userId: user.uid,
        createdAt: new Date(),
      };

      await createTodoTask(studentProfileData);
      setUploading(false);
      alert(`Student profile ${isEditing ? 'updated' : 'created'} successfully!`);
      navigation.navigate('StudentDashboard');
    } catch (error) {
      setUploading(false);
      alert(`Error ${isEditing ? 'updating' : 'creating'} student profile: ${error.message}`);
    }
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const renderPhotoUpload = () => (
    <TouchableOpacity style={styles.photoUploadContainer} onPress={handleImagePick}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="camera" size={30} color={theme.colors.primary} />
          <Text style={styles.photoPlaceholderText}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Heading text={isEditing ? "Edit Student Profile" : "Create Student Profile"} size="lg" color="#fff" />
    </View>
  );

  const renderForm = () => (
    <Card style={styles.formCard}>
      <View style={styles.formSection}>
        <Heading text="Personal Information" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          icon="person-outline"
          error={errors.name}
          style={styles.input}
        />
        
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          icon="call-outline"
          error={errors.phoneNumber}
          style={styles.input}
        />
        
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Profile Photo (Optional)</Text>
          {renderPhotoUpload()}
        </View>
      </View>
      
      <View style={styles.formSection}>
        <Heading text="Education Details" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Input
          label="Grade/Class"
          value={grade}
          onChangeText={setGrade}
          placeholder="Enter your grade or class"
          icon="school-outline"
          error={errors.grade}
          style={styles.input}
        />
        
        <Input
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject you need help with"
          icon="book-outline"
          error={errors.subject}
          style={styles.input}
        />

        <Input
          label="Salary to Provide (NPR, Optional)"
          value={salary}
          onChangeText={setSalary}
          placeholder="Enter amount to give"
          keyboardType="numeric"
          icon="cash-outline"
          error={errors.salary}
          style={styles.input}
        />

        <Input
          label="Teaching Hours per Week (Optional)"
          value={teachingHours}
          onChangeText={setTeachingHours}
          placeholder="Enter hours per week"
          keyboardType="numeric"
          icon="time-outline"
          error={errors.teachingHours}
          style={styles.input}
        />
      </View>
      
      <View style={styles.formSection}>
        <Heading text="Location" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Text style={styles.dropdownLabel}>Province</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={provinceOpen}
            value={province}
            items={provinces}
            setOpen={(open) => {
              console.log('Province dropdown toggled:', open);
              setProvinceOpen(open);
            }}
            setValue={(val) => {
              console.log('Province selected:', val);
              setProvince(val);
            }}
            placeholder="Select province"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            placeholderStyle={styles.dropdownPlaceholder}
            zIndex={10000}
            zIndexInverse={2000}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select Province"
            modalContentContainerStyle={styles.modalContentContainer}
          />
          {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
        </View>
        
        <Text style={styles.dropdownLabel}>District</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={districtOpen}
            value={district}
            items={districts}
            setOpen={(open) => {
              console.log('District dropdown toggled:', open);
              setDistrictOpen(open);
            }}
            setValue={(val) => {
              console.log('District selected:', val);
              setDistrict(val);
            }}
            placeholder="Select district"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            placeholderStyle={styles.dropdownPlaceholder}
            zIndex={5000}
            zIndexInverse={2500}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select District"
            modalContentContainerStyle={styles.modalContentContainer}
            disabled={districts.length === 0}
          />
          {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
        </View>
        
        <Input
          label="Specific Location (Optional)"
          value={specificLocation}
          onChangeText={setSpecificLocation}
          placeholder="Enter specific location"
          icon="location-outline"
          style={styles.input}
        />
      </View>
      
      <Animated.View style={[styles.submitButtonContainer, animatedButtonStyle]}>
        <Button
          title={uploading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Profile" : "Create Profile")}
          onPress={handleSubmit}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          variant="primary"
          icon={uploading ? null : "checkmark-circle"}
          loading={uploading}
          style={styles.submitButton}
        />
      </Animated.View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {renderHeader()}
          {renderForm()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.lg,
  },
  formCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownContainerStyle: {
    backgroundColor: '#fff',
    borderColor: theme.colors.border,
    marginTop: 2,
  },
  dropdown: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  dropdownPlaceholder: {
    color: theme.colors.placeholder,
    fontFamily: theme.typography.fontFamily.regular,
  },
  photoSection: {
    marginTop: theme.spacing.sm,
  },
  photoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.medium,
  },
  photoUploadContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  submitButtonContainer: {
    marginTop: theme.spacing.md,
  },
  submitButton: {
    paddingVertical: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  modalContentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '80%',
  },
});

export default StudentRegisterScreen;