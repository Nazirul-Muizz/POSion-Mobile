import { discountDetails } from "@/types/MenuType";
import { StyleSheet, View } from 'react-native';
import ConfigPopup from "../ConfigPopup";
import RadioButton from "../RadioButton";

const SubmitDialog = ({
    data,
    onConfirm,
    onClose,
    selected,
    onSelect,    
}: {data: discountDetails[], onConfirm: () => void, onClose: () => void, selected: discountDetails | null, onSelect: (value: discountDetails) => void}
) => {

    console.log('')

    const renderData = data.map(item => {
        return (
            <RadioButton
                key={item.discount_id} 
                label={item.discount_name}
                value={item}
                selectedValue={selected}
                onSelect={onSelect}
            />
        )
        
    })
    
    return (
        <ConfigPopup
            visible
            onConfirm={onConfirm}
            onCancel={onClose}
            title="Pilih Diskaun"
        >
            <View>
                {renderData}
            </View> 
        </ConfigPopup>
    )
}

export default SubmitDialog

const styles = StyleSheet.create({})