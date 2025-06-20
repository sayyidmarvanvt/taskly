import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { theme } from "../theme";

type Prop = {
  name?: string;
};

export default function ShoppingListItem({ name }: Prop) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "it will be gone for good",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => console.log("Delete Pressed"),
          style: "destructive",
        },
      ],
    );
  };
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomColor: theme.colorCeruleanBlue,
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 18, fontWeight: "200" },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
