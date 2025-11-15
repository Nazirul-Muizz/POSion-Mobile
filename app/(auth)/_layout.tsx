// app/(auth)/_layout.tsx (Conceptual - replacing your old authGate)

import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@/context/authContext'; // Your existing context
import { ActivityIndicator, View, Text } from 'react-native';
import { ROLES } from '@/constants/Roles';
import EmptyPage from "@/component/EmptyTab";

export default function AuthGateLayout() {
  const { user, loading, isRoleLoading, userRole } = useAuth(); // Assuming 'user' is set after email login
  const normalizedRole = userRole?.toUpperCase();
  console.log(`user email in auth layout: ${user?.email}`);
  console.log(`user role in auth layout: ${userRole}`);

  if (loading || isRoleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (user) {
    //return userRole === ROLES.MANAGER ? <Redirect href="/(screens)/(employer)/PasskeyScreen" /> : <EmptyPage />
    if (normalizedRole === ROLES.MANAGER.toUpperCase()) return <Redirect href="/(screens)/(employer)/PasskeyScreen" />
    else if (normalizedRole === ROLES.EMPLOYEE_REST.toUpperCase() || normalizedRole === ROLES.EMPLOYEE_STALL.toUpperCase()) return <Redirect href="/(screens)/(shared)/Order" />
    else return <EmptyPage />
  }

  // If NOT authenticated, allow them access to Register
  return <Slot />
}