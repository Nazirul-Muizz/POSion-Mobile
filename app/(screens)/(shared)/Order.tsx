import { StyleSheet, View, Text, TouchableOpacity, StatusBar, FlatList, ListRenderItemInfo, TextStyle } from "react-native";
import { useAuth } from "@/context/authContext";
import { useEffect, useMemo, useState } from "react";
import CustomSideBar from "@/component/CustomSidebar";
import Entypo from '@expo/vector-icons/Entypo';
import Animated, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { order } from "@/data/order";
import CustomButton from "@/component/CustomButton";
import { registerForPushNotificationsAsync, scheduleNewOrderNotification } from "@/component/PushNotification";

interface OrderItemType {
    id: number,
    item: string,
    comment: string | null,
    isPrepared: boolean
}

export default function OrderManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [orderItem, setOrderItem] = useState<OrderItemType[]>([]);
    const [activeTab, setActiveTab] = useState<'current' | 'logs'>('current');

    const profile = useAuth();
    const userName = profile.user?.name;

    console.log(`user name: ${userName}`);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("OrderItem");
                let storageOrder: OrderItemType[] = jsonValue != null ? JSON.parse(jsonValue) : null;

                const newOrders = order.filter(item => 
                    !storageOrder.some(storedItem => storedItem.id === item.id)
                )

                if (newOrders.length > 0) {

                    scheduleNewOrderNotification(newOrders.length)
                    // Merge new orders with stored orders (if storage was NOT empty)
                    if (jsonValue != null) storageOrder = [...storageOrder, ...newOrders];
                    
                    // 3. Save the merged list back to storage immediately
                    const jsonValueMerged = JSON.stringify(storageOrder);
                    await AsyncStorage.setItem("orderItem", jsonValueMerged);
                }

                const finalOrderList = storageOrder.sort((a, b) => a.id - b.id);

                setOrderItem(finalOrderList);

                console.log(`Total items loaded into state: ${finalOrderList.length}`);

            } catch(e) {
                console.error(e);
                setOrderItem(order.sort((a, b) => a.id - b.id));
            }
        }

        fetchData();

    }, [order])

    useEffect( () => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(orderItem.sort((a, b) => a.id - b.id));
                await AsyncStorage.setItem("OrderItem", jsonValue);
            } catch(e) {
                console.error(e)
            }
        }

        if (orderItem.length > 0) storeData();

    }, [orderItem])

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    const filteredOrders = useMemo( () => {
        let result: OrderItemType[] = [];

        if (activeTab === 'current') return orderItem.filter(item => item.isPrepared === false)
        else if (activeTab === 'logs') return orderItem.filter(item => item.isPrepared === true)

        console.log(`Filtered items showing on '${activeTab}' tab: ${result.length}`);
        return result;

    }, [orderItem, activeTab])

    // Function to handle marking an item as prepared (for the button action)
    const togglePrepared = (id: number) => {
        setOrderItem(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, isPrepared: !item.isPrepared } : item
            )
        );
    };

    const renderItem = ( {item}: ListRenderItemInfo<OrderItemType> ) => {
        const cardStyle = item.isPrepared ? styles.logCard : styles.orderCard;
        const buttonTitle = item.isPrepared ? "Undo Log" : "Mark Prepared";
        
        return (
            <View style={cardStyle}>
                <View style={styles.cardHeader}>
                    <Text style={styles.orderItemName}>Order #{item.id}: {item.item}</Text>
                    <Text style={[
                        styles.orderItemStatus, 
                        { color: item.isPrepared ? '#4CAF50' : '#FF9800' } // Green for log, Orange for current
                    ]}>
                        {item.isPrepared ? "LOGGED" : "PENDING"}
                    </Text>
                </View>
                <Text style={styles.orderItemComment}>Comment: {item.comment || "None"}</Text>
                
                {/* Action button */}
                <TouchableOpacity 
                    onPress={() => togglePrepared(item.id)}
                    style={[
                        styles.actionButton, 
                        { backgroundColor: item.isPrepared ? '#FF5733' : '#4CAF50' } // Red for undo, Green for complete
                    ]}
                    >
                    <Text style={styles.actionButtonText}>
                        {buttonTitle}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    

    return (
        <View style={{ flex:1, backgroundColor:'black'}}>
            <View style={{ flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
                <Text style={ styles.title } >Order Management</Text>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="Current" 
                    onPress={() => setActiveTab('current')}  
                    textStyle={ activeTab === 'current' ? { color: 'white' } : { color: 'black' }}
                    style={[
                        styles.pageButton, 
                        activeTab === 'current' ? styles.activeButton : styles.inactiveButton
                    ]}
                />
                <CustomButton 
                    title="Logs" 
                    onPress={() => setActiveTab('logs')} 
                    textStyle={ activeTab === 'logs' ? { color: 'white' } : { color: 'black' }}
                    style={[
                        styles.pageButton, 
                        (activeTab === 'logs' ? styles.activeButton : styles.inactiveButton)
                    ]}
                />
            </View>

            <Animated.FlatList 
                // Pass the computed filtered list here
                data={filteredOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                        {activeTab === 'current' 
                            ? "Great job! No current pending orders."
                            : "No orders have been logged yet."
                        }
                    </Text>
                )}
            /> 

            {showSidebar && (
                <CustomSideBar onClose = { () => setShowSidebar(false) } />
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: { 
        flexDirection:'row',
        backgroundColor:'black',

    },
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:'white',
        marginHorizontal:35,
        padding: 10

    },
    subtitle: {
        fontSize:15,
        color:'black',
        marginBottom:10,
    },
    menuButton: {
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5
    },
    // STYLES for the tab buttons
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
    listContainer: {
        padding: 10,
    },
    orderCard: {
        // Style for CURRENT orders (Pending)
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#FF9800', // Orange border
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    logCard: {
        // Style for LOGS (Prepared)
        backgroundColor: '#e8f5e9', // Very light green background
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50', // Green border
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderItemComment: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    orderItemStatus: {
        fontSize: 14,
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
     actionButton: {
        marginTop: 10, 
        paddingVertical: 8, // Slightly less padding than CustomButton
        borderRadius: 6,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white', 
        fontWeight: '600',
        fontSize: 14, // Smaller font size for list item action
    },
});