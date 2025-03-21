import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User profile interface
interface UserProfile {
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  allergies: string;
  medications: string;
  conditions: string;
  emergencyContact: string;
  profilePicture: string | null;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  language: string;
}

// Default profile
const defaultProfile: UserProfile = {
  name: '',
  age: '',
  gender: '',
  bloodType: '',
  allergies: '',
  medications: '',
  conditions: '',
  emergencyContact: '',
  profilePicture: null,
  notificationsEnabled: true,
  darkModeEnabled: true,
  language: 'English'
};

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile from storage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        } else {
          // First time user - prompt to create profile
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile to storage
  const saveProfile = async () => {
    // Basic validation
    if (!userProfile.name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      setIsEditing(false);
      Alert.alert('Success', 'Your profile has been saved');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save your profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Pick an image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserProfile({...userProfile, profilePicture: result.assets[0].uri});
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setUserProfile({...userProfile, darkModeEnabled: !userProfile.darkModeEnabled});
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setUserProfile({...userProfile, notificationsEnabled: !userProfile.notificationsEnabled});
  };

  // Change language
  const changeLanguage = (language: string) => {
    setUserProfile({...userProfile, language});
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd33d" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userProfile.profilePicture ? (
          <Image source={{ uri: userProfile.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={60} color="#666" />
          </View>
        )}

        {isEditing ? (
          <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.changePictureText}>Change Picture</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.welcomeText}>
            {userProfile.name ? `Welcome, ${userProfile.name}` : 'Welcome to MediChat AI'}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Edit/Save Buttons */}
        <View style={styles.actionButtonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]} 
                onPress={saveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="save" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Save Profile</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
                disabled={isSaving}
              >
                <Ionicons name="close" size={20} color="white" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create" size={20} color="white" />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={22} color="#ffd33d" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.name}
                onChangeText={(text) => setUserProfile({...userProfile, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.name || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.age}
                onChangeText={(text) => setUserProfile({...userProfile, age: text})}
                placeholder="Enter your age"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.age || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.gender}
                onChangeText={(text) => setUserProfile({...userProfile, gender: text})}
                placeholder="Enter your gender"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.gender || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* Medical Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit" size={22} color="#ffd33d" />
            <Text style={styles.sectionTitle}>Medical Information</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Blood Type</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.bloodType}
                onChangeText={(text) => setUserProfile({...userProfile, bloodType: text})}
                placeholder="Enter your blood type"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.bloodType || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Allergies</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.allergies}
                onChangeText={(text) => setUserProfile({...userProfile, allergies: text})}
                placeholder="List any allergies"
                placeholderTextColor="#999"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.allergies || 'None'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Current Medications</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.medications}
                onChangeText={(text) => setUserProfile({...userProfile, medications: text})}
                placeholder="List your current medications"
                placeholderTextColor="#999"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.medications || 'None'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Medical Conditions</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.conditions}
                onChangeText={(text) => setUserProfile({...userProfile, conditions: text})}
                placeholder="List any medical conditions"
                placeholderTextColor="#999"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.conditions || 'None'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Emergency Contact</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userProfile.emergencyContact}
                onChangeText={(text) => setUserProfile({...userProfile, emergencyContact: text})}
                placeholder="Name and phone number"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.emergencyContact || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={22} color="#ffd33d" />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleLabel}>
              <Ionicons name="notifications" size={20} color="#fff" />
              <Text style={styles.toggleText}>Notifications</Text>
            </View>
            <Switch
              value={userProfile.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={userProfile.notificationsEnabled ? "#fff" : "#f4f3f4"}
              disabled={!isEditing}
            />
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleLabel}>
              <Ionicons name="moon" size={20} color="#fff" />
              <Text style={styles.toggleText}>Dark Mode</Text>
            </View>
            <Switch
              value={userProfile.darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#767577", true: "#2196F3" }}
              thumbColor={userProfile.darkModeEnabled ? "#fff" : "#f4f3f4"}
              disabled={!isEditing}
            />
          </View>

          {isEditing && (
            <View style={styles.languageSelector}>
              <Text style={styles.fieldLabel}>Language</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity 
                  style={[
                    styles.languageButton, 
                    userProfile.language === 'English' && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage('English')}
                >
                  <Text style={
                    userProfile.language === 'English' 
                      ? styles.selectedLanguageText 
                      : styles.languageButtonText
                  }>English</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.languageButton, 
                    userProfile.language === 'Spanish' && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage('Spanish')}
                >
                  <Text style={
                    userProfile.language === 'Spanish' 
                      ? styles.selectedLanguageText 
                      : styles.languageButtonText
                  }>Spanish</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.languageButton, 
                    userProfile.language === 'French' && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage('French')}
                >
                  <Text style={
                    userProfile.language === 'French' 
                      ? styles.selectedLanguageText 
                      : styles.languageButtonText
                  }>French</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Delete Account Button - Only in Edit Mode */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await AsyncStorage.removeItem('userProfile');
                        setUserProfile(defaultProfile);
                        Alert.alert('Account Deleted', 'Your account has been successfully deleted');
                      } catch (error) {
                        console.error('Failed to delete account:', error);
                        Alert.alert('Error', 'Failed to delete your account');
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffd33d',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#666',
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  changePictureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  changePictureText: {
    color: 'white',
    marginLeft: 5,
  },
  content: {
    padding: 15,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    minWidth: 130,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#ffd33d',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  fieldValue: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  languageSelector: {
    marginTop: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  languageButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#ffd33d',
  },
  languageButtonText: {
    color: 'white',
  },
  selectedLanguageText: {
    color: 'black',
    fontWeight: 'bold',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});