import CustomButton from "@/component/CustomButton";
import CustomSidebar from "@/component/CustomSidebar";
import FullPageSpinner from "@/component/FullPageSpinner";
import { useMenuSections } from "@/hooks/MenuHook";
import { useMemo, useState } from "react";
import { ListRenderItemInfo, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type MenuItem = {
    menu_id: number,
    menu_item: string,
    isAvailable: boolean
}

export default function MenuManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState< 'Ada' | 'Tiada' >('Ada');
    const [search, setSearch] = useState("");
    const { menuList, isMenuLoading, isMenuFetching } = useMenuSections();

    const filteredSections = useMemo(() => {
        if (!Array.isArray(menuList)) return [];

        menuList.forEach(section => {
            console.log("SECTION:", section.title);

            const items = Array.isArray(section.data) ? section.data : [];

            items.forEach(item => {
                console.log(
                    "ITEM:", item.menu_item,
                    "| isAvailable:", item.isAvailable,
                    "| TYPE:", typeof item.isAvailable
                );
            });
        });

        const searchStatement = search.trim().toLowerCase();

        const checkAvailability = activeTab === 'Ada'

        //console.log("menuList:", JSON.stringify(menuList, null, 2));

        return menuList

        .map(section => {
            const items = Array.isArray(section.data) ? section.data : [];

            const filteredData = items.filter( item => {
                if (!item) return false;
                const matchedSearches = searchStatement === '' || (typeof item.menu_item === 'string' && item.menu_item.toLowerCase().includes(searchStatement));
                const matchAvailability = item.isAvailable === checkAvailability;
                return matchedSearches && matchAvailability;
            })

            return {...section, data: filteredData}
        })

        .filter(section => section.data.length > 0)

    }, [menuList, search, activeTab])


    const renderItem = ({item}: ListRenderItemInfo<MenuItem>) => {
        //console.log(`menu id from render item: ${item.menu_id}`)
        return (
            <View style={ styles.menuItemContainer }>
                <Text style={{flex:8, color:'white', marginVertical: 10, fontSize:16}}>{item.menu_item}</Text>
                {activeTab === 'Ada' ? (
                    <View style={{flex:1}}>
                    <TouchableOpacity style={{ }} onPress={() => {}}>
                        <FontAwesome name="remove" size={22} color="red" style={ styles.operationIcons } />
                        {/* <Text style={{color:'black', fontSize:10,  flexShrink:1, flexGrow:1, flexBasis:'0%'}}>Tanda Tiada</Text> */}
                    </TouchableOpacity>
                    </View>
                ) :
                <View style={{flex:1}}>
                    <TouchableOpacity>
                        <FontAwesome6 name="add" size={22} color="green" style={ styles.operationIcons}/>
                        {/* <Text style={{color:'black', fontSize:10}}>Tanda Ada</Text> */}
                    </TouchableOpacity>
                </View>
                }
            </View>
        )
    }


    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            {isMenuLoading || isMenuFetching && ( <FullPageSpinner message="Loading menu from database..."/> ) }
            <View style={{flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
            <Text style={ styles.title }>Pengurusan Menu</Text>
            </View>
            <View style={styles.searchContainer}>
                    <Entypo name="magnifying-glass" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Cari melalui nama item"
                        value={search}
                        onChangeText={setSearch}
                        style={{justifyContent:'center'}}
                    />
            </View>
            <View style={ styles.buttonContainer }>
                <CustomButton
                    title='Ada'
                    onPress={() => {setActiveTab('Ada')}}
                    textStyle={activeTab === 'Ada' ? { color: 'white' } : { color: 'black' }}
                    style={[ styles.pageButton, activeTab === 'Ada' ? styles.activeButton : styles.inactiveButton]}
                />
                <CustomButton
                    title='Tiada'
                    onPress={() => {setActiveTab('Tiada')}}
                    textStyle={activeTab === 'Tiada' ? { color: 'white' } : { color: 'black' }}
                    style={[ styles.pageButton, activeTab === 'Tiada' ? styles.activeButton : styles.inactiveButton]}
                />

            </View>

            <SectionList 
                sections={filteredSections}
                renderItem={renderItem}
                renderSectionHeader={ ({section}) => {
                    return (
                        <View style={ headerStyles.headerContainer }>
                            <Text style={ headerStyles.headerTitle }>{section.title}</Text>
                        </View>
                    )
                }}
                keyExtractor={(item) => item.menu_id?.toString()}
                ListEmptyComponent={() => activeTab === 'Ada' ? <Text style={{color:'white', textAlign: 'center'}}>Semua item tidak tersedia</Text> 
                : <Text style={{color:'white', textAlign:'center'}}>Semua item tersedia</Text>}
                contentContainerStyle={{paddingBottom:80}}
            />


            {showSidebar && (
                <CustomSidebar onClose = { () => setShowSidebar(false) }>
                    {/* add item and remove item specific only for menu manager */}
                </CustomSidebar>
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
        height: 55
    },
    pageButton: {
        marginHorizontal: 3, 
        marginVertical: 7, 
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
        marginHorizontal: 5,
        marginVertical: 8,
        borderRadius: 8,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchIcon: {
        marginRight: 8,
        color: '#999',
    },
    menuItemContainer: {
        borderBottomWidth: 1,
        width: '100%',
        borderBottomColor: 'white',
        flexDirection: 'row',
    },
    operationIcons: {
        marginTop:5, 
        borderWidth:3, 
        borderColor:'white', 
        borderRadius: 40,
        backgroundColor: 'white',
        marginRight: 10,
        marginLeft: 3,
        // margin:6
        paddingLeft: 1.5
    }
});

const headerStyles = StyleSheet.create({
    headerContainer: {
        marginVertical: 3
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10
    },
})