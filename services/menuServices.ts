import { supabase } from "@/lib/supabase-client";

export interface MenuType {
    menu_id: number,
    menu_item: string,
    price: number,
    isAvailable: boolean,
    category_name: string
}

type tableRow = { table_id: number};

type discount_operation_types = 'multiply' | 'subtract';

interface discountDetails {
    discount_id: number,
    discount_name: string,
    discount_value: number,
    discount_operation: discount_operation_types;
}

export const fetchMenu = async (): Promise <MenuType[] | []> => {
    const { data, error } = await supabase
        .from('menu_with_category')
        .select('*')
    
    if (error) throw new Error('');
    
    return data as MenuType[] | [];
}

export const fetchTableId = async (): Promise<tableRow[]> => {
    const { data, error } = await supabase
        .from('restaurant_table')
        .select('table_id')
    
    if (error) throw new Error('');
    
    return data as tableRow[];
}

export const fetchDiscount = async (): Promise<discountDetails[]> => {
    const { data, error } = await supabase
        .from('')
        .select('*')
    
    if (error) throw new Error('');
    
     return data as discountDetails[];
}

export const mutateMenu = async () => {
    const { data, error } = await supabase
        .from('')
        .update('')
    
    if (error) return {success:false, error: error.message}
    
    return {success: true, data}    
}