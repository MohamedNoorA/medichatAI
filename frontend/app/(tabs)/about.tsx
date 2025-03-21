import React from "react";
import { Text, View, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="medkit" size={60} color="#ffd33d" />
          <Text style={styles.title}>MediChat AI</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About The App</Text>
          <Text style={styles.description}>
            MediChat AI is your personal medical assistant powered by artificial intelligence. The app provides reliable medical information, symptom analysis, and health tips at your fingertips.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="image-outline" size={24} color="#ffd33d" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Customizable Interface</Text>
              <Text style={styles.featureDescription}>Personalize your app experience by setting your own images as wallpaper.</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#ffd33d" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>AI-Powered Medical Chat</Text>
              <Text style={styles.featureDescription}>Consult with our AI assistant about health concerns and receive evidence-based information.</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="document-text-outline" size={24} color="#ffd33d" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Medical Library</Text>
              <Text style={styles.featureDescription}>Access a comprehensive database of medical conditions, treatments, and medications.</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="notifications-outline" size={24} color="#ffd33d" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Medication Reminders</Text>
              <Text style={styles.featureDescription}>Set up reminders for your medications and appointments.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <Text style={styles.disclaimer}>
            MediChat AI is designed to provide general information and should not replace professional medical advice. Always consult with a healthcare provider for medical concerns.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 MediChat AI. All rights reserved.</Text>
          
          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:support@medichatai.com')}>
              <Ionicons name="mail-outline" size={18} color="white" />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
  },
  version: {
    color: "#aaaaaa",
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 10,
  },
  description: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  featureTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featureDescription: {
    color: "#dddddd",
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimer: {
    color: "#ff9999",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingBottom: 30,
  },
  footerText: {
    color: "#999999",
    fontSize: 12,
    marginBottom: 15,
  },
  contactContainer: {
    width: "100%",
    alignItems: "center",
  },
  contactButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  contactButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
});