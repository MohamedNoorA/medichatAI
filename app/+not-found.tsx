import { Link, Stack } from "expo-router";
import { Text, View,StyleSheet } from "react-native";

export default function notFoundScreen() {
    return (
        <>
        <Stack.Screen options={{title: "Oops! Screen Not Found "}} />
        <View style={styles.container}>
            <Link href="/+not-found" style={styles.button}>
            Go Back To Home</Link>
        </View>


        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  button: {
    fontSize : 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
