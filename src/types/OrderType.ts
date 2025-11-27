import { MenuType } from "@/types/MenuType";

export type OrderItemState = MenuType & {
    quantity: number
}

export type CartItem = OrderItemState & {
    selectedCarb?: string;
    comment?: string;
}

export type CatProps = 'Makanan' | 'Minuman';
export type FoodCategoryProps = 'Mee Bandung' | 'Sup' | 'Bakso' | 'Western' | 'Add Ons';
export type DrinksCategoryProps = 'Minuman Panas' | 'Minuman Sejuk' | 'Jus Buah-Buahan';

export interface OrderItemPayload {
    order_id: string,
    item_name: string,
    menu_id: number,
    quantity: number,
    carb?: string,
    comment?: string
}