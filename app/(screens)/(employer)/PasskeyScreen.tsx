import { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { usePasskeyAuth, PasskeyAuthProvider } from '@/context/PasskeyContext'; 
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

function PasskeyScreenContent() {
  const [input, setInput] = useState('');
  const { login, passkeyAuth } = usePasskeyAuth(); 
  const router = useRouter();

  const ref = useBlurOnFulfill({ value: input, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: input,
    setValue: setInput,
  });

 useEffect(() => {
    // Only attempt to login if the code is complete AND the user is NOT yet authenticated.
    if (input.length === CELL_COUNT && !passkeyAuth) { 
      login(input); // Call login, which will asynchronously update passkeyAuth
    }
  }, [input, login, passkeyAuth]); // login and passkeyAuth are needed for the guard condition

  // 2. Effect for NAVIGATION (Reaction)
  useEffect(() => {
    // Navigate ONLY when the passkeyAuth object has been set (i.e., on a successful login).
    if (passkeyAuth) {
      router.replace('/(screens)/(employer)/ManagerHome');
    }
  }, [passkeyAuth, router]);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Enter your passkey:</Text>
      <CodeField
        ref={ref}
        {...props}
        value={input}
        onChangeText={setInput}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad" // Use number-pad for better mobile experience
        textContentType="oneTimeCode" // iOS autofill helper
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      
    </SafeAreaView>
  );
}

export default function PasskeyScreen() {
    return (
        <PasskeyAuthProvider>
            <PasskeyScreenContent />
        </PasskeyAuthProvider>
    );
};

const styles = StyleSheet.create({
  root: {flex:1, justifyContent:'center', alignItems:'center'},
  title: {textAlign: 'center', fontSize: 18, marginBottom: 20},
  codeFieldRoot: {marginTop: 20, width: 200, marginLeft: 'auto', marginRight: 'auto'},
  cell: {
    width: 30, // Width of the individual box
    height: 40, // Height of the individual box
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2, // Creates the underscore effect
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000', // Highlight color when focused
  },
});