import { CustomStyle } from 'interfaces/CustomStyle';
import React, { createContext, useContext, ReactNode } from 'react';

interface CustomizationContextType {
    style: CustomStyle;
    setStyle: (style: CustomStyle) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const useCustomization = (): CustomizationContextType => {
    const context = useContext(CustomizationContext);
    if (context === undefined) {
        throw new Error(
            "useCustomization deve essere usato all'interno di un CustomizationProvider"
        );
    }
    return context;
};

interface CustomizationProviderProps {
    children: ReactNode;
}

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({ children }) => {

    const [style, setStyle] = React.useState<CustomStyle>({});
    
    const value = { style, setStyle};  

    return (
        <CustomizationContext.Provider value={value}>
            {children}
        </CustomizationContext.Provider>
    );
};
