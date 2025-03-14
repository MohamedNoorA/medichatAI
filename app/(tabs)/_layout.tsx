import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
            backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
            backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          headerTitle: "MediChat AI",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
              color={color}
            />
          ),
          tabBarLabel: "Home"
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          headerTitle: "Your Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={30}
              color={color}
            />
          ),
          tabBarLabel: "Profile"
        }}
      />
      
      <Tabs.Screen 
        name="about" 
        options={{
          headerTitle: "About MediChat AI",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              size={30}
              color={color}
            />
          ),
          tabBarLabel: "About"
        }}
      />
      
      <Tabs.Screen 
        name="+not-found" 
        options={{
          headerShown: true,
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}