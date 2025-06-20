import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PixelRatio } from "react-native";
import { theme } from "./theme";

export default function App() {
  return (
    <View style={styles.container}>
      <View
        style={styles.itemContainer}
      >
        <Text style={styles.itemText}>Coffee</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.colorWhite,
    // alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomColor: theme.colorCeruleanBlue,
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 18, fontWeight: "200" },
});
