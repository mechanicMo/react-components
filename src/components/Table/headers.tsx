import React, { FC, HTMLProps } from 'react';

import { twMerge } from 'tailwind-merge';

import Row from './row';

const Headers: FC<HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <Row
        className={twMerge(
            `mm-py-2 mm-items-center mm-bg-gray-300 mm-border-b mm-border-gray-400 mm-text-gray-600 mm-text-sm mm-font-medium ${className}`,
        )}
        {...props}
    >
        {children}
    </Row>
);

export default Headers;
