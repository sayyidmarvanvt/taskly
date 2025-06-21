import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

type Prop = {
  name?: string;
  isCompleted?: boolean;
};

export function ShoppingListItem({ name, isCompleted }: Prop) {
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
    <View
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}
    >
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorCeruleanBlue}
        />
        <Text style={[styles.itemText, isCompleted && styles.completedText]}>
          {name}
        </Text>
      </View>
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
        <AntDesign
          name="closecircle"
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
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
    paddingHorizontal: 18,
    borderBottomColor: theme.colorCeruleanBlue,
    borderBottomWidth: 1,
  },
  completedContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
    marginLeft: 8,
  },
  completedText: {
    color: theme.colorGrey,
    textDecorationColor: theme.colorGrey,
    textDecorationLine: "line-through",
  },
});
