import {Button, Text, View} from "react-native"
import React from "react"
import {SafeAreaView} from "react-native-safe-area-context";
import seed from "@/lib/seed";

const Search =() =>{
    return (
        <SafeAreaView>
            <Text>Search</Text>
            <Button
                title="seed"
                onPress={() =>
                    seed().catch((error) => {
                        console.log("Error failed to seed database", error);
                    })
                }
            />
        </SafeAreaView>
    )
}

export default Search;