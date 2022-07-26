import React, {
    createContext,
    Dispatch,
    FC,
    HTMLProps,
    MutableRefObject,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import './Table.css';

// TODO jsdoc the components

interface TableContextType {
    numColumns: number | null;
    setNumColumns: Dispatch<SetStateAction<number | null>>;
    widthByColumn: Record<number, number>;
    setWidthByColumn: Dispatch<SetStateAction<Record<number, number>>>;
}
const TableContext = createContext<TableContextType>(null);

const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('no table context');
    }

    return context;
};

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
    const [numColumns, setNumColumns] = useState(null);
    const [widthByColumn, setWidthByColumn] = useState({});

    const contextValue = {
        numColumns,
        setNumColumns,
        widthByColumn,
        setWidthByColumn,
    };

    return (
        <TableContext.Provider value={contextValue}>
            <div
                className={`flex flex-col bg-white shadow-lg border border-gray-100 rounded-md overflow-hidden ${className}`}
                style={{ ...style }}
                {...props}
			>
                {children}
            </div>
        </TableContext.Provider>
    );
};

const Row: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    style,
    ...props
}) => (
    <div
        className={`rc__Table__Row flex px-2 py-1 ${className}`}
        style={{scrollSnapAlign: 'start', ...style}}
		{...props}
	>
		{children}
	</div>
);

interface CellProps {
    format?: 'tag' | 'number';
    align?: 'left' | 'center' | 'right';
}

const Cell: FC<HTMLProps<HTMLDivElement> & CellProps> = ({
    align = 'left',
    children,
    className,
    style,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const { numColumns, setNumColumns, widthByColumn, setWidthByColumn }
        = useTableContext();

    const [columnIndex, setColumnIndex] = useState<number>(null);

    // TODO test this by having diff # of header cells than content cells
    useEffect(() => {
        if (numColumns !== ref.current.parentElement.childElementCount) {
            if (numColumns)
                throw new Error(
                    'incorrect # of columns. you most likely have a different number of `Cell`s being rendered in your `Headers` than `Cell`s in `Row`',
                );
            else {
                setNumColumns(ref.current.parentElement.childElementCount);
            }
        }
    }, [numColumns, setNumColumns]);

    useEffect(() => {
        setColumnIndex(
            Array.from(ref.current.parentElement.children).indexOf(ref.current),
        );
        const columnWidth = widthByColumn[columnIndex];

        if (ref.current.offsetWidth > columnWidth)
            setWidthByColumn((wbc) => ({
                ...wbc,
                [columnIndex]: ref.current.offsetWidth,
            }));
    }, [columnIndex, setWidthByColumn, widthByColumn]);

    return (
        <div
            className={`max-h-16 px-2 whitespace-nowrap overflow-ellipsis overflow-x-hidden ${className} text-${align}`}
            ref={ref}
            style={{ width: widthByColumn[columnIndex], ...style }}
            {...props}
		>
            {children}
        </div>
    );
};

const Headers: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <Row
        className={`py-2 items-center bg-gray-300 border-b border-gray-400 text-gray-600 text-sm font-medium ${className}`}
		{...props}
	>
		{children}
	</Row>
);

export type OnScrollType = (ref: MutableRefObject<HTMLDivElement>) => void;

const Content: FC<
    Omit<HTMLProps<HTMLDivElement>, 'onScroll'> & { onScroll?: OnScrollType }
> = ({children, className, onScroll, style, ...props}) => {
    const ref = useRef<HTMLDivElement>();

    return (
        <div
            className={`rc__Table__Content flex flex-col overflow-y-scroll ${className}`}
            ref={ref}
            style={{ scrollSnapType: 'y mandatory', ...style }}
            onScroll={() => onScroll?.(ref)}
            {...props}
		>
            {children}
        </div>
    );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Headers = Headers;
Table.Content = Content;
