import React, {
    Dispatch,
    FC,
    HTMLProps,
    MutableRefObject,
    PropsWithChildren,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

import { twMerge } from 'tailwind-merge';
import { colorNameToRGB } from '../../util/string-to-color';
import { useTableContext } from './context';

type DivWithChildren = PropsWithChildren<HTMLProps<HTMLDivElement>>;

interface CellPropsBase extends Omit<DivWithChildren, 'children'> {
    align?: 'left' | 'center' | 'right';
    soften?: true;
}

interface DefaultCellProps extends CellPropsBase {
    children: JSX.Element | ReactNode;
    colors?: never;
    format?: never;
}

interface NumberCellProps extends CellPropsBase {
    children: string | number | null;
    colors?: never;
    format?: 'number';
}

interface TagCellProps extends CellPropsBase {
    children: string | number | null;
    colors: 'random' | string[] | Record<string, string>;
    format: 'tag';
}

type CellProps = DefaultCellProps | NumberCellProps | TagCellProps;

type ColumnIndex = number | null;

/**
 *
 * @param format
 * @param align
 * @param children
 * @param colors as word color ('red'), hex value (#FF0000), or rgb (rgb(100,100,100)) - do NOT add alpha values, as that is automatically handled
 * @param className
 * @param soften
 * @param style
 * @param ...props HTMLDivElement
 *
 * @returns
 */
const Cell: FC<CellProps> = ({
    format,
    align = format === 'number' ? 'right' : 'left',
    children,
    colors,
    className: userClasses,
    soften,
    style,
    ...props
}) => {
    const { widthByColumn } = useTableContext();
    const ref = useRef<HTMLDivElement>(null);
    const [columnIndex, setColumnIndex] = useState<ColumnIndex>(null);

    useCellEffects({ ref, columnIndex, setColumnIndex });

    const width__wbc = widthByColumn.current[columnIndex];
    const [width, setWidth] = useState(width__wbc ?? 'auto');
    useEffect(() => {
        setWidth(width__wbc);
    }, [columnIndex, width__wbc]);

    const numberColor = getNumberColor({ children, format });
    const tag = getTag({ children, colors, format });

    const defaultClasses =
        'mm-max-h-16 mm-whitespace-nowrap mm-overflow-ellipsis mm-overflow-x-hidden';
    const alignClass = `mm-text-${align}`;
    const softenClass = soften ? 'mm-opacity-50' : '';
    const numberClass = numberColor ? `mm-text-${numberColor}-600` : '';

    return (
        <div
            className={twMerge(
                `${defaultClasses} ${alignClass} ${softenClass} ${numberClass} ${userClasses} `,
            )}
            ref={ref}
            style={{
                width,
                ...style,
            }}
            {...props}
        >
            {tag ?? children}
        </div>
    );
};

const useCellEffects = ({
    columnIndex,
    ref,
    setColumnIndex,
}: {
    columnIndex: ColumnIndex;
    ref: MutableRefObject<HTMLDivElement>;
    setColumnIndex: Dispatch<SetStateAction<ColumnIndex>>;
}) => {
    const {
        numColumns,
        setNumColumns,
        widthByColumn, //setWidthByColumn
    } = useTableContext();

    useEffect(() => {
        const refCurrent = ref.current;
        if (!refCurrent)
            throw new Error('ref is null - something has gone wrong');

        const children = refCurrent.parentElement?.children;
        if (!children)
            throw new Error(
                'no children in `Cell`s parent - this should not happen',
            );

        const numChildren = children.length;
        if (numColumns !== numChildren) {
            if (numColumns)
                throw new Error(
                    'incorrect # of columns. you most likely have a different number of `Cell`s being rendered in your `Headers` than `Cell`s in `Row`',
                );
            else setNumColumns(numChildren);
        }

        const newColumnIndex = [...children].indexOf(refCurrent);
        if (newColumnIndex !== columnIndex) setColumnIndex(newColumnIndex);

        const wbcCurrent = widthByColumn.current;

        if (wbcCurrent) {
            const columnWidth = wbcCurrent[newColumnIndex] ?? 0;

            if (refCurrent.offsetWidth > columnWidth)
                widthByColumn.current = {
                    ...wbcCurrent,
                    [newColumnIndex]: refCurrent.offsetWidth + 1,
                };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, widthByColumn]);
};

const getNumberColor = ({
    children,
    format,
}: {
    children: CellProps['children'];
    format: CellProps['format'];
}) => {
    let numberColor: 'red' | 'green' | null = null;

    if (format === 'number') {
        if (typeof children === 'string') {
            const childAsNumber = Number.parseFloat(children);
            if (!Number.isNaN(childAsNumber) && childAsNumber !== 0)
                numberColor = childAsNumber < 0 ? 'red' : 'green';
        } else if (typeof children === 'number')
            numberColor = children < 0 ? 'red' : 'green';
        else
            console.error(
                "format of `number` only works if the number/string is passed as the direct child of `Cell` - i.e. you can't render a ReactNode as a child with format",
            );
    }

    return numberColor;
};

const getTag = ({
    children,
    colors,
    format,
}: {
    children: CellProps['children'];
    colors: CellProps['colors'];
    format: CellProps['format'];
}) => {
    let tag: JSX.Element | null = null;

    if (format === 'tag') {
        if (typeof children === 'string') {
            let color: string = null;

            if (Array.isArray(colors)) {
                // colors: string[]
                // TODO
            } else if (colors instanceof Object) {
                // colors: Record<string,string>
                color = colors[children].trim();
            } else if (colors === 'random') {
                // colors: 'random'
                // TODO
            }

            let colorWithOpacity = color;
            if (color.includes('rgb')) {
                // color is rgb
                colorWithOpacity = color.slice(0, -1) + ', .15)'; // add 50% opacity
            } else if (color.charAt(0) === '#') {
                // color is hex
                colorWithOpacity += '15';
            } else {
                // color is word
                colorWithOpacity =
                    colorNameToRGB(color).slice(0, -1) + ', .15)';
                // color is rgb
            }

            tag = (
                <div
                    className="mm-w-fit mm-bg-opacity-50 mm-rounded-lg mm-py-1 mm-px-2.5 mm-my-0.5 mm-font-semibold mm-tracking-tight"
                    style={{ background: colorWithOpacity, color: color }}
                >
                    {children}
                </div>
            );
        } else
            console.error(
                'format of `tag` only works if the number/string is passed as the direct child of `Cell`',
            );
    }

    return tag;
};

export default Cell;
