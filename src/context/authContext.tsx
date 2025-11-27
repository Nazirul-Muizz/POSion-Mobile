import { checkAndAssignUUID, fetchEmployeeData } from "@/services/employeeServices";
import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    username: string | null;
    userRole: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    loading:boolean;
    isRoleLoading: boolean;
    refetchRole: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

    const { data: userIdAfterAssignment, isLoading: isAssignmentLoading } = 
    useQuery({
      queryKey: ['userIdAssigned', user?.id],
      queryFn: () => checkAndAssignUUID(user!.id, user!.email),
      enabled: !!user && !loading,
      staleTime: Infinity
    })

    const {
      data: profileData, // this is from EmployeeProfile interface
      isLoading: isProfileLoading,
      refetch: refetchRole
    } = useQuery({
      queryKey: ['userProfile', user?.id],
      queryFn: () => fetchEmployeeData(userIdAfterAssignment!),
      enabled: !!user && !loading && !!userIdAfterAssignment,
      staleTime: 5 * 60 * 1000 // 5 minutes
    })

    const isRoleLoading = isAssignmentLoading || isProfileLoading;
    const userRole = profileData?.role ?? null;
    const username = profileData?.username ?? null;

    useEffect(() => {
      let isMounted = true;

      // 1️⃣ Restore Supabase session
      const restoreSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Failed to restore session:", error);
        }

        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      };

      restoreSession();

      // 2️⃣ Listen for auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) setUser(session?.user ?? null);
      });

      return () => {
        isMounted = false;
        listener.subscription.unsubscribe();
      };
    }, []); 


  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.session?.user ?? null);
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, userRole, username, isRoleLoading, refetchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};