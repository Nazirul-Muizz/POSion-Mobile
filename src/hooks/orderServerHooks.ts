import { fetchOrder, fetchOrderItem, mutateOrderStatus } from "@/api/orderServices";
import { OrderProps } from "@/types/OrderType";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRealtimeQuery } from "./realtimeHook";

export const useOrderItemQuery = (orderId: string) => {
    const { data: orderItemQuery } = useQuery({
        queryKey: ['queriedItem', orderId],
        queryFn: () => fetchOrderItem(orderId),
        enabled: !!orderId
    })

    return orderItemQuery;
};

export const useOrdersQuery = () => {
    const { data:ordersQuery, isLoading } = useQuery({
        queryKey: ['queriedOrders'],
        queryFn: fetchOrder,
        staleTime: 60 * 1000
    });

    const tableName = 'restaurant_order';

    useRealtimeQuery(['queriedOrders'], tableName);

    return {ordersQuery, isLoading};
};

export const useMutateOrderStatus = () => {
    const {mutate: updateOrderStatus, isSuccess, isError, isPending} = useMutation({
        mutationFn: ({orderId, state}:{orderId: string, state: boolean}) => mutateOrderStatus({orderId, state}),

        onSuccess: () => {
            console.log('order is successfully marked prepared');
        },

        onError: (error) => {
            console.log('error marking order as prepared: ', error);
        }
    })

    return {
        updateOrderStatus, isSuccess, isError, isPending
    }
};

export const useOrderFilter = (orders: OrderProps[] | [] | undefined) => {

    const {activeOrders, inactiveOrders} = useMemo( () => {
        const safeOrders = orders || [];

        const inactiveOrders = safeOrders.filter( order => order.is_prepared === true );
        const activeOrders = safeOrders.filter( order => order.is_prepared === false );

        console.log('active orders: ', JSON.stringify(activeOrders, null, 2));
        console.log('inactive orders: ', JSON.stringify(inactiveOrders, null, 2));

        return { activeOrders, inactiveOrders }

    }, [orders]);

    return { activeOrders, inactiveOrders };
}






