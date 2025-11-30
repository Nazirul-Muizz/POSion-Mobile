import { create } from 'zustand';

interface SidebarProps {
    showSidebar: boolean,
    setShowSidebar: (sidebar: boolean) => void
}

interface OrderItemProps {
    selectedCarb: string,
    setSelectedCarb: (carbo: string) => void
    comment?: string,
    setComment: (text: string) => void
}

type DropdownProps = {
    selectedOption: Record<string, string>,
    setSelectedOption: (key: string, option: string) => void,
    // clearDropdown: boolean,
    // setClearDropdown: () => void
}

export const useSidebarStore = create<SidebarProps>( (set) => ({
    showSidebar: false,
    setShowSidebar: (sidebar) => set( ({
        showSidebar: sidebar
    }))
    })
);

export const useOrderItemStore = create<OrderItemProps>( (set) => ({
    selectedCarb: "",
    setSelectedCarb: (carbo) => set( () => ({
        selectedCarb: carbo
    })),
    comment: "",
    setComment: (text) => set( () => ({
        comment: text
    }))
}))

export const useDropdownStore = create<DropdownProps>( (set) => ({
    selectedOption: {},
    setSelectedOption: (key, option) => set( (state) => ({
        selectedOption: {...state.selectedOption, [key]: option}
    }))
}))

