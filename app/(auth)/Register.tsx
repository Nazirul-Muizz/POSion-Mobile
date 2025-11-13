// app/login.tsx
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase-client';
import Auth from '@/component/Auth';
import { Session } from '@supabase/supabase-js';

export default function Login() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  //const { login } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
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
