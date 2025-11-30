import { useDropdownStore } from '@/store/globalStore';
import { DropdownProps } from '@/types/UiProps';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export default function CustomDropdown( {id, data, initialState}: DropdownProps) {
  const [open, setOpen] = useState(false);
  //const [value, setValue] = useState('')
  // const {} = useOrderItemStore();
  const { selectedOption, setSelectedOption } = useDropdownStore();

  const selected = selectedOption[id] || initialState;

  return (
    <View style={{marginVertical: 12, marginHorizontal:7}}>
      <Pressable
        onPress={() => setOpen(!open)}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 50,
          borderColor: '#333',
          backgroundColor: 'white',
        }}>
        <Text style={{fontSize:12, textAlign:'center'}}>{selected}</Text>
      </Pressable>

      {open && (
        <View
          style={{
            position: 'absolute',
            top: '110%', // distance below the pressable
            left: 0,
            width: '100%',
            zIndex: 999,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: 'white',
            //paddingVertical: 4,
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedOption(id, item);
                  setOpen(false);
                }}
                style={{ padding: 10 }}
              >
                <Text style={{fontSize:12}}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

