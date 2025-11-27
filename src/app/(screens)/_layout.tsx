import FooterNavigation from "@/component/FooterNavi";
import { Slot, usePathname } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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