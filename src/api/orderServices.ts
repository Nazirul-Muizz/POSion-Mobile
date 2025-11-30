import { OrderItemPayload, OrderProps } from "@/types/OrderType";
import { supabase } from "../../lib/supabase-client";

export const generateNumberOrder = async (): Promise<number> => {
    let { data, error } = await supabase
        .rpc('get_next_order_number')

    if (error) {
        console.error(error);
        throw new Error(`Failed to generate order number: ${error.message}`)
    }
    if (typeof data === 'number') {
        return data; 
    }

    throw new Error("RPC returned invalid data type for order number.");
}

export const mutateOrder = async ({order_id, table_id, dine_option, discount_id, created_at, total_price}: OrderProps) => {
    const { data, error } = await supabase 
        .from('restaurant_order')
        .insert([
            {order_id, table_id, dine_option, discount_id, created_at, total_price}
        ], {
            onConflict: 'order_id', // Target the table's primary key
            ignoreDuplicates: true
        } as any)
        .select();
    
    if (error) return {success:false, error: error.message}
    
    return {success: true, data}
}

export const mutateOrderItem = async (cart: OrderItemPayload[]) => {
    const { data, error } = await supabase 
        .from('restaurant_item')
        .insert(cart, {
            onConflict: 'item_id', // Target the table's primary key
            ignoreDuplicates: true
        } as any)
        .select();
    
    if (error) return {success:false, error: error.message}
    
    return {success: true, data}
}

export const fetchOrder = async (): Promise<OrderProps[] | []> => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoISO = oneMonthAgo.toISOString();

    const { data, error, } = await supabase
        .from('restaurant_order')
        .select('*')
        .gte('created_at', oneMonthAgoISO)
    
    if (error) throw new Error(error.message)

    return data as OrderProps[];
}

export const fetchOrderItem = async (orderId: string): Promise<OrderItemPayload[] | []> => {
    const { data, error, } = await supabase
        .from('restaurant_item')
        .select('*')
        .eq('order_id', orderId)
    
    if (error) throw new Error(error.message)

    return data as OrderItemPayload[];
}

export const mutateOrderStatus = async ({orderId, state}: {orderId: string, state: boolean}) => {
    const { data, error } = await supabase
        .from('restaurant_order')
        .update({ "is_prepared": state })
        .eq('order_id', orderId)
        .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
        // Throw an explicit error if 0 rows were updated, even if Supabase returned 200
        throw new Error(`Failed to update order ${orderId}: 0 rows affected.`);
    }

    return data;
}


