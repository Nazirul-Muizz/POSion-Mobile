import { fetchMenu, fetchTableId } from "@/services/menuServices";
import { MenuType } from "@/types/MenuType";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type SectionData = {
    title: string,
    data: MenuItem[]
}

type MenuItem = {
    menu_id: number,
    menu_item: string,
    isAvailable: boolean
}


type FoodCategoryProps = 'Mee Bandung' | 'Sup' | 'Bakso' | 'Western' | 'Add Ons';
type DrinksCategoryProps = 'Minuman Panas' | 'Minuman Sejuk' | 'Jus Buah-Buahan';

type useMenuQueryOptions <R extends MenuType[] | unknown = MenuType[]> = Omit <
    UseQueryOptions<MenuType[], Error, R>,
    'queryKey' | 'queryFn'
>

export const useMenuQuery = <R = MenuType[]> (options?: useMenuQueryOptions<R> ) => {
    return useQuery<MenuType[], Error, R>({
        queryKey:['menu'],
        queryFn: fetchMenu,
        staleTime: 5 * 60 * 1000, // 5 MINUTES
        ...options
    })
};

export const useMenuSections = ( ) => {
    const { data: menuList, isLoading: isMenuLoading, isFetching: isMenuFetching } = useMenuQuery({
        select: (data) => {
            if (!Array.isArray(data)) return []; 

            console.log(data)
            const grouped = data.reduce( (acc: SectionData[], currentItem) => {
                if (!currentItem?.category_name) return acc; 
                const categoryName = currentItem.category_name;
                const existingHeader = acc.find(section => section.title === categoryName)

                const itemData: MenuItem = {
                    menu_id: currentItem.menu_id,
                    menu_item: currentItem.menu_item,
                    isAvailable: currentItem.isAvailable
                };

                if (existingHeader) existingHeader.data.push(itemData)
                else {
                    acc.push({
                        title: categoryName,
                        data: [itemData]
                    })
                }

                return acc;
            }, [])

            //console.log(`grouped: ${grouped}`)
            return grouped;
        }
       
    })

     //console.log("data:", JSON.stringify(menuList, null, 2));

    return {menuList, isMenuLoading, isMenuFetching}
}

export const useTableQuery = () => {
    const { data: tableNumber } = useQuery({
        queryKey:['tableName'],
        queryFn: fetchTableId,
        staleTime: 5 * 60 * 1000,
        select: (data) => {
            return data.map( item => {
                const table_prefix = 'Meja ';
                return `${table_prefix} ${item.table_id}`
            })
        }
    })

    return tableNumber ?? [];
}

export const useMenuItemQuery = (tab: FoodCategoryProps | DrinksCategoryProps) => {
    const { data: filteredMenu } = useQuery({
        queryKey:['filteredMenu', tab],
        queryFn: fetchMenu,
        staleTime: 60 * 60 * 1000,
        select: (data) => {
            return data
            .filter( item => {
                return item.category_name.trim().toLowerCase() === tab.trim().toLowerCase();
            })
            .filter(item => {
                return item.isAvailable === true;
            })
        }
    })

    return filteredMenu;
}


