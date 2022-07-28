import React, { FC, HTMLProps } from 'react';

import { twMerge } from 'tailwind-merge';

const Row: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    style,
    ...props
}) => (
    <div
        className={twMerge(
            `rc__Table__Row mm-flex mm-gap-4 mm-items-center mm-px-3 mm-py-2 ${className}`,
        )}
        style={{ scrollSnapAlign: 'start', ...style }}
        {...props}
    >
        {children}
    </div>
);

export default Row;
