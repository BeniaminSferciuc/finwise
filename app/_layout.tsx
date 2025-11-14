import { LoadingScreen } from "@/components/loading";
import { authClient } from "@/lib/auth-client";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { Redirect, Slot, useSegments } from "expo-router";
import { View } from "react-native";
import { setCustomText } from "react-native-global-props";

import "../global.css";

export default function Layout() {
  const { data: isAuthenticated, isPending } = authClient.useSession();
  const segments = useSegments() as string[];

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  if (isPending) return <LoadingScreen />;

  const inDashboardGroup = segments[0] === "(dashboard)";
  const inAuthGroup = segments[0] === "(auth)";
  const isIndexPage = segments.length === 0;

  if (isAuthenticated) {
    if (isIndexPage || inAuthGroup) {
      return <Redirect href="/overview" />;
    }
  } else {
    if (inDashboardGroup) {
      return <Redirect href="/sign-in" />;
    }
  }

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  setCustomText({
    style: {
      fontFamily: "Outfit_700Bold",
      color: "white",
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Slot />
    </View>
  );
}
