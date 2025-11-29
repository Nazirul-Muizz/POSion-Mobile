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

