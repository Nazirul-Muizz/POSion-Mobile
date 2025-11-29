import { supabase } from "../../lib/supabase-client";
import { discountDetails, MenuAvailability, MenuType, tableRow } from '../types/MenuType';

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
        .from('discount')
        .select('*')
        .order('discount_id', {ascending: true});
    
    if (error) throw new Error('');
    
     return data as discountDetails[];
}

export const mutateMenuAvailability = async ({isAvailable, menu_id}: MenuAvailability): Promise<MenuAvailability> => {
    const { data, error } = await supabase
        .from('restaurant_menu')
        .update({isAvailable: isAvailable})
        .eq('menu_id', menu_id)
        .select()
    
    if (error) throw new Error(error.message)
    
    if (!data || data.length === 0) {
        throw new Error('Update successful, but no data was returned.');
    }
    
    // Return the single updated item
    return data[0];   
}