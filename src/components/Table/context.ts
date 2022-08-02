import {
    createContext,
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useContext,
} from 'react';

export interface TableContextType {
    numColumns: number | null;
    setNumColumns: Dispatch<SetStateAction<number | null>>;

    widthByColumn: MutableRefObject<Record<number, number>>;
}

export const TableContext = createContext<TableContextType | null>(null);

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('no table context');
    }

    return context;
};
