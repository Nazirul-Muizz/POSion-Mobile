import { useHandleMenuItemPress } from '@/hooks/menuHook';
import { MenuItem } from '@/types/MenuType';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EditMenuPopup from './EditMenuPopup';


const Menu = ({row, activeTab}: {row: MenuItem[], activeTab: 'Ada' | 'Tiada'}) => {
    const { showModal, selectedMenuId, handleCloseModal, handlePress } = useHandleMenuItemPress();

    return (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {row.map((menuItem) => (
            <TouchableOpacity key={menuItem.menu_id} style={styles.menuItemContainer} onPress={() => handlePress(menuItem.menu_id)}>
                <Text style={{ color: 'black', marginVertical: 10, fontSize: 14, textAlign: 'center' }}>
                    {menuItem.menu_item}
                </Text>
            </TouchableOpacity>
        ))}

        {/* Add empty views if row has less than 3 items to align */}
        {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, i) => (
                <View key={`empty-${i}`} style={{ flex: 1, marginHorizontal: 4, marginLeft:5 }} />
            ))}

        {showModal && selectedMenuId !== null && (
            <EditMenuPopup 
                onCancel={handleCloseModal}
                onConfirm={handleCloseModal} // Replace with actual confirmation logic
                menuId={selectedMenuId}
                isAvailable={activeTab === 'Ada' ? true : false} // 4. Pass the correctly tracked ID
            />
        )}

        </View>
    )
}

export default Menu

const styles = StyleSheet.create({
    menuItemContainer: {
        borderWidth: 1,
        width: '100%',
        borderColor: 'white',
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8, 
        opacity: 0.95,
        padding: 5,
        elevation: 2,
    }
})