import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase-client';
import CustomButton from './CustomButton';


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

        console.log(`data: ${data.user?.email}`);

        console.log("SUPABASE RESPONSE:", data, error);


        if (error) {
          Alert.alert('Sign in Error', error.message)
          console.error(`Sign in Error in Auth: ${error}`)
          setLoading(false) // Add a return and setLoading here for the auth error
        } else {
          //Alert.alert('Sign Up Successful!', 'Please login to proceed into the app')
          console.log(`confirmed sign in successful`)
        }
        
    } catch(e) {
        console.error(e)
    } finally {
      setLoading(false);
    }
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
        //Alert.alert('Sign Up Successful!', 'Please login to proceed into the app')
        console.log(`confirmed sign up successful`)
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
}

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }


  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
            placeholder="Email"
            placeholderTextColor='black'
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
        />
        <View style={ styles.passwordInputContainer }>
          <TextInput
            placeholder="Password"
            placeholderTextColor='black'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            style={[styles.input, { flex: 1}]}
          />
          <Pressable
            onPress={togglePasswordVisibility}
            style={ styles.iconContainer}
          >
            <FontAwesome5 name={isPasswordVisible ? "eye-slash" : "eye"} size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={[styles.buttonContainer, styles.mt20]}>

        <CustomButton 
          title='Login' 
          onAnimationComplete={signInWithEmail}
          textStyle={ {color: 'white'} }
          style={ styles.button }
        />

        <CustomButton 
          title='Register' 
          onAnimationComplete={signUpWithEmail}
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
    borderRadius: 10,
    color: 'black'
},
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'black',
    marginHorizontal: 10
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    padding: 5
  }
})