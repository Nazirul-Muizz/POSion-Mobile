import { MenuType } from "@/services/menuServices";
import { useCallback, useState } from "react";

const testHandleQuantityChange = () => {
    const [orderQuantities, setOrderQuantities] = useState({});
    const [cart, setCart] = useState([]);

    return {orderQuantities, setOrderQuantities, cart, setCart};
}

export const handleQuantityChange = useCallback( (item: MenuType, increment: boolean,) => {
        const {orderQuantities, setOrderQuantities} = testHandleQuantityChange();
        const itemId = item.menu_id.toString();

        setOrderQuantities(previousQuantities => {
            const currentQuantity = previousQuantities[itemId] ?? 0;
            const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

            const newQuantities = {...previousQuantities};

            if (newQuantity > 0) newQuantities[itemId] = newQuantity;
            else delete newQuantities[itemId];

            console.log("new quantities:", JSON.stringify(newQuantities, null, 2))

            return newQuantities;
        });

        setCart(prevCart => {
            if (increment) {
                return [...prevCart, {...item, selectedCarb: '', comment:''}]
            } else {
                // FILO: First In Last Out
                const reversedIndex = [...prevCart].reverse().findIndex(c => c.menu_id.toString() === itemId)

                if (reversedIndex !== -1) {
                    const actualIndex = prevCart.length - 1 - reversedIndex;
                    const newCart = [...prevCart];
                    newCart.splice(actualIndex, 1);
                    return newCart;
                }
            }
            console.log("previous cart:", JSON.stringify(prevCart, null, 2))
            return prevCart;
        });
    }, []);