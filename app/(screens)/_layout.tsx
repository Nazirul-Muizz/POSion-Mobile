import { StyleSheet, View, Text, StatusBar } from "react-native";
import { Slot, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterNavigation from "@/component/FooterNavi";

export default function ScreenLayout() {
    const pathname = usePathname();

    const hideFooterPaths = [
        "/PasskeyScreen",
        "/ManagerHome",
        "/BlankPage",
    ];

    const hideFooterExact = ["/"];

    const showFooter = !hideFooterPaths.some(path => pathname.includes(path)) && !hideFooterExact.includes(pathname);;
    console.log(`showFooter in screen layout: ${showFooter}`)
    console.log(`current path from screen layout: ${pathname}`)

    return (

        <SafeAreaView style={{ flex:1 }}>
            {/* The Slot renders the active screen (e.g., Order.tsx) */}
            <Slot />

            {showFooter && <FooterNavigation />}

            <StatusBar />

        </SafeAreaView>

    )
}