import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
};

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", isCompleted: false },
  { id: "2", name: "Tea", isCompleted: false },
  { id: "3", name: "Sugar", isCompleted: true },
];

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: new Date().toTimeString(),
          name: value,
          isCompleted: false,
        },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setValue("");
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    >
      <TextInput
        placeholder="E.g. Coffee"
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      {/* <ScrollView> */}
        {shoppingList.map((item) => (
          <ShoppingListItem
            key={item.id}
            name={item.name}
            isCompleted={item.isCompleted}
          />
        ))}
      {/* </ScrollView> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    paddingHorizontal: 24,
    margin: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
});
