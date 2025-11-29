import { discountDetails } from '@/types/MenuType';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface RadioButtonProps {
    label: string,
    value: discountDetails,
    selectedValue: discountDetails | null,
    onSelect: (value: discountDetails) => void,
}

const RadioButton = ({
    label,
    value,
    selectedValue,
    onSelect
}: RadioButtonProps) => {
    const isSelected = value === selectedValue;

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={() => onSelect(value)}
        >
            <View style={styles.outerCircle}>
                {isSelected && <View style={styles.innerCircle} />}
            </View>

            <View style={{marginHorizontal:15}}>
                <Text>{label}</Text>
            </View>
            
        </TouchableOpacity>
    )
}

export default RadioButton

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF', // Theme color for active
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF', // Theme color for selection
  },
})