import { MenuType } from "@/types/MenuType";

export type OrderItemState = MenuType & {
    quantity: number
}

export type CartItem = OrderItemState & {
    selectedCarb?: string;
    comments: string[];
}

export type CatProps = 'Makanan' | 'Minuman';
export type FoodCategoryProps = 'Mee Bandung' | 'Sup' | 'Bakso' | 'Western' | 'Add Ons';
export type DrinksCategoryProps = 'Minuman Panas' | 'Minuman Sejuk' | 'Jus Buah-Buahan';
export type dineOption = 'Makan' | 'Bungkus';

export interface OrderItemPayload {
    order_id: string,
    item_name: string,
    menu_id: number,
    quantity: number,
    carb?: string,
    comment?: string
}

export interface OrderProps {
    order_id: string,
    table_id: number,
    dine_option: dineOption, // change to makan/bungkus later
    discount_id: number | undefined,
    total_price: number,
    created_at: Date,
    is_prepared: boolean
}