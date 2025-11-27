export interface MenuType {
    menu_id: number,
    menu_item: string,
    price: number,
    isAvailable: boolean,
    category_name: string
}

export type tableRow = { table_id: number};

export type discount_operation_types = 'multiply' | 'subtract';

export interface discountDetails {
    discount_id: number,
    discount_name: string,
    discount_value: number,
    discount_operation: discount_operation_types;
}