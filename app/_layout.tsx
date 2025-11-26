// whenever there is something you want to use across multiple screens
// within your application, that means you need to put it in layout.tsx

import {SplashScreen, Stack} from "expo-router";
import "../global.css"
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";

Sentry.init({
  dsn: 'https://a7dac49981d180ca4678014ab3ce5a04@o4510426014351360.ingest.de.sentry.io/4510426858520656',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
export default Sentry.wrap(function RootLayout() {

    const{isLoading, fetchAuthenticatedUser} = useAuthStore();

    const [fontsLoaded, error] = useFonts(
        {
            "QuickSand-Bold" : require("../assets/fonts/Quicksand-Bold.ttf"),
            "QuickSand-Light" : require("../assets/fonts/Quicksand-Light.ttf"),
            "QuickSand-Medium" : require("../assets/fonts/Quicksand-Medium.ttf"),
            "QuickSand-Regular" : require("../assets/fonts/Quicksand-Regular.ttf"),
            "QuickSand-SemiBold" : require("../assets/fonts/Quicksand-SemiBold.ttf"),
        }
    );

    useEffect(() => {
        if(error) throw error;
        if(fontsLoaded) SplashScreen.hideAsync();
    },[fontsLoaded,error]);

    useEffect(()=>{
        fetchAuthenticatedUser()
    },[]);

    if(!fontsLoaded || isLoading) return null;

    //screenOptions set headershown to false will hide the name of the file that is displayed example index.tsx will now not be index
  return <Stack screenOptions={{headerShown: false}}/>;
});