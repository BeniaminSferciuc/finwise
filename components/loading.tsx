import { ActivityIndicator, View } from "react-native";

export const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="small" color="#ff5b00" />
    </View>
  );
};
