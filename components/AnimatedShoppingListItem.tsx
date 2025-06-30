import { Animated } from "react-native";
import { ShoppingListItem } from "./ShoppingListItem";
import { useEffect, useRef } from "react";
import { ShoppingListItemType } from "../app";

type AnimatedShoppingListItemProps = {
  item: ShoppingListItemType;
  onDelete: () => void;
  onToggleComplete: () => void;
};

// Animated Shopping List Item Component
export function AnimatedShoppingListItem({
  item,
  onDelete,
  onToggleComplete,
}: AnimatedShoppingListItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate in when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  const animateOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleDelete = () => {
    animateOut(() => {
      onDelete();
    });
  };

  const handleToggleComplete = () => {
    // Quick scale animation for toggle
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleComplete();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
      }}
    >
      <ShoppingListItem
        name={item.name}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        isCompleted={Boolean(item.completedAtTimestamp)}
      />
    </Animated.View>
  );
}
