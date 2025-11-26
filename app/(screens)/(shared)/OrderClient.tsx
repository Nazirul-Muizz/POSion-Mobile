import ConfigPopup from "@/component/ConfigPopup";
import CustomButton from "@/component/CustomButton";
import CustomDropdown from "@/component/CustomDropdown";
import FooterCart from "@/component/FooterCart";
import AnimatedPressableIcon from "@/component/InteractivePressable";

import { carb } from "@/constants/Carb";
import { dineOption } from "@/constants/DineOptions";

import { CartItem, CatProps, DrinksCategoryProps, FoodCategoryProps, OrderItemState } from "@/types/OrderType";

import { useMenuItemQuery, useTableQuery } from "@/hooks/MenuHook";
import { useSubmitOrder } from "@/hooks/OrderHook";
import { MenuType } from "@/services/menuServices";
import { useDropdownStore, useOrderItemStore } from "@/store/StatesStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function AddOrder() {
    const [currentCat, setCurrentCat] = useState<CatProps>('Makanan');
    const [currentSubCat, setSubCurrentCat] = useState<FoodCategoryProps | DrinksCategoryProps>('Mee Bandung');
    const [showPopupConfig, setShowPopupConfig] = useState(false);
    const [orderItem, setOrderItem] = useState<OrderItemState | null>(null);
    const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

    //global states: import from zustand store
    const { selectedCarb, setSelectedCarb, comment, setComment } = useOrderItemStore(); 
    const { selectedOption, setSelectedOption } = useDropdownStore();

    const [cart, setCart] = useState<CartItem[]>([]);

    const { handleSubmit } = useSubmitOrder(cart);

    // custom hook
    const tableNumber = useTableQuery();
    const filteredMenu = useMenuItemQuery(currentSubCat);


    const handleQuantityChange = useCallback( (item: MenuType, increment: boolean,) => {
        const itemId = item.menu_id.toString();

        setOrderQuantities(previousQuantities => {
            const currentQuantity = previousQuantities[itemId] ?? 0;
            const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

            const updated = { ...previousQuantities };
            if (newQuantity > 0) updated[itemId] = newQuantity;
            else delete updated[itemId];
            return updated;
            });

        setCart(prevCart => {
            const index = prevCart.findIndex(c => c.menu_id === item.menu_id);
            if (increment) {
                if (index === -1) {
                    // Add a new unit
                    return [...prevCart, {
                        ...item,
                        selectedCarb: "",
                        comment: "",
                        quantity: 1
                    }];
                } else {
                // item exists => increment
                const newCart = [...prevCart];
                newCart[index] = {
                    ...newCart[index],
                    quantity: newCart[index].quantity + 1
                };
                return newCart;
                }
            } 
            
            // Remove a unit - FILO
            const reversedIndex = [...prevCart]
                .reverse()
                .findIndex(c => c.menu_id === item.menu_id);

            if (reversedIndex !== -1) {
                const actualIndex = prevCart.length - 1 - reversedIndex;
                const newCart = [...prevCart];
                newCart.splice(actualIndex, 1);
                return newCart;
            }

            return prevCart;
        });

        
    }, []);

    const handleConfirmPress = () => { 
        if ((orderItem?.category_name === 'Bakso' || orderItem?.category_name === 'Sup') && !selectedOption['carbo']) {
            Alert.alert('Ralat', 'Sila pilih 1 (mee kuning/nasi putih/nasi impit/bihun)');
            return;
        }
        
        if (orderItem) {
            const carbOption = selectedOption['carbo'] || "";
            handleQuantityChange(orderItem, true);

            setCart(prev => {
                const reversedIndex = [...prev]
                    .reverse()
                    .findIndex(i => i.menu_id === orderItem.menu_id);

                if (reversedIndex === -1) return prev;

                const actualIndex = prev.length - 1 - reversedIndex;

                const newCart = [...prev];
                newCart[actualIndex] = {
                    ...newCart[actualIndex],
                    selectedCarb: carbOption,
                    comment: comment
                };

                console.log("Cart (INSIDE CART SETTER):", JSON.stringify(newCart, null, 2));
                return newCart;
            });

        }   
        
        // reset after confirm
        setSelectedCarb('');
        setComment('')

        setSelectedOption('carbo', '');

        setShowPopupConfig(false);            
    }

    // necessary to display the quantity into the flatlist
    const menuItemsWithOrder: OrderItemState[] = useMemo( () => {
        return (filteredMenu || []).map( item => ({
            ...item,
            quantity: orderQuantities[item.menu_id.toString()] || 0
        }))
    }, [filteredMenu, orderQuantities]);

    //console.log(filteredMenu);
    //#fffbe6
    const handlePress = (subCat: FoodCategoryProps | DrinksCategoryProps) => {
        setSubCurrentCat(subCat);
    }

    useEffect( () => {
        currentCat === 'Makanan' ? setSubCurrentCat('Mee Bandung') : setSubCurrentCat('Minuman Panas')
    }, [currentCat]);

    const renderItem = ({item}:ListRenderItemInfo<OrderItemState>) => {
        const noConfig = ['Add Ons'].includes(item.category_name);

        const handlePlusPress = () => {
            if (!noConfig) {
                setShowPopupConfig(true)
                setOrderItem(item);
            } 
            else handleQuantityChange(item, true);
        }

        const currentQuantity = item.quantity ?? 0;

        return (
            <View style={ styles.menuItem }>

                <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#D3EADA', borderRadius:10}}>
                    <Text style={{textAlign:'center',}}>{currentQuantity}</Text>
                </View>

                <View
                    style={{
                        width: 1,
                        backgroundColor: "#D3D3D3",
                        marginHorizontal: 5,
                        alignSelf: "stretch"   // KEY PART → full height
                    }}
                />

                <View style={{flex: 5, alignSelf: 'center'}}>
                    <Text style={{fontWeight:'bold'}}>{item.menu_item}</Text>
                    <Text style={{fontSize:12, }}>RM {item.price.toFixed(2)}</Text>
                </View>

                <View style={{flex:1, flexDirection:'column', }}>
                    <TouchableOpacity 
                        onPress={handlePlusPress}
                        style={{ borderWidth: 1, borderColor:'#CBE6FF', backgroundColor:'#CBE6FF', borderStyle:'solid', justifyContent:'center', alignItems:'center', width:'100%', paddingVertical:5}}
                    >
                        <AntDesign name="plus" size={20} color="black" />
                    </TouchableOpacity>

                    {/* {must turn disabled true if quantity = 0} */}
                    <TouchableOpacity 
                        onPress={() => handleQuantityChange(item, false)} 
                        disabled={currentQuantity <= 0} 
                        style={[
                            { borderWidth: 1, borderColor:'#FFA7A6', backgroundColor:'#FFA7A6', borderStyle:'solid', justifyContent:'center', alignItems:'center', width:'100%', paddingVertical:5 },
                            currentQuantity <= 0 && { opacity: 0.5 } // visual feedback when disabled
                        ]}
                    >
                        <AntDesign name="minus" size={20} color="black" />
                    </TouchableOpacity>
                </View>

            </View>    
        )
    }

    return (
        <View style={ styles.mainContainer}>

            <View style={ styles.headerContainer }>

                <View style={{flex:2}}>
                    <CustomDropdown id="dine option" data={dineOption} initialState="Makan/Bungkus"/>
                </View>

                <View style={{flex:1.5}}>
                    <CustomDropdown id="table number" data={tableNumber} initialState="Pilih Meja"/>
                </View>
                
                <View style={{flex:2}}>
                    <CustomButton 
                        title="Hantar"  
                        onAnimationComplete={handleSubmit}
                        style={{borderWidth:2, borderColor:'black', marginVertical:10, marginHorizontal:10, alignSelf:'flex-end'}}
                    />
                </View>
            </View>

            <View style={ styles.bodyContainer }>

                <View style={ styles.fixedSidebarContainer }>
                    {currentCat === 'Makanan' ? 
                        <View style={ styles.subCatContainer }>
                            <AnimatedPressableIcon 
                                IconComponent={MaterialCommunityIcons} 
                                buttonName="noodles" title="Mee Bandung" 
                                handlePress={() => handlePress('Mee Bandung')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Mee Bandung'}
                                style={ styles.subCatIcon}
                            />

                            <AnimatedPressableIcon 
                                IconComponent={MaterialIcons} 
                                buttonName="soup-kitchen" 
                                title="Aneka Sup" handlePress={() => handlePress('Sup')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Sup'}
                                style={ styles.subCatIcon}
                            />

                            <AnimatedPressableIcon 
                                IconComponent={MaterialCommunityIcons} 
                                buttonName="food-takeout-box" 
                                title="Bakso" handlePress={() => handlePress('Bakso')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Bakso'}
                                style={ styles.subCatIcon}
                            />

                            <AnimatedPressableIcon 
                                IconComponent={MaterialCommunityIcons} 
                                buttonName="food-drumstick" title="Western" 
                                handlePress={() => handlePress('Western')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Western'}
                                style={ styles.subCatIcon}
                            />

                            <AnimatedPressableIcon 
                                IconComponent={FontAwesome6} 
                                buttonName="bowl-food" title="Add Ons" 
                                handlePress={() => handlePress('Add Ons')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Add Ons'}
                                style={ styles.subCatIcon}
                            />

                        </View> :

                        <View style={ styles.subCatContainer }>

                            <AnimatedPressableIcon 
                                IconComponent={FontAwesome5} 
                                buttonName="mug-hot" title="Minuman Panas" 
                                handlePress={() => handlePress('Minuman Panas')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Minuman Panas'}
                                style={ styles.subCatIcon}
                            />

                            <AnimatedPressableIcon 
                                IconComponent={FontAwesome5} 
                                buttonName="snowflake" title="Minuman Sejuk" 
                                handlePress={() => handlePress('Minuman Sejuk')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Minuman Sejuk'}
                                style={ styles.subCatIcon}
                            />                    

                            <AnimatedPressableIcon 
                                IconComponent={MaterialCommunityIcons} 
                                buttonName="fruit-watermelon" title="Jus Buah-Buahan" 
                                handlePress={() => handlePress('Jus Buah-Buahan')} 
                                textStyle={ styles.subCatText }
                                isActive= {currentSubCat === 'Jus Buah-Buahan'}
                                style={ styles.subCatIcon}
                            />  


                        </View>
                    }
                </View>

                <View style={{flex:7, flexDirection:'column'}}>

                    <View style={ styles.subHeaderContainer }>
                        <CustomButton 
                            title="Makanan" 
                            onPress={() => setCurrentCat('Makanan')} 
                            textStyle={currentCat === 'Makanan' ? { color: 'white' } : { color: 'black' }} 
                            style={[styles.catButtonContainer, currentCat === 'Makanan' ? styles.activeCatButton: styles.inactiveCatButton]}
                        />
                        <CustomButton 
                            title="Minuman" 
                            onPress={() => setCurrentCat('Minuman')} 
                            textStyle={currentCat === 'Minuman' ? { color: 'white' } : { color: 'black' }} 
                            style={[styles.catButtonContainer, currentCat === 'Minuman' ? styles.activeCatButton: styles.inactiveCatButton]}
                        />
                    </View>

                    <FlatList 
                        data={menuItemsWithOrder}
                        keyExtractor={item => item.menu_id.toString()}
                        renderItem={renderItem}
                        style={{flex: 1, marginVertical: 10}}
                        contentContainerStyle={{ paddingBottom: 450 }}
                    />

                    {showPopupConfig && (
                        <ConfigPopup
                            visible={showPopupConfig} //TODO: visibile depends on onConfirm key. When user click confirm, it must return false
                            onCancel={() => setShowPopupConfig(false)}
                            onConfirm={() => handleConfirmPress()}
                            title="Tambah Item"
                        >
                            { (currentSubCat === 'Sup' || currentSubCat === 'Bakso') && (
                                <View>
                                    <Text style={{fontWeight:'bold'}}>Nak makan dengan apa?</Text>
                                    <CustomDropdown
                                        id="carbo"
                                        data={carb}
                                        initialState="Pilih satu" 
                                    />
                                </View>
                                )
                            }

                            <View>
                                <Text style={{fontWeight:'bold', marginVertical: 3}}>Permintaan Pelanggan</Text>
                                <TextInput
                                    value={comment}                                    
                                    placeholder="contoh: nak pedas, kurang manis"
                                    style={{borderWidth:2, borderColor:'#D3D3D3', borderRadius: 10}}
                                    onChangeText={setComment}
                                />
                            </View>
                        </ConfigPopup>
                    )}

                </View>

            </View>

            {cart.length > 0 && <FooterCart />}
                    
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerContainer: {
        flexDirection:'row', 
        borderBottomWidth:5, 
        borderBottomColor:'#D3D3D3', 
        //justifyContent:'space-evenly',
        backgroundColor:'#fffbe6'
    },
    subHeaderContainer: {backgroundColor:'white', 
        flexDirection:'row', 
        justifyContent:'center', 
        gap:7, 
        borderBottomWidth:5, 
        borderBottomColor:'#D3D3D3'
    },
    bodyContainer: { flexDirection: 'row'},

    activeCatText: { color: 'white'},
    inactiveCatText: { color: 'black' },
    activeCatButton: { backgroundColor:'#4CAF50' },
    inactiveCatButton: { backgroundColor:'white'},

    catButtonContainer: {
        marginVertical:10,
        borderWidth:3, 
        borderColor:'#D3D3D3' 
    },

    fixedSidebarContainer: {
        flexDirection:'column', 
        flex:1.5, 
        borderRightWidth:5, 
        borderColor:'#D3D3D3', 
        height:1024, 
        backgroundColor: '#fffbe6' 
    },

    subCatContainer: {
        gap: 30,
        marginTop: 80
    },
    subCatIcon: {
        alignSelf: 'center'
    },
    subCatText: {
        fontSize: 12,
        textAlign: 'center'
    },

    menuItem: {
        backgroundColor:'white', 
        borderWidth:3, 
        borderColor:'#D3D3D3', 
        borderRadius:10, 
        margin:10,
        gap:5,
        flexDirection: 'row',
        padding: 10
    }
    
})