import {Text, TouchableOpacity, Image, Platform, View} from 'react-native'
import {MenuItem} from "@/type";
import {appwriteConfig} from "@/lib/appwrite";
import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
    const { addItem } = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={{ uri: image_url }} className="size-32 absolute -top-10" resizeMode="contain" />
            <View className={"mt-8"}>
                <Text className="top-0 text-center base-bold text-dark-100 mb-2" numberOfLines={5}>{name}</Text>
                <Text className="body-regular text-gray-200 mb-4">From £{price}</Text>
                <TouchableOpacity
                    onPress={() => addItem({id: $id, name, price, image_url: image_url, customisations: []})}>
                    <Text className="flex items-center paragraph-bold text-primary">Add to Cart +</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

    )
}
export default MenuCard