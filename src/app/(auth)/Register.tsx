// app/login.tsx
import Auth from '@/component/Auth';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { supabase } from '../../../lib/supabase-client';
 
export default function Login() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    console.log(`email in Register: ${session?.user.email}`);
  }, [])

  return (
    <View style={styles.container}>
      <Auth />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
});
