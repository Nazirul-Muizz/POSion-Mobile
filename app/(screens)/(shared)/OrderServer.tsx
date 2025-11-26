import CustomButton from "@/component/CustomButton";
import CustomSideBar from "@/component/CustomSidebar";
import { registerForPushNotificationsAsync } from "@/component/PushNotification";
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useMemo, useState } from "react";
import { ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from 'react-native-reanimated';

interface OrderItemType {
    id: number,
    item: string,
    comment: string | null,
    isPrepared: boolean
}

export default function OrderManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [orderItem, setOrderItem] = useState<OrderItemType[]>([]);
    const [activeTab, setActiveTab] = useState<'Semasa' | 'Log'>('Semasa');

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    const filteredOrders = useMemo( () => {
        let result: OrderItemType[] = [];

        if (activeTab === 'Semasa') return orderItem.filter(item => item.isPrepared === false)
        else if (activeTab === 'Log') return orderItem.filter(item => item.isPrepared === true)

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
                        { color: item.isPrepared ? '#4CAF50' : '#FF9800' } // Green for log, Orange for Semasa
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
                <Text style={ styles.title } >Pesanan</Text>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="Semasa" 
                    onPress={() => setActiveTab('Semasa')}  
                    textStyle={ activeTab === 'Semasa' ? { color: 'white' } : { color: 'black' }}
                    style={[
                        styles.pageButton, 
                        activeTab === 'Semasa' ? styles.activeButton : styles.inactiveButton
                    ]}
                />
                <CustomButton 
                    title="Log" 
                    onPress={() => setActiveTab('Log')} 
                    textStyle={ activeTab === 'Log' ? { color: 'white' } : { color: 'black' }}
                    style={[
                        styles.pageButton, 
                        (activeTab === 'Log' ? styles.activeButton : styles.inactiveButton)
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
                        {activeTab === 'Semasa' 
                            ? "Tiada pesanan baru buat masa ini"
                            : "Tiada pesanan dalam log"
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
        padding: 10,
        flex: 2

    },
    subtitle: {
        fontSize:15,
        color:'black',
        marginBottom:10,
    },
    menuButton: {
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5,
        flex: 1
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
        // Style for Log (Prepared)
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