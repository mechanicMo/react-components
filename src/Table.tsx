import React, { FC, TableHTMLAttributes } from 'react';

interface TableComposition {
    Row: typeof Row;
    Cell: typeof Cell;
    Headers: typeof Headers;
    Content: typeof Content;
}

const Table: FC<TableHTMLAttributes<HTMLTableElement>> & TableComposition = ({
    children,
    ...props
}) => {
    return (
        // <TableContext.Provider
        //     value={{
        //         styles,
        //     }}
        // >
        <div className={`flex flex-col ${props.className}`} {...props}>
            {children}
        </div>
        // </TableContext.Provider>
    );
};

const Row: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => {
    return (
        <div
            className={`flex flex-col ${props.className}`}
            style={{ scrollSnapAlign: 'start', ...props.style }}
            {...props}>
            {children}
        </div>
    );
};

const Cell: FC<TableHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => {
    return (
        <div className={`flex flex-col ${props.className}`} {...props}>
            {children}
        </div>
    );
};

const Headers: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => {
    return (
        <div className={`flex ${props.className}`} {...props}>
            {children}
        </div>
    );
};

const Content: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => {
    return (
        <div
            className={`flex flex-col overflow-y-scroll ${props.className}`}
            style={{ scrollSnapType: 'y mandatory', ...props.style }}
            {...props}>
            {children}
        </div>
    );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Headers = Headers;
Table.Content = Content;

export default Table;
