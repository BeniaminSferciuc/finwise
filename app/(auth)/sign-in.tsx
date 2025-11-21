import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import {
  AlertOctagon,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

// Define the custom dark teal color from the screenshot
const THEME_COLOR = "#003A40";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(
          error.message ?? "Something went wrong. Please try again later."
        );
        return;
      }

      router.push("/overview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-6"
          >
            {/* --- HEADER SECTION --- */}
            <View className="items-center mt-10 mb-8">
              {/* Logo Box */}
              <View
                className="items-center justify-center w-16 h-16 mb-6 shadow-sm rounded-2xl"
                style={{ backgroundColor: THEME_COLOR }}
              >
                <Sparkles size={32} color="white" />
              </View>

              <Text className="mb-3 text-2xl font-bold text-black">
                Sign In
              </Text>

              <Text className="px-4 leading-5 text-center text-gray-500">
                To sign in to an account in the application, enter your email
                and password
              </Text>
            </View>

            {/* --- ERROR MESSAGE --- */}
            {error && (
              <View
                className="flex-row items-center gap-2 p-3 mb-6 border rounded-xl"
                style={{
                  backgroundColor: "rgba(255, 0, 0, 0.05)",
                  borderColor: "rgba(255, 0, 0, 0.2)",
                }}
              >
                <AlertOctagon size={20} color="#dc2626" />
                <Text className="flex-1 text-sm text-[#dc2626]">{error}</Text>
              </View>
            )}

            {/* --- FORM SECTION --- */}
            <View className="gap-4">
              {/* EMAIL INPUT */}
              <View className="flex-row items-center px-4 bg-gray-100/80 rounded-2xl h-14">
                <Mail size={20} color="#666" className="mr-3" />
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  className="flex-1 h-full text-base text-black"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* PASSWORD INPUT */}
              <View className="flex-row items-center px-4 bg-gray-100/80 rounded-2xl h-14">
                <Lock size={20} color="#666" className="mr-3" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={secure}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 h-full text-base text-black"
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  {secure ? (
                    <EyeOff size={20} color="#999" />
                  ) : (
                    <Eye size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="items-end">
                <Text
                  className="text-sm font-semibold"
                  style={{ color: THEME_COLOR }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- ACTIONS SECTION --- */}
            <View className="gap-4 mt-8">
              {/* PRIMARY BUTTON (Continue) */}
              <TouchableOpacity
                onPress={handleLogin}
                className="items-center justify-center rounded-full shadow-sm h-14"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    Continue
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center justify-center my-2">
                <View className="h-[1px] bg-gray-200 w-16" />
                <Text className="mx-3 text-xs text-gray-400">
                  Don&qout;t have an account yet?
                </Text>
                <View className="h-[1px] bg-gray-200 w-16" />
              </View>

              {/* SECONDARY BUTTON (Create Account) */}
              <Link href="/sign-up" asChild>
                <TouchableOpacity className="items-center justify-center bg-gray-100 rounded-full h-14">
                  <Text className="text-base font-semibold text-black">
                    Create an account
                  </Text>
                </TouchableOpacity>
              </Link>

              {/* SOCIAL BUTTONS */}
              <TouchableOpacity className="flex-row items-center justify-center bg-gray-100 rounded-full h-14">
                <Icon name="apple1" size={22} color="black" className="mr-2" />
                <Text className="ml-2 text-base font-semibold text-black">
                  Sign in with Apple
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-center bg-gray-100 rounded-full h-14">
                {/* Using a generic Google icon representation or Icon lib */}
                <Icon name="google" size={20} color="black" className="mr-2" />
                <Text className="ml-2 text-base font-semibold text-black">
                  Sign in with Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- FOOTER --- */}
            <View className="py-8 mt-auto">
              <Text className="text-xs leading-5 text-center text-gray-400">
                By clicking &qout;Continue&qout;, I have read and agree{"\n"}
                with the{" "}
                <Text className="text-gray-600 underline">
                  Term Sheet, Privacy Policy
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
