import { Slot, Stack } from "expo-router";
import { View } from "react-native";
import { usePathname } from "expo-router";
import FooterNavigation from "@/component/FooterNavi";

export default function EmployerLayout() {

    return (
        <View style={{ flex:1 }}>
            <Slot />
        </View>
    );
}