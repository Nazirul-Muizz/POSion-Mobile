import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import ConfigPopup from '../ConfigPopup';
import RadioButton from '../RadioButton';

const EditMenuPopup = ({onConfirm, onCancel, menuId, isAvailable }: {onConfirm: () => void, onCancel: () => void, menuId: number, isAvailable: boolean}) => {
    const options = [true, false]; // for radio button availability
    const [isItemAvailable, setIsItemAvailable] = useState<boolean>(isAvailable);

    //if (isPending) return <ModalSpinner message="Mengemas kini..." />

    return (
        <ConfigPopup 
            visible
            onConfirm={onConfirm}
            onCancel={onCancel}
            title='Ubah Suai Menu Item'
        >
            <View style={{ marginBottom: 15 }}>
                <Text style={ styles.sectionTitle }>Ubah Nama Item</Text>
                {/* {TODO: change name, however this require validation
                    - name must be unique: no duplicate with strict toLowerCase and trim functions
                    - name must not exceed 50 characters
                    - name must not be null and only empty space
                    - IF NAME IS NULL OR CONTAIN ONLY EMPTY SPACES: AUTO IGNORE MUTATION ELSE DISPLAY ERROR}     */}
            </View>

            <View style={{ marginBottom: 15 }}>
                <Text style={ styles.sectionTitle }>Ubah Harga</Text>
                <TextInput 
                    keyboardType='numeric'
                    placeholder='0.00'
                    placeholderTextColor={'black'}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, marginTop: 5, color: 'black' }}
                />    
            </View>

            <View>
                <Text style={ [styles.sectionTitle, {marginBottom:5}] }>Tanda Item</Text>
                {options.map((option) => (
                    <RadioButton
                        key={option.toString()}
                        label={option ? 'Ada' : 'Tiada'}
                        value={option}
                        selectedValue={isItemAvailable}
                        onSelect={(value) => {
                            console.log(`Selected option in menu manager: ${value}`);
                            setIsItemAvailable(value);
                        }}
                    />
                ))}   
            </View>


        </ConfigPopup>
    )
}

    export default EditMenuPopup

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize:15, 
        fontWeight:'bold'
    }
})