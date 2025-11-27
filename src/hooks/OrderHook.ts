
import { generateNumberOrder, mutateOrder, mutateOrderItem } from "@/services/orderServices";
import { useDropdownStore } from "@/store/StatesStore";
import { MenuType } from "@/types/MenuType";
import { CartItem, CatProps, DrinksCategoryProps, FoodCategoryProps, OrderItemPayload, OrderItemState } from "@/types/OrderType";
import { createOrder } from "@/utils/OrderHelper";
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useMenuItemQuery } from "./MenuHook";

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

export const useShowFooterCart = (cart: CartItem[]): boolean => {
    return cart.length > 0;
};

export const useModalVisibility = () => {
    const [isCartModalVisible, setIsCartModalVisible] = useState(false);

    const openCartModal = useCallback( () => {setIsCartModalVisible(true)}, []);
    const closeCartModal = useCallback( () => {setIsCartModalVisible(false)}, []);

    return {
        openCartModal,
        closeCartModal,
        isCartModalVisible
    }
}

export const useHandleCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});
    const [comment, setComment] = useState('');
    const {selectedOption, setSelectedOption} = useDropdownStore();

    const handleQuantityChange = useCallback( (item: MenuType, increment: boolean, ) => {
        const itemId = item.menu_id.toString();

        setOrderQuantities(previousQuantities => {
            const currentQuantity = previousQuantities[itemId] ?? 0;
            const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

            const updated = { ...previousQuantities };
            if (newQuantity > 0) updated[itemId] = newQuantity;
            else delete updated[itemId];
            return updated;
            });

        setCart(prevCart => {
            const index = prevCart.findIndex(c => c.menu_id === item.menu_id);
            if (increment) {
                if (index === -1) {
                    // Add a new unit
                    return [...prevCart, {
                        ...item,
                        selectedCarb: "",
                        comment: "",
                        quantity: 1
                    }];
                } else {
                // item exists => increment
                const newCart = [...prevCart];
                newCart[index] = {
                    ...newCart[index],
                    quantity: newCart[index].quantity + 1
                };
                return newCart;
                }
            } 
            
            // Remove a unit - FILO
            const reversedIndex = [...prevCart]
                .reverse()
                .findIndex(c => c.menu_id === item.menu_id);

            if (reversedIndex !== -1) {
                const actualIndex = prevCart.length - 1 - reversedIndex;
                const newCart = [...prevCart];
                newCart.splice(actualIndex, 1);
                return newCart;
            }

            return prevCart;
        });

        
    }, [comment, selectedOption]);

    const handleConfirmPress = useCallback( (orderItem: OrderItemState | null, onSuccess: () => void) => { 
            if ((orderItem?.category_name === 'Bakso' || orderItem?.category_name === 'Sup') && !selectedOption['carbo']) {
                Alert.alert('Ralat', 'Sila pilih 1 (mee kuning/nasi putih/nasi impit/bihun)');
                return;
            }
            
            if (orderItem) {
                const carbOption = selectedOption['carbo'] || "";
                handleQuantityChange(orderItem, true);
    
                setCart(prev => {
                    const reversedIndex = [...prev]
                        .reverse()
                        .findIndex(i => i.menu_id === orderItem.menu_id);
    
                    if (reversedIndex === -1) return prev;
    
                    const actualIndex = prev.length - 1 - reversedIndex;
    
                    const newCart = [...prev];
                    newCart[actualIndex] = {
                        ...newCart[actualIndex],
                        selectedCarb: carbOption,
                        comment: comment
                    };
    
                    console.log("Cart (INSIDE CART SETTER):", JSON.stringify(newCart, null, 2));
                    return newCart;
                });
    
            }   
            
            // reset after confirm
            setComment('')
    
            setSelectedOption('carbo', '');
    
            onSuccess();            
        }, [comment, selectedOption, handleQuantityChange, setComment, setSelectedOption])

    return {
        cart,
        orderQuantities,
        handleQuantityChange,
        handleConfirmPress
    }
}

export const useOrderFlow = (orderQuantities: Record<string, number>) => {
    const [currentCat, setCurrentCat] = useState<CatProps>('Makanan');
    const [currentSubCat, setSubCurrentCat] = useState<FoodCategoryProps | DrinksCategoryProps>('Mee Bandung');
    const [showPopupConfig, setShowPopupConfig] = useState(false);
    const [orderItem, setOrderItem] = useState<OrderItemState | null>(null);

    const filteredMenu = useMenuItemQuery(currentSubCat)

    // necessary to display the quantity into the flatlist
    const menuItemsWithOrder: OrderItemState[] = useMemo( () => {
        return (filteredMenu || []).map( item => ({
            ...item,
            quantity: orderQuantities[item.menu_id.toString()] || 0
        }))
    }, [filteredMenu, orderQuantities]);

    //console.log(filteredMenu);
    //#fffbe6
    const handlePress = (subCat: FoodCategoryProps | DrinksCategoryProps) => {
        setSubCurrentCat(subCat);
    }

    useEffect( () => {
        currentCat === 'Makanan' ? setSubCurrentCat('Mee Bandung') : setSubCurrentCat('Minuman Panas')
    }, [currentCat]);

    return {
        currentCat,
        setCurrentCat,
        orderItem,
        setShowPopupConfig,
        setOrderItem,
        menuItemsWithOrder,
        handlePress,
        currentSubCat,
        showPopupConfig
    }
}
