import {View, Text} from "react-native";
import React from "react";
import {Redirect, Slot} from "expo-router";

//shared parent layout

export default function Layout (){
    const isAuthenticated = false;
    if(!isAuthenticated) <Redirect href="/sign-in" />;
    return (
        <Slot />
    )
}