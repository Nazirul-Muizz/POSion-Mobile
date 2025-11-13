import { View, StyleSheet, Text, Animated, TouchableOpacity, TextInput, SectionList } from "react-native";
import CustomButton from "@/component/CustomButton";
import CustomSidebar from "@/component/CustomSidebar";
import { menu, addOns, MenuType, MenuItemType } from "@/data/menu";
import { useState, useEffect, useMemo } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function MenuManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [menuItem, setMenuItem] = useState<MenuItemType[]>([]);
    const [activeTab, setActiveTab] = useState< 'Available' | 'Unavailable' >('Available');
    const [search, setSearch] = useState("");

    useEffect( () => {
        const fetchMenu = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("MenuItems");
                const storageMenu: MenuItemType[] = jsonValue != null ? JSON.parse(jsonValue) : null;

                console.log(`Total items loaded into state: ${storageMenu.length}`);

                setMenuItem(storageMenu)

            } catch (e) {
                console.error(`failed to fetch menu: ${e}`);
            }
        }

        fetchMenu();

    }, [menu])

    useEffect( () => {
        const storeMenu = async () => {
            try {
                const jsonValue = JSON.stringify(menuItem);
                await AsyncStorage.setItem("MenuItems", jsonValue);
            } catch (e) {
                console.error(`failed to store menu: ${e}`);
            } 
        }

        storeMenu(); 
    
    }, [menuItem])

    const filteredMenu = useMemo( () => {

        const tabFiltered = menuItem.filter( item => {
            return (activeTab === 'Available') ? item.isAvailable : !item.isAvailable;
        })

        if (search.trim().length > 0) {
            const lowerCaseQuery = search.toLowerCase();
            return tabFiltered.filter(item => Object.keys(item).includes(lowerCaseQuery))
        }

        console.log(`tab filtered: ${tabFiltered}`)

        return tabFiltered;

    }, [menuItem, activeTab, search])

    const toggleUnavailable = () => {
        //TODO: finish this 
        // PURPOSE: mark unavailable and vice versa
    };

    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            <View style={{ flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
            <Text style={ styles.title }>Menu Management</Text>
            </View>
            <View style={ styles.buttonContainer }>
                <CustomButton
                    title='Available'
                    onPress={() => {setActiveTab('Available')}}
                    textStyle={activeTab === 'Available' ? { color: 'white' } : { color: 'black' }}
                    style={[ styles.pageButton, activeTab === 'Available' ? styles.activeButton : styles.inactiveButton]}
                />
                <CustomButton
                    title='Unavailable'
                    onPress={() => {setActiveTab('Unavailable')}}
                    textStyle={activeTab === 'Unavailable' ? { color: 'white' } : { color: 'black' }}
                    style={[ styles.pageButton, activeTab === 'Unavailable' ? styles.activeButton : styles.inactiveButton]}
                />
                <View style={styles.searchContainer}>
                    <Entypo name="magnifying-glass" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search by item name"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>


            {showSidebar && (
                <CustomSidebar onClose = { () => setShowSidebar(false) } />
            )}
        </View> 
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:'white',
        marginHorizontal:35,
        padding: 10

    },
     menuButton: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5
    },
    buttonContainer: { 
        flexDirection:'row',
        backgroundColor:'black',
    },
    pageButton: {
        marginHorizontal: 4, 
        marginVertical: 8, 
    },
    activeButton: {
        backgroundColor: '#4CAF50'
        
    },
    inactiveButton: {
        backgroundColor: 'white'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchIcon: {
        marginRight: 8,
        color: '#999',
    },
});