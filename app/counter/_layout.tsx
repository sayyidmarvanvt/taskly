import { Link, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "../../theme";
import { Pressable } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => (
            <Link href={"counter/history"} asChild>
              <Pressable hitSlop={20} 
              style={{ backgroundColor: "white" }}>
                {/*hitslop give large area for touch , give background white because some time icon get hidden*/}
                <MaterialIcons
                  name="history"
                  size={28}
                  color={theme.colorGrey}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}
