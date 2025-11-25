import "../../global.css"
import {FlatList, Pressable, Image, Text, View, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {images, offers} from "@/constants";
import {Fragment} from "react";
import cn from "clsx";
import CartButton from "@/components/CartButton";
//in react native, wrap with safeareaview from react-view -safe- context
export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={offers}
                renderItem={({item, index})=>{
                    const evenIndex = index % 2 === 0;
                    return (
                        <View>
                            <Pressable
                                className={cn("offer-card", evenIndex ? "flex-row-reverse" : "flex-row")}
                                style={{ backgroundColor: item.color }}
                            >
                                {({ pressed }) => (
                                    <Fragment>
                                        <View className="h-full w-1/2">
                                            <Image source={item.image} className="size-full" resizeMode="contain" />
                                        </View>

                                        <View className={cn("offer-card__info", evenIndex? "pl-10": "pr-10")}>
                                            <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                                            <Image
                                                source={images.arrowRight}
                                                className="size-10"
                                                resizeMode="contain"
                                                tintColor="#ffffff"
                                            />
                                        </View>
                                    </Fragment>
                                )}
                            </Pressable>

                        </View>
                    )
                }}

                //for extra space on the sides
                contentContainerClassName={"pb-28 px-5"}

                ListHeaderComponent={()=>(
                    <View className="flex-between flex-row my-5">
                        <View className="flex-start">
                            <Text className={"small-bold text-primary"}>DELIVER TO </Text>
                            <TouchableOpacity className={"flex-center flex-row"}>
                                <Text className={"paragraph-bold text-dark-100"}>UNITED KINGDOM</Text>
                                <Image source={images.arrowDown} className={"size-3"} resizeMode="contain"/>
                            </TouchableOpacity>
                        </View>
                        <CartButton />
                    </View>
                    )}
            />
        </SafeAreaView>
    );
}