import { generateNumberOrder, mutateOrder, mutateOrderItem } from "@/services/orderServices";
import { useDropdownStore } from "@/store/StatesStore";
import { CartItem, OrderItemPayload } from "@/types/OrderType";
import { useMutation } from '@tanstack/react-query';
import { useCallback } from "react";
import { Alert } from "react-native";

export const useOrderMutate = () => {
    const { mutate, isSuccess, isError} = useMutation({
        mutationFn: mutateOrder,
        onSuccess: () => {
            //Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur')
            console.log('Order successfully created');
        },
        onError: (error: any) => {
            Alert.alert('Ralat Order', `Gagal menghantar pesanan ke dapur: ${error?.message}`);
        }
    })

    return { mutate, isSuccess, isError };
}

export const useOrderItemMutate = () => {
    const {mutate, isSuccess, isError} = useMutation({
        mutationFn: mutateOrderItem,
        onSuccess: () => {
            Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur')
        },
        onError: (error: any) => {
            Alert.alert('Ralat Order', `Gagal menambah item: ${error?.message}`);
        }
    })

    return { mutate, isSuccess, isError};
};

export const createOrder = (cart: CartItem[], selectedOption: any, orderNumber: number) => {

    const extractTableId = () => {
        const tableNumber = selectedOption['table number'] || '';
        const parts = tableNumber.split(' ');
        const numberString = parts[parts.length - 1];
        const number = Number(numberString) || 0;
        return number;
    };

    const calculateTotalPrice = () => {
        const normalTotalPrice = cart.reduce( (acc, item) => {
            const price = item.price * item.quantity;
            return acc + price
        }, 0)

        console.log(`calculated price: ${normalTotalPrice}`);
        return normalTotalPrice;
    };

    //const orderNumber = generateNumberOrder(); //generate number for order id

    const date = new Date(); // define current timestamp for created at
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear()

    const tableId = extractTableId();
    const totalPrice = calculateTotalPrice();
    const orderId = `ORDER-${year}${month}${day}-${String(orderNumber)}`;
    const dineOption = selectedOption['dine option'];

    return {
        order_id: orderId,
        dine_option: dineOption,
        created_at: date,
        total_price: totalPrice,
        table_id: tableId,
        discount_id: 8 // discount id from global state
    }    
    
};

export const useSubmitOrder = (cart: CartItem[]) => {
    const { selectedOption } = useDropdownStore();
    const { mutate: mutateOrder } = useOrderMutate();
    const { mutate: mutateOrderItem } = useOrderItemMutate();

    const handleSubmit = useCallback( async () => {

        const queriedOrderNumber = await generateNumberOrder();
        const actualNumberOrder = queriedOrderNumber
        const { order_id, dine_option, created_at, total_price, table_id, discount_id } = createOrder(cart, selectedOption, actualNumberOrder);

        if (cart.length === 0) {
            Alert.alert('Ralat', 'Sila tambah item untuk membuat pesanan');
            return;
        }

        if (!selectedOption['table number']) {
            Alert.alert('Ralat', 'Sila pilih meja sebelum menghantar pesanan');
            return;
        }

        const orderData = {
            order_id: order_id,
            dine_option: dine_option,
            created_at: created_at,
            total_price: total_price,
            table_id: table_id,
            discount_id: discount_id
        };

        mutateOrder(orderData, {
            onSuccess: () => {
                console.log(`Main Order successfully created: ${order_id}`);

                const orderItemsToSubmit: OrderItemPayload[] = cart.map(item => ({
                    order_id: order_id, // Link line item back to main order
                    menu_id: item.menu_id,
                    item_name: item.menu_item,
                    quantity: item.quantity,
                    carb: item.selectedCarb,
                    comment: item.comment, 
                }));

                mutateOrderItem(orderItemsToSubmit, {
                    onSuccess: () => {
                        Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur');
                    },
                    onError: (error) => {
                        // Handle batch item submission failure
                        console.error('Failed to insert order items:', error);
                        Alert.alert('Ralat Item', 'Gagal menghantar item pesanan. Sila semak log.');
                    }
                });
            }
        })

    }, [cart, selectedOption, mutateOrder, mutateOrderItem]);

    return { handleSubmit };
}
