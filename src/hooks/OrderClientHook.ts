
import { fetchDiscount } from "@/api/menuServices";
import { generateNumberOrder, mutateOrder, mutateOrderItem } from "@/api/orderServices";
import { useDropdownStore } from "@/store/StatesStore";
import { MenuType, discountDetails } from "@/types/MenuType";
import { CartItem, CatProps, DrinksCategoryProps, FoodCategoryProps, OrderItemPayload, OrderItemState } from "@/types/OrderType";
import { createOrder } from "@/utils/OrderHelper";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useMenuItemQuery } from "./MenuHook";

export const useOrderMutate = () => {
    const { mutate, mutateAsync, isSuccess, isError} = useMutation({
        mutationFn: mutateOrder,
        onSuccess: () => {
            //Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur')
            console.log('Order successfully created');
        },
        onError: (error: any) => {
            Alert.alert('Ralat Order', `Gagal menghantar pesanan ke dapur: ${error?.message}`);
        }
    })

    return { mutate, mutateAsync, isSuccess, isError };
}

export const useOrderItemMutate = () => {
    const {mutate, mutateAsync, isSuccess, isError} = useMutation({
        mutationFn: mutateOrderItem,
        onSuccess: () => {
            // Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur')
            console.log('Order items successfully submitted');
        },
        onError: (error: any) => {
            Alert.alert('Ralat Order', `Gagal menambah item: ${error?.message}`);
        }
    })

    return { mutate, mutateAsync, isSuccess, isError};
};

export const useSubmitOrder = (cart: CartItem[], setCart: (cart: CartItem[]) => void, selectedDiscount: discountDetails | null) => {
    const { selectedOption, setSelectedOption } = useDropdownStore();
    const { mutateAsync: mutateOrder } = useOrderMutate();
    const { mutateAsync: mutateOrderItem } = useOrderItemMutate();

    const handleSubmit = useCallback( async ( onClose: () => void) => {

        const queriedOrderNumber = await generateNumberOrder();
        const actualNumberOrder = queriedOrderNumber
        const { order_id, dine_option, created_at, total_price, table_id, discount_id } = createOrder(cart, selectedOption, actualNumberOrder, selectedDiscount);

        if (cart.length === 0) {
            Alert.alert('Ralat', 'Sila tambah item untuk membuat pesanan');
            return;
        }

        if (!selectedOption['table number']) {
            Alert.alert('Ralat', 'Sila pilih meja sebelum menghantar pesanan');
            return;
        }

        if (!selectedDiscount) {
             Alert.alert('Ralat', 'Sila pilih satu diskaun');
            return;
        }

        try {
            const orderData = {
                order_id: order_id,
                dine_option: dine_option,
                created_at: created_at,
                total_price: total_price,
                table_id: table_id,
                discount_id: discount_id
            };

            await mutateOrder(orderData)
            console.log(`Main Order successfully created: ${order_id}`);

            const orderItemsToSubmit: OrderItemPayload[] = cart.map(item => ({
                order_id: order_id, // Link line item back to main order
                menu_id: item.menu_id,
                item_name: item.menu_item,
                quantity: item.quantity,
                carb: item.selectedCarb,
                comments: item.comments, 
            }));

            //console.log('order items to submit:', JSON.stringify(orderItemsToSubmit, null, 2));

            await mutateOrderItem(orderItemsToSubmit);

            onClose();
            Alert.alert('Status Order', 'Pesanan anda berjaya dihantar ke dapur');
            setSelectedOption('carbo', '');
            setSelectedOption('table number', '');
            setSelectedOption('dine option', '');
            setCart([]);

        } catch (error) {
            console.error('Failed to submit order or order items', error)
            Alert.alert('Ralat', 'Gagal menghantar pesanan');
        }

    }, [cart, selectedOption, mutateOrder, mutateOrderItem, selectedDiscount]);

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
  const [comment, setComment] = useState('');
  const { selectedOption, setSelectedOption } = useDropdownStore();

  // --- Add / increment item in cart ---
  const handleConfirmPress = useCallback(
    (orderItem: MenuType | null, onSuccess: () => void) => {
      if (!orderItem) return;

      const isSoupOrBakso = orderItem.category_name === 'Sup' || orderItem.category_name === 'Bakso';
      const carbOption = isSoupOrBakso ? selectedOption['carbo'] || '' : '';
      const trimmedComment = comment.trim();

      if (isSoupOrBakso && !carbOption) {
        Alert.alert('Ralat', 'Sila pilih 1 (mee kuning/nasi putih/nasi impit/bihun)');
        return;
      }

      setCart(prev => {
        const index = prev.findIndex(
          i => i.menu_id === orderItem.menu_id && i.selectedCarb === carbOption
        );

        if (index !== -1) {
          // Increment quantity and append comment
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + 1,
            comments: trimmedComment ? [...(updated[index].comments || []), trimmedComment] : updated[index].comments,
          };
          return updated;
        }

        // New entry
        return [
          ...prev,
          {
            ...orderItem,
            selectedCarb: carbOption,
            quantity: 1,
            comments: trimmedComment ? [trimmedComment] : [],
          },
        ];
      });

      // Reset comment & carb selection
      setComment('');
      setSelectedOption('carbo', '');
      onSuccess();
    },
    [comment, selectedOption, setSelectedOption]
  );

  const handleQuantityChange = useCallback(
    (item: MenuType, increment: boolean) => {
      const isSoupOrBakso = item.category_name === 'Sup' || item.category_name === 'Bakso';
      const carbOption = isSoupOrBakso ? selectedOption['carbo'] || '' : '';

      setCart(prev => {
        const index = prev.findIndex(
          i => i.menu_id === item.menu_id && i.selectedCarb === carbOption
        );
        if (index === -1) {
          if (increment) {
            return [
              ...prev,
              { ...item, selectedCarb: carbOption, quantity: 1, comments: [] },
            ];
          }
          return prev;
        }

        const updated = [...prev];
        const newQty = increment ? updated[index].quantity + 1 : updated[index].quantity - 1;
        if (newQty <= 0) return prev.filter((_, i) => i !== index);
        updated[index] = { ...updated[index], quantity: newQty };
        return updated;
      });
    },
    [selectedOption]
  );

  const handleDeleteCart = useCallback(() => {
    setCart([]);
  }, []);

  const orderQuantities = useMemo(() => {
    return cart.reduce<Record<number, number>>((acc, item) => {
      acc[item.menu_id] = (acc[item.menu_id] || 0) + item.quantity;
      return acc;
    }, {});
  }, [cart]);

    const variationSummary = useMemo(() => {
        const summary = cart.flatMap(item => {
            // If no comments, create at least one variation entry
            if (!item.comments || item.comments.length === 0) {
                return [
                    {
                        ...item,
                        comment: '',
                        quantity: item.quantity,
                    },
                ];
            }

            // Map each comment as a separate variation entry
            return item.comments.map(c => ({
                ...item,
                comment: c,
                quantity: item.quantity, // same quantity as cart
            }));
        });

        // console.log('variationSummary:', JSON.stringify(summary, null, 2));

        return summary;

    }, [cart]);

  return {
    cart,
    comment,
    setComment,
    setCart,
    orderQuantities,
    variationSummary,
    handleConfirmPress,
    handleQuantityChange,
    handleDeleteCart,
  };
};

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

export const useDiscountQuery = () => {
    const {data: discounts, error} = useQuery<discountDetails[]>({
        queryKey:['discount'],
        queryFn: fetchDiscount,
        staleTime: Infinity
    })

    if (error) throw new Error(error.message);

    return discounts ?? [];
}

export const useSelectDiscount = () => {
    const [selectedDiscount, setSelectedDiscount] = useState<discountDetails | null>(null);
    const [isDiscountModal, setIsDiscountModal] = useState(false);

    const handleSelection = (option: discountDetails) => {
        setSelectedDiscount(option)
    }
    
    const openDiscountModal = () => setIsDiscountModal(true);
    const closeDiscountModal = () => setIsDiscountModal(false);
    
    return {
        handleSelection,
        selectedDiscount,
        isDiscountModal,
        openDiscountModal,
        closeDiscountModal
    };
};
