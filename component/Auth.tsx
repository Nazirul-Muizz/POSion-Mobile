import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../lib/supabase-client';
import { Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true)
    try {
      const trimmedEmail = email.trim()  // remove extra spaces
      if (!trimmedEmail) {
        Alert.alert('Sign Up Error', 'Please enter a valid email')
        setLoading(false)
        return
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      })

      console.log(`data: ${data.user?.email}`)

      if (error) {
        Alert.alert('Sign in Error', error.message)
      } else {
        //Alert.alert('Sign in Successful')

      }
    } catch(e) {
      console.error(e)
    }

    setLoading(false)
  }

  async function signUpWithEmail() {
  setLoading(true)
  try {
    const trimmedEmail = email.trim()  // remove extra spaces
    if (!trimmedEmail) {
      Alert.alert('Sign Up Error', 'Please enter a valid email')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    })

    if (error) {
      Alert.alert('Sign Up Error', error.message)
    } else {
      Alert.alert('Sign Up Successful', `You may login using your credentials`)
    }
  } catch (e) {
    console.error(e)
  }
  setLoading(false)
}


  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Register" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: { 
    marginVertical: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 5 
},
})