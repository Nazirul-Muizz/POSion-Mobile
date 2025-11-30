
import { useTimeAgo } from "@/hooks/timeHook";
import { OrderProps } from "@/types/OrderType";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DisplayItemPopup from "./DisplayItemPopup";

interface OrderDetailsProps {
    order: OrderProps;
    updateOrderStatus: (vars: {orderId: string, state: boolean}) => void;
}

export const RenderOrder =  ({order, updateOrderStatus}: OrderDetailsProps) => {
    const cardStyle = order.is_prepared ? styles.logCard : styles.orderCard;
    const buttonTitle = order.is_prepared ? "Undur Semula" : "Tanda Siap";
    const timeAgoString = useTimeAgo(String(order.created_at));
    const [showOrderItems, setShowOrderItems] = useState(false);

    return (
        <View style={cardStyle}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderItemName}>{order.order_id}</Text>
                <Text style={[
                    styles.orderItemStatus, 
                    { color: order.is_prepared ? '#4CAF50' : '#FF9800' } // Green for log, Orange for Semasa
                ]}>
                    {/* {order.is_prepared ? "LOGGED" : "PENDING"} */}
                    {timeAgoString}
                </Text>
            </View>
            <Text style={styles.orderItemName}>{order.dine_option}</Text>
            <Text style={styles.orderItemName}>Meja {order.table_id}</Text>

            <TouchableOpacity
                onPress={() => setShowOrderItems(true)}
                style={[styles.actionButton, { backgroundColor: 'blue', marginBottom: 5 }]}
            >
                <Text style={styles.actionButtonText}>
                    Lihat order
                </Text>
            </TouchableOpacity>

            {/* Action button */}
            <TouchableOpacity 
                onPress= {
                    () => updateOrderStatus({orderId: order.order_id, state: !order.is_prepared})
                }
                style={[
                    styles.actionButton, 
                    { backgroundColor: order.is_prepared ? '#FF5733' : '#4CAF50' } // Red for undo, Green for complete
                ]}
                >
                <Text style={styles.actionButtonText}>
                    {buttonTitle}
                </Text>
            </TouchableOpacity>

            {showOrderItems && (
                <DisplayItemPopup 
                    visible={showOrderItems}
                    orderId={order.order_id}
                    onClose={() => setShowOrderItems(false)}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({ 
    orderCard: {
        // Style for CURRENT orders (Pending)
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        marginVertical:10,
        borderLeftWidth: 5,
        borderLeftColor: '#FF9800', // Orange border
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        width: '95%',
        marginHorizontal: '2.5%',
    },
    logCard: {
        // Style for Log (Prepared)
        backgroundColor: '#e8f5e9', // Very light green background
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        marginVertical: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50', // Green border
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        width: '95%',
        marginHorizontal: '2.5%',
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
})