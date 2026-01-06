// whenever there is something you want to use across multiple screens
// within your application, that means you need to put it in layout.tsx

// whenever there is something you want to use across multiple screens
// within your application, that means you need to put it in layout.tsx

import {SplashScreen, Stack} from "expo-router";
import "../global.css"
import {useFonts} from "expo-font";
import {useEffect} from "react";
import useAuthStore from "@/store/auth.store";


export default function RootLayout() {

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
};