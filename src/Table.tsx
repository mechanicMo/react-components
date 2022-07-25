import React, { FC, TableHTMLAttributes } from 'react';
import useMeasure, { RectReadOnly } from 'react-use-measure';

// TODO jsdoc the components

interface TableComposition {
    Row: typeof Row;
    Cell: typeof Cell;
    Headers: typeof Headers;
    Content: typeof Content;
}

export const Table: FC<TableHTMLAttributes<HTMLTableElement>> & TableComposition = ({
    children,
    className,
    style,
    ...props
}) => {
    return (
        // <TableContext.Provider
        //     value={{
        //         styles,
        //     }}
        // >
        <div
            className={`flex flex-col shadow border border-gray-100 rounded ${className}`}
            style={{ ...style }}
            {...props}>
            {children}
        </div>
        // </TableContext.Provider>
    );
};

const Row: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({
    children,
    className,
    style,
    ...props
}) => {
    return (
        <div
            className={`flex ${className}`}
            style={{ scrollSnapAlign: 'start', ...style }}
            {...props}>
            {children}
        </div>
    );
};

const Cell: FC<TableHTMLAttributes<HTMLTableCellElement>> = ({
    children,
    className,
    style,
    ...props
}) => {
    return (
        <div className={`flex-1 max-h-16 p-2 ${className}`} style={{ ...style }} {...props}>
            {children}
        </div>
    );
};

const Headers: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => {
    return (
        <Row className="bg-gray-200" {...props}>
            {children}
        </Row>
    );
};

export type OnScrollType = (
    // eslint-disable-next-line no-unused-vars
    event: React.UIEvent<HTMLDivElement, UIEvent>,
    // eslint-disable-next-line no-unused-vars
    bounds: RectReadOnly
) => void;

const Content: FC<
    Omit<TableHTMLAttributes<HTMLTableRowElement>, 'onScroll'> & { onScroll?: OnScrollType }
> = ({ children, className, onScroll, style, ...props }) => {
    const [ref, bounds] = useMeasure();

    return (
        <div
            className={`flex flex-col overflow-y-scroll ${className}`}
            ref={ref}
            style={{ scrollSnapType: 'y mandatory', ...style }}
            onScroll={(event) => onScroll?.(event, bounds)}
            {...props}>
            {children}
        </div>
    );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Headers = Headers;
Table.Content = Content;
