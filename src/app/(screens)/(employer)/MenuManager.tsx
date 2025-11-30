import CustomButton from "@/component/CustomButton";
import FullPageSpinner from "@/component/FullPageSpinner";
import Menu from "@/component/menu/Menu";
import { useMenuSections, useShowFilteredMenu } from "@/hooks/menuHook";
import { MenuItem } from "@/types/MenuType";
import { useState } from "react";
import { ListRenderItemInfo, SectionList, StyleSheet, Text, TextInput, View } from "react-native";

import MainTemplate from "@/component/MainPagesTemplate";
import Entypo from '@expo/vector-icons/Entypo';

export default function MenuManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState< 'Ada' | 'Tiada' >('Ada');
    const [search, setSearch] = useState("");
    const { menuList, isMenuLoading, isMenuFetching } = useMenuSections();
    const filteredSections = useShowFilteredMenu({menuList, activeTab, search});

    //console.log(`filtered sections: ${JSON.stringify(filteredSections)}`);

    if (isMenuLoading || isMenuFetching) {
        return <FullPageSpinner message="Memuatkan menu..." />
    }

    const renderItem = ({item: row}: ListRenderItemInfo<MenuItem[]>) => {
        if (!Array.isArray(row)) return null;
        //console.log(`menu id from render item: ${item.menu_id}`)
        return (
            <Menu row={row} activeTab={activeTab} />
        );
    };


    return (
        <MainTemplate
            title="Pengurusan Menu"
            openSidebar={setShowSidebar}
            sidebar={showSidebar}
        >
            <View style={styles.searchContainer}>
                    <Entypo name="magnifying-glass" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Cari melalui nama item"
                        placeholderTextColor={'black'}
                        value={search}
                        onChangeText={setSearch}
                        style={{justifyContent:'center', color:'black'}}
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
                keyExtractor={(item) => item[0]?.menu_id?.toString() || Math.random().toString()}
                ListEmptyComponent={
                    () => activeTab === 'Ada' ? <Text style={{color:'white', textAlign: 'center'}}>Semua item tidak tersedia</Text> 
                    : <Text style={{color:'white', textAlign:'center'}}>Semua item tersedia</Text>
                }
                contentContainerStyle={{paddingBottom:80}}
            />

        </MainTemplate>
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
});

const headerStyles = StyleSheet.create({
    headerContainer: {
        marginVertical: 5,
        marginLeft: 10,
        marginBottom: 10
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10
    },
});