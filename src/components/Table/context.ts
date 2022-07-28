import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface TableContextType {
    numColumns: number | null;
    setNumColumns: Dispatch<SetStateAction<number | null>>;

    widthByColumn: Record<number, number>;
    setWidthByColumn: Dispatch<SetStateAction<Record<number, number>>>;
}

export const TableContext = createContext<TableContextType | null>(null);

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('no table context');
    }

    return context;
};
