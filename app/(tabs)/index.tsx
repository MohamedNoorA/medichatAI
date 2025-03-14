import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaceholderImage = require('../../assets/images/background-image.png');

// Message types
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am MediChat AI. How can I assist you with your health questions today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); // Default to dark mode
  
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const router = useRouter();

  // Load dark mode setting from profile
  useEffect(() => {
    const loadDarkModeSetting = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setDarkModeEnabled(profile.darkModeEnabled);
        }
      } catch (error) {
        console.error('Failed to load dark mode setting:', error);
      }
    };

    loadDarkModeSetting();
  }, []);

  // Sample AI responses for demo
  const aiResponses = [
    "Based on the symptoms you've described, this could be related to several conditions. I recommend consulting with your doctor for a proper diagnosis.",
    "Remember to stay hydrated and get enough rest. These simple steps can help with many common health issues.",
    "That's a great question! The recommended daily water intake varies by individual, but generally around 2-3 liters per day is advised.",
    "Exercise is indeed beneficial for that condition. Studies show that 30 minutes of moderate activity 5 times a week can help significantly.",
    "I understand your concern. While I can provide general information, your symptoms should be evaluated by a healthcare professional."
  ];

  // Function to send a message
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    }, 1000);
  };

  // Start a new chat session
  const startChat = () => {
    setIsChatActive(true);
    setShowHistory(false);
  };

  // View chat history
  const viewHistory = () => {
    setShowHistory(true);
    setIsChatActive(false);
  };

  // Go to About screen
  const navigateToAbout = () => {
    router.push('/about');
  };
  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  }

  // Go back to main menu
  const goToMainMenu = () => {
    setIsChatActive(false);
    setShowHistory(false);
  };

  // Render each message
  const renderMessage = ({ item }: { item: Message }) => (
    <View 
      style={[
        styles.messageBubble, 
        item.isUser ? styles.userMessage : styles.aiMessage
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <ImageBackground source={PlaceholderImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MediChat AI</Text>
            <Text style={styles.subtitle}>Your Personal Health Assistant</Text>
          </View>

          {/* Main Menu */}
          {!isChatActive && !showHistory && (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={[styles.button, styles.startChatButton]} onPress={startChat}>
                <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                <Text style={styles.buttonText}>Start New Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.historyButton]} onPress={viewHistory}>
                <Ionicons name="time" size={24} color="white" />
                <Text style={styles.buttonText}>View Chat History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.aboutButton]} onPress={navigateToAbout}>
                <Ionicons name="information-circle" size={24} color="white" />
                <Text style={styles.buttonText}>About MediChat AI</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Chat Interface */}
          {isChatActive && (
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.chatContainer}
              keyboardVerticalOffset={100}
            >
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={goToMainMenu} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.chatHeaderText}>Medical Consultation</Text>
              </View>
              
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your health question..."
                  placeholderTextColor="#aaa"
                  multiline
                />
                <TouchableOpacity 
                  style={styles.sendButton} 
                  onPress={sendMessage}
                  disabled={inputText.trim() === ''}
                >
                  <Ionicons 
                    name="send" 
                    size={24} 
                    color={inputText.trim() === '' ? "#666" : "white"} 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}

          {/* History View */}
          {showHistory && (
            <View style={styles.historyContainer}>
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={goToMainMenu} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.chatHeaderText}>Chat History</Text>
              </View>
              
              {messages.length > 1 ? (
                <FlatList
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={item => item.id}
                  style={styles.messageList}
                  contentContainerStyle={styles.messageListContent}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="chatbubbles-outline" size={60} color="#555" />
                  <Text style={styles.emptyStateText}>No chat history yet</Text>
                  <Text style={styles.emptyStateSubtext}>Start a new chat to begin</Text>
                  <TouchableOpacity style={styles.startNewChatButton} onPress={startChat}>
                    <Text style={styles.startNewChatButtonText}>Start New Chat</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffd33d',
    textAlign: 'center',
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '85%',
    height: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startChatButton: {
    backgroundColor: '#4CAF50', // Green
  },
  historyButton: {
    backgroundColor: '#2196F3', // Blue
  },
  aboutButton: {
    backgroundColor: '#9C27B0', // Purple
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    marginRight: 15,
  },
  chatHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#444',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: 'white',
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContainer: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#aaa',
    fontSize: 22,
    marginTop: 15,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 16,
    marginTop: 5,
  },
  startNewChatButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  startNewChatButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});