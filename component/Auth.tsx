import { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../lib/supabase-client';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import { assignEmployeeUUID } from '@/services/employeeServices';


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const callCountRef = useRef(0);

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
        }

        // try {
        //   await assignEmployeeUUID();
        // } catch (e) {
        //   console.error("UUID assignment failed:", e);
        // }
        
    } catch(e) {
        console.error(e)
    }

    setLoading(false)
  }

  async function signUpWithEmail() {

    if (loading) return;

    callCountRef.current++;
    console.log(`call count: ${callCountRef.current}`);

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
        console.error(`Sign Up Error in Auth: ${error}`)
        setLoading(false) // Add a return and setLoading here for the auth error
      } else {
        Alert.alert('Sign Up Successful!', 'Please login to proceed into the app')
        console.log(`confirmed sign up successful`)
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
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
      <View style={[styles.buttonContainer, styles.mt20]}>
        <CustomButton 
          title='Login' 
          onPress={() => signInWithEmail()}
          textStyle={ {color: 'white'} }
          style={ styles.button }
        />
        <CustomButton 
          title='Register' 
          onPress={() => signUpWithEmail()}
          textStyle={ {color: 'white'} }
          style={ styles.button }
        />     
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
  buttonContainer: {
    flexDirection:'row',
    justifyContent: 'center'
  },
  input: { 
    marginVertical: 10, 
    borderWidth: 1, 
    borderColor: 'black', 
    padding: 10, 
    borderRadius: 5 
},
  button: {
    backgroundColor: 'black',
    marginHorizontal: 10
  }
})