import { Slot, Stack } from 'expo-router';
import { AuthProvider } from "../context/authContext";

export default function RootLayout() {
  return (
   <AuthProvider>  
      <Stack screenOptions={{ headerShown:false}}>
        <Slot />
      </Stack>
    </AuthProvider>
  )
}
