import { Slot, Stack } from 'expo-router';
import { AuthProvider } from "../context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>  
          <Stack screenOptions={{ headerShown:false}}>
            <Slot />
          </Stack>
      </AuthProvider>
    </QueryClientProvider>
  )
}
