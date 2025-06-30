import { Link, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";


export default function Layout() {
 
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => {
            return (
              <Link href="/counter/history" asChild>
                <Pressable
                  hitSlop={20}
                  style={{
                    backgroundColor: "white",
                    width: 32,
                    height: 32,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="history" size={32} color="black" />
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}
