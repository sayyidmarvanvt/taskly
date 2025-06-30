import {
  StyleSheet,
  TextInput,
  FlatList,
  View,
  Text,
  Animated,
} from "react-native";
import { theme } from "../theme";
import { useState, useEffect, useRef } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";
import { AnimatedShoppingListItem } from "../components/AnimatedShoppingListItem";

const storageKey = "shopping-list";

export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        setShoppingList(data);
        // Animate the entire list in
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      } else {
        // If no data, still show the list
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    };

    fetchInitial();
  }, [listOpacity]);

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: new Date().toISOString(),
          name: value,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];

      setShoppingList(newShoppingList);
      saveToStorage(storageKey, newShoppingList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      } else {
        return item;
      }
    });

    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
  };

  return (
    <Animated.View style={[styles.container, { opacity: listOpacity }]}>
      <FlatList
        data={orderShoppingList(shoppingList)}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={styles.listEmptyContainer}>
            <Text>Your shopping list is empty</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AnimatedShoppingListItem
            item={item}
            onDelete={() => handleDelete(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
          />
        )}
        ListHeaderComponent={
          <TextInput
            placeholder="E.g. Coffee"
            style={styles.textInput}
            value={value}
            onChangeText={setValue}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        }
      />
    </Animated.View>
  );
}

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }
    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
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
