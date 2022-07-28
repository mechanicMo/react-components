import React, { FC, HTMLProps, MutableRefObject, useRef } from 'react';

import { twMerge } from 'tailwind-merge';

export type OnScrollType = (ref: MutableRefObject<HTMLDivElement>) => void;

const Content: FC<
    Omit<HTMLProps<HTMLDivElement>, 'onScroll'> & { onScroll?: OnScrollType }
> = ({ children, className, onScroll, style, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={twMerge(
                `rc__Table__Content mm-flex mm-flex-col mm-overflow-y-scroll ${className}`,
            )}
            ref={ref}
            style={{ scrollSnapType: 'y mandatory', ...style }}
            onScroll={() => onScroll?.(ref as MutableRefObject<HTMLDivElement>)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Content;
