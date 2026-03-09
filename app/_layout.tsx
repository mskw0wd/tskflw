import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

void SplashScreen.preventAutoHideAsync();

const TextGlobal = Text as typeof Text & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};

const TextInputGlobal = TextInput as typeof TextInput & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};

TextGlobal.defaultProps = TextGlobal.defaultProps ?? {};
TextGlobal.defaultProps.allowFontScaling = false;
TextGlobal.defaultProps.maxFontSizeMultiplier = 1;

TextInputGlobal.defaultProps = TextInputGlobal.defaultProps ?? {};
TextInputGlobal.defaultProps.allowFontScaling = false;
TextInputGlobal.defaultProps.maxFontSizeMultiplier = 1;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "PTRootUI-Regular": require("../assets/fonts/pt-root-ui_regular.ttf"),
    "PTRootUI-Medium": require("../assets/fonts/pt-root-ui_medium.ttf"),
    "PTRootUI-Bold": require("../assets/fonts/pt-root-ui_bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    throw fontError;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
