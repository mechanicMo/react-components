import React, { FC, HTMLProps, useRef, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import './Table.css';

import { TableContext, TableContextType } from './context';
import Cell from './cell';
import Content from './content';
import Headers from './headers';
import Row from './row';

// TODO jsdoc the components

// TODO add sorting arrows / on sort
// TODO export sort function helpers

interface TableComposition {
    Row: typeof Row;
    Cell: typeof Cell;
    Headers: typeof Headers;
    Content: typeof Content;
}

export const FancyTable: FC<HTMLProps<HTMLDivElement>> & TableComposition = ({
    children,
    className,
    style,
    ...props
}) => {
    const [numColumns, setNumColumns] =
        useState<TableContextType['numColumns']>(null);

    const widthByColumn = useRef<TableContextType['widthByColumn']['current']>(
        {},
    );

    const contextValue = {
        numColumns,
        setNumColumns,
        widthByColumn,
    };

    return (
        <TableContext.Provider value={contextValue}>
            <div className="mm__rc">
                <div
                    className={twMerge(
                        `mm-flex mm-flex-col mm-bg-white mm-shadow-lg mm-border mm-border-gray-100 mm-rounded-md mm-overflow-hidden ${className}`,
                    )}
                    style={{ ...style }}
                    {...props}
                >
                    {children}
                </div>
            </div>
        </TableContext.Provider>
    );
};

FancyTable.Row = Row;
FancyTable.Cell = Cell;
FancyTable.Headers = Headers;
FancyTable.Content = Content;

export { OnScrollType } from './content';
