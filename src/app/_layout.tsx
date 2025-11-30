import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider } from "../context/authContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true); // marks the layout as mounted
  }, []);

  useEffect(() => {
    if (ready) {
      router.replace('/(auth)/Register');
    }
  }, [ready]);

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
