// --- INTERFACES AND TYPES ---

// 1. Types for Add-Ons (e.g., proteins, carbs, etc.)
// These objects use an index signature: any string key maps to a number (the price)
type AddOn = {
    [key: string]: number; // e.g., "Daging": 4.00, "Ayam": 3.00
};

type AddOnSection = {
    Protein?: AddOn;
    Carbo?: AddOn;
    meatball?: number;
    // Add any other specific add-on types here
    "Mi"?: number;
    "Sayur"?: number;
    "Telur"?: number;
};

// 2. The core definition of an individual Menu Item
export interface MenuItemType {
    description?: string; // Optional for simple items
    price: number; // Use number if known, string if dynamic (like your original file suggested)
    addOns?: AddOnSection; // Optional if no add-ons
    isAvailable: boolean;
}

// 3. Defines a Category/Sub-Section (e.g., "Mi Bandung", "Hot", "Chicken")
// I 10.00s an object where the keys are the item names (strings) and the values are MenuItems
type MenuCategory<T extends MenuItemType> = {
    [itemName: string]: T;
};

// 4. Defines a Section (e.g., "food", "drinks")
interface MenuSection {
    [categoryName: string]: MenuCategory<MenuItemType>;
}

// 5. The final overall structure
export interface MenuType {
    food: MenuSection;
    drinks: MenuSection;
    // You could add 'desserts', 'snacks', etc. here
}


const proteinMB = {"Daging": 4.00, "Ayam": 3.00, "Udang":4.00, "Kerang": 3.00};
const proteinSupDanBakso = {"Daging": 4.00, "Ayam": 3.00, "Tetel":4.00, "Kambing": 3.00};
const carboSupDanBakso = {"Nasi": 1.00, "Mi Kuning": 1.00, "Nasi Impit": 1.00, "Bihun": 1.00};


export const addOns = {
    "Mi Bandung": {
        "Mi": 1.00,
        "Sayur": 0.50,
        "Telur": 1.00,
        Protein: proteinMB
    },
    "Sup": {
        Carbo: carboSupDanBakso,
        Protein: proteinSupDanBakso
    },
    "Bakso": {
        Carbo: carboSupDanBakso,
        Protein: proteinSupDanBakso,
        meatball: 2.00
    }
}

export const menu = {
    food: {
        "Mi Bandung": {
            "Mi Bandung Biasa": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
            "Mi Bandung Daging": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
            "Mi Bandung Ayam": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
            "Mi Bandung Kerang": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
            "Mi Bandung Udang": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
            "Mi Bandung Special": {
                description: "",
                price: 10.00,
                addOns: addOns["Mi Bandung"],
                isAvailable: true
            },
        },
        "Sup": {
            "Sup Daging": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Sup"],
                isAvailable: true
            },
            "Sup Ayam": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Sup"],
                isAvailable: true
            },
            "Sup Tetel": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Sup"],
                isAvailable: true
            },
            "Sup Kambing": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Sup"],
                isAvailable: true
            },
            "Sup Gearbox": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Sup"],
                isAvailable: true
            },
        },
        "Bakso": {
            "Bakso Daging": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
            "Bakso Ayam": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
            "Bakso Tetel": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
            "Bakso Kambing": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
            "Bakso Mercun": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
            "Bakso Beranak": {
                description: "",
                price: 10.00,
                carbo: carboSupDanBakso,
                addOns: addOns["Bakso"],
                isAvailable: true
            },
        },
        "Western": {
            "Chicken Chop": { price: 6.00, isAvailable: true },
            "Chicken Chop Cheese": { price: 7.00, isAvailable: true },
            "Grilled Chicken Chop": { price: 13.00, isAvailable: true},
            "Lamb Chop": { price: 18.00, isAvailable: true},
            "Nasi Putih + Chicken Chop": { price: 7.00, isAvailable: true },
            "Nasi putih + Grilled Chicken Chop": { price: 14.00, isAvailable: true },
            "Nasi putih + Lamb Chop": { price: 19.00, isAvailable: true },
            "Spaghetti Carbonara": { price: 7.00, isAvailable: true },
            "Spagetti Bolognese": { price: 7.00, isAvailable: true },
        }
    },
    drinks: {
        "Hot": {
            "Teh O Panas": 3.00,
            "Teh O Limau Panas": 4.00,
            "Teh O Laici Panas": 4.50,
            "Teh Panas": 4.00,
            "Nescafe Panas": 4.00,
            "Green Tea Panas": 4.00,
            "Kopi O Panas": 3.00,
            "Kopi Panas": 4.00,
        },
        "Cold": {
            "Teh O Ais": 4.00,
            "Teh O Limau Ais": 5.00,
            "Teh O Laici Ais": 5.50,
            "Teh Ais": 5.00,
            "Nescafe Ais": 5.00,
            "Iced Green Tea": 6.00,
            "Kopi O Ais": 4.00,
            "Kopi Ais": 5.00,
            "Extra Joss Anggur": 5.00,
            "Extra Joss Mangga": 5.00 
        }, 
        "Fruit Juice": {
            "Laici": 5.00,
            "Fresh Orange": 5.00,
            "Apple Juice": 5.00,
            "Tembikai Juice": 5.00
        }
    }
}