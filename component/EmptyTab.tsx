import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, Button } from "react-native";
import { useRouter } from 'expo-router';
import { useAuth } from "@/context/authContext"; 

export default function EmptyPage() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/Register')
    }

    return (
        <SafeAreaView style={ styles.container }>
            <Text style={ styles.text }>Oops! You have not configured your profile</Text>
            <Text style={ styles.text }>Please ask your manager to complete your registration</Text>
            <Button title="Back to Login" onPress={() => handleLogout()} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {flex:1, justifyContent:'center', alignItems:'center'},
    text: {fontSize:15, color:'black', textAlign:'center', marginBottom:10}
})

