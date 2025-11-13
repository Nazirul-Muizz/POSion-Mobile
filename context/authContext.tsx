import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profile } from "@/data/users"; // Actual profile must come from database EMPLOYEE TABLE
import { supabase } from "../lib/supabase-client";

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    userRole: string | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    loading:boolean;
    isRoleLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

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

  useEffect( () => {
      let isMounted = true; // Flag for cleanup
  
      if (user && user.email) {
        if (isMounted) setIsRoleLoading(true);
  
        const findRole = async () => {
          // --- ASYNC DATA FETCH & FIND LOGIC ---
          // 1. Simulate API call delay (Replace this with your actual Firestore/API call!)
          const userProfiles = await new Promise<typeof profile>( 
            (resolve) => {
              setTimeout(() => resolve(profile), 500);
            }
          )
  
          console.log(userProfiles);
  
          // 2. Perform the safe .find() matching operation
          const userProfile = userProfiles.find(p => p.email === user.email);
  
          console.log(`user email from auth: ${user.email}`);
          console.log(`user email from data object: ${userProfile?.email}`);
  
          const finalRole = userProfile ? userProfile.role : null;
  
          console.log("   -> ROLE FETCH COMPLETE: Found Profile:", !!userProfile, "| Role Set To:", finalRole);
  
          // 3. Set the role state (Default to EMPLOYEE if no profile found)
          // ROLES is now safely imported from '@/constants/roles'
          setUserRole(finalRole);
          setIsRoleLoading(false);
        }
  
        findRole();
  
      } else if (user === null) {
        // Clean up state if the user explicitly logs out
        if (isMounted) {
            setUserRole(null);
            setIsRoleLoading(false);
        }
      }
      
        // Cleanup function: runs when the component unmounts or before the next effect run
        return () => {
          isMounted = false;
        };
    }, [user])  


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
    <AuthContext.Provider value={{ user, login, logout, loading, userRole, isRoleLoading }}>
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