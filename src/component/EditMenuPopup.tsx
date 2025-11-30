import { StyleSheet, TextInput } from 'react-native'
import { Text, View } from 'react-native-reanimated/lib/typescript/Animated'
import ConfigPopup from './ConfigPopup'

const EditMenuPopup = () => {
  return (
    <ConfigPopup 
        visible={false}
        onConfirm={() => {}}
        onCancel={() => {}}
        title='Ubah Suai Menu Item'
    >
        <View>
            <Text>Ubah Nama Item</Text>    
        </View>

        <View>
            <Text>Ubah Harga</Text>
            <TextInput 
                keyboardType='numeric'
                placeholder='0.00'
                placeholderTextColor={'black'}
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, marginTop: 5, color: 'black' }}
            />    
        </View>

        <View>
            <Text>Tanda Item</Text>    
        </View>


    </ConfigPopup>
  )
}

export default EditMenuPopup

const styles = StyleSheet.create({

})