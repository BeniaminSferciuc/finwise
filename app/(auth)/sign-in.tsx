import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import {
  AlertOctagon,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

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

      const { error } = await authClient.signIn.email({ email, password });

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
          <View className="flex justify-between flex-1 px-6 pt-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="mb-4"
              onPress={() => router.push("/")}
            >
              <View className="items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                <ChevronLeft size={22} color="#333" />
              </View>
            </TouchableOpacity>

            <View>
              {/* Title */}
              <Text className="text-3xl font-bold leading-tight text-black">
                Welcome back to EcoEase! 👋
              </Text>
              <Text className="mt-2 text-base text-gray-500">
                Login to Your Existing Account
              </Text>

              {/* ERROR MESSAGE */}
              {error && (
                <View
                  className="flex-row items-center gap-2 p-3 mt-6 border rounded-xl"
                  style={{
                    backgroundColor: "rgba(255, 0, 0, 0.10)",
                    borderColor: "rgba(255, 0, 0, 0.25)",
                  }}
                >
                  <AlertOctagon size={20} color="#dc2626" />
                  <Text className="flex-1 text-[#dc2626]">{error}</Text>
                </View>
              )}

              {/* EMAIL */}
              <View className="mt-8">
                <View className="flex-row items-center px-4 border border-gray-300 rounded-xl h-14">
                  <Mail size={20} color="#888" className="mr-2" />
                  <TextInput
                    placeholder="Email/Username"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    className="flex-1 text-base text-black"
                    style={{ color: "black" }}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View className="mt-4">
                <View className="flex-row items-center px-4 border border-gray-300 rounded-xl h-14">
                  <Lock size={20} color="#888" className="mr-2" />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={secure}
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-base text-black"
                    style={{ color: "black" }}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    {secure ? (
                      <EyeOff size={20} color="#999" />
                    ) : (
                      <Eye size={20} color="#999" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot password */}
              <TouchableOpacity className="mt-2">
                <Text className="text-gray-600">Forgot password?</Text>
              </TouchableOpacity>

              {/* SIGN IN BUTTON */}
              <TouchableOpacity
                onPress={handleLogin}
                className="items-center justify-center mt-6 overflow-hidden bg-indigo-800 h-14 rounded-xl"
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    className="animate-spin"
                  />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mt-8">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-4 text-gray-500">Or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* GOOGLE */}
              <Button
                variant="outline"
                className="mt-6 bg-white border-gray-300 h-14 rounded-xl"
              >
                <Icon name="google" size={22} color="#DB4437" />
                <Text className="text-base text-black">
                  Sign In with Google
                </Text>
              </Button>

              {/* FACEBOOK */}
              <Button
                variant="outline"
                className="mt-4 bg-white border-gray-300 h-14 rounded-xl"
              >
                <Icon name="facebook" size={22} color="#1877F2" />
                <Text className="text-base text-black">
                  Sign In with Facebook
                </Text>
              </Button>
            </View>

            <View className="items-center pb-10">
              <Text className="text-base text-gray-600">
                Don&apos;t Have an Account?{" "}
                <Link href="/sign-up">
                  <Text className="font-semibold text-blue-600">Sign Up</Text>
                </Link>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
