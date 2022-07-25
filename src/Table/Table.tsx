import React, { FC, HTMLProps, MutableRefObject, useRef } from 'react';

import './Table.css';

// TODO jsdoc the components

// TODO add sorting arrows / on sort
// TODO export sort function helpers

interface TableComposition {
    Row: typeof Row;
    Cell: typeof Cell;
    Headers: typeof Headers;
    Content: typeof Content;
}

export const Table: FC<HTMLProps<HTMLDivElement>> & TableComposition = ({
    children,
    className,
    style,
    ...props
}) => {
    return (
        <div
            className={`flex flex-col bg-white shadow-lg border border-gray-100 rounded-md overflow-hidden ${className}`}
            style={{ ...style }}
            {...props}>
            {children}
        </div>
    );
};

const Row: FC<HTMLProps<HTMLDivElement>> = ({ children, className, style, ...props }) => {
    return (
        <div
            className={`rc__Table__Row flex px-2 py-1 ${className}`}
            style={{ scrollSnapAlign: 'start', ...style }}
            {...props}>
            {children}
        </div>
    );
};

// format: 'tag' | 'number' |
// align: 'left' | 'center' | 'right'

const Cell: FC<HTMLProps<HTMLDivElement>> = ({ children, className, style, ...props }) => {
    return (
        <div
            className={`flex-1 max-h-16 px-2 whitespace-nowrap overflow-ellipsis overflow-x-hidden ${className}`}
            style={{ ...style }}
            {...props}>
            {children}
        </div>
    );
};

const Headers: FC<HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => {
    return (
        <Row
            className={`py-2 items-center bg-gray-200 border-b border-gray-400 text-gray-600 text-sm font-medium ${className}`}
            {...props}>
            {children}
        </Row>
    );
};

export type OnScrollType = (
    // eslint-disable-next-line no-unused-vars
    ref: MutableRefObject<HTMLDivElement>
) => void;

const Content: FC<Omit<HTMLProps<HTMLDivElement>, 'onScroll'> & { onScroll?: OnScrollType }> = ({
    children,
    className,
    onScroll,
    style,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>();

    return (
        <div
            className={`rc__Table__Content flex flex-col overflow-y-scroll ${className}`}
            ref={ref}
            style={{ scrollSnapType: 'y mandatory', ...style }}
            onScroll={() => onScroll?.(ref)}
            {...props}>
            {children}
        </div>
    );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Headers = Headers;
Table.Content = Content;
