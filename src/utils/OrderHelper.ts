import { CartItem } from "@/types/OrderType";

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