import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Something went wrong. Please try again."
        );
        return;
      }

      router.push("/sign-in");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "Unable to sign up. Check your internet connection or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({ provider: "google" });
    } catch {
      setErrorMessage("Google sign-up failed. Please try again.");
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
          <View className="justify-center flex-1 px-6 pt-4">
            {/* HEADER */}
            <View>
              <Text className="text-3xl font-bold text-black">
                Create your account
              </Text>

              <Text className="mt-1 text-gray-500">Sign up to get started</Text>

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <View
                  className="flex-row items-center gap-2 p-3 mt-6 border rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,0,0,0.10)",
                    borderColor: "rgba(255,0,0,0.25)",
                  }}
                >
                  <AlertCircle size={20} color="#dc2626" />
                  <Text className="flex-1 text-black">{errorMessage}</Text>
                </View>
              )}

              {/* NAME */}
              <View className="mt-8">
                <Text className="mb-1 text-gray-600">Name</Text>
                <View className="flex-row items-center px-4 border border-gray-300 rounded-xl h-14">
                  <User size={18} color="#888" className="mr-2" />
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    className="flex-1 text-base text-black"
                    style={{ color: "black" }}
                  />
                </View>
              </View>

              {/* EMAIL */}
              <View className="mt-4">
                <Text className="mb-1 text-gray-600">Email</Text>
                <View className="flex-row items-center px-4 border border-gray-300 rounded-xl h-14">
                  <Mail size={18} color="#888" className="mr-2" />
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 text-base text-black"
                    style={{ color: "black" }}
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View className="mt-4">
                <Text className="mb-1 text-gray-600">Password</Text>
                <View className="flex-row items-center px-4 border border-gray-300 rounded-xl h-14">
                  <Lock size={18} color="#888" className="mr-2" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-base text-black"
                    style={{ color: "black" }}
                  />
                </View>
              </View>

              {/* CREATE ACCOUNT BUTTON */}
              <Button
                onPress={handleSignUp}
                disabled={loading}
                className="mt-6 bg-indigo-700 h-14 rounded-xl"
              >
                {loading ? (
                  <Loader2 size={20} color="white" />
                ) : (
                  <UserPlus size={20} color="white" />
                )}
                <Text className="text-lg font-semibold text-white">
                  {loading ? "Creating..." : "Create Account"}
                </Text>
              </Button>

              {/* OR DIVIDER */}
              <Text className="my-6 text-center text-gray-500">or</Text>

              {/* GOOGLE SIGN UP */}
              <Button
                variant="outline"
                className="bg-white border-gray-300 h-14 rounded-xl"
                onPress={handleGoogleSignUp}
              >
                <Icon name="google" size={22} color="#DB4437" />
                <Text className="text-base text-black">
                  Sign up with Google
                </Text>
              </Button>
            </View>
          </View>
          {/* FOOTER */}
          <View className="items-center mb-10">
            <Text className="text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in">
                <Text className="font-semibold text-blue-600">Sign in</Text>
              </Link>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
