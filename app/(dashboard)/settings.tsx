import { authClient } from "@/lib/auth-client";
import { Pressable, Text, View } from "react-native";

const Settings = () => {
  return (
    <View>
      <Text>Hello</Text>
      <Pressable
        onPress={async () => {
          await authClient.signOut({
            fetchOptions: {
              // onSuccess: () => {
              //   router.replace("/(auth)/sign-in");
              // },
            },
          });
        }}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
};

export default Settings;
