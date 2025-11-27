import { createContext, ReactNode, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Colors } from '../constants/Colors';

export interface ColorPallete {
    text: string,
    background: string,
    icon: string,
    button:string
}

export type ThemeColors = {
    light:ColorPallete;
    dark:ColorPallete;
}

export interface ThemeContextType {
    theme: ColorPallete;
    colorScheme: ColorSchemeName;
    setColorScheme: (scheme: ColorSchemeName) => void;
}

export interface ThemeProviderProps {
    children: ReactNode;
}

const defaultContext: ThemeContextType = {
    colorScheme: 'dark',
    setColorScheme: () => {},
    theme:Colors.dark
}

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

    const theme:ColorPallete = colorScheme === 'dark' ? Colors.dark : Colors.light

    return (
        <ThemeContext.Provider value={{
            colorScheme, setColorScheme, theme
        }}>
            { children }
        </ThemeContext.Provider>
    );
}