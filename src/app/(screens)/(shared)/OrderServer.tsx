import CustomButton from "@/component/CustomButton";
import LoadingSpinner from "@/component/FullPageSpinner";
import MainTemplate from "@/component/MainPagesTemplate";
import ModalSpinner from "@/component/ModalSpinner";
import { RenderOrder } from "@/component/Order";
import { useMutateOrderStatus, useOrderFilter, useOrdersQuery } from "@/hooks/orderServerHooks";
import { OrderProps } from "@/types/OrderType";
import { useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";

export default function OrderManagement() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<'Semasa' | 'Terdahulu'>('Semasa');
    const { ordersQuery, isLoading } = useOrdersQuery();
    const { updateOrderStatus, isPending } = useMutateOrderStatus();

    console.log('orders in Order Server: ', JSON.stringify(ordersQuery, null, 2));

    const { activeOrders, inactiveOrders } = useOrderFilter(ordersQuery);

    if (isLoading) {
        return <LoadingSpinner message="Memuatkan pesanan..."/>;
    }

    if (isPending) {
        return <ModalSpinner message="Mengemas kini status pesanan..."/>;
    }

    const renderItem = ({item}: ListRenderItemInfo<OrderProps>) => {
        return (
           <RenderOrder
                order={item}
                updateOrderStatus={updateOrderStatus} 
           />
        )
    }

    return (
        <MainTemplate
            title="Pesanan"
            openSidebar={setShowSidebar}
            sidebar={showSidebar}
        >
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
                    title="Terdahulu" 
                    onPress={() => setActiveTab('Terdahulu')} 
                    textStyle={ activeTab === 'Terdahulu' ? { color: 'white' } : { color: 'black' }}
                    style={[
                        styles.pageButton, 
                        (activeTab === 'Terdahulu' ? styles.activeButton : styles.inactiveButton)
                    ]}
                />
            </View>

            <FlatList
                data={ activeTab === 'Semasa' ? activeOrders : inactiveOrders }
                keyExtractor={item => item.order_id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 150 }}
                style={{gap: 10, marginVertical: 10}} 
            />

        </MainTemplate>

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
        borderWidth: 2,
        borderColor:'white' 
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
        fontSize: 17,
        color: 'black',
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