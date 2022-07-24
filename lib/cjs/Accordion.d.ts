import React, { FC, HTMLAttributes, PropsWithChildren, RefObject } from 'react';
import { SpringValue } from '@react-spring/web';
declare type AccordionContextValue = {
    accordionStyles: {
        maxHeight: SpringValue<string>;
        opacity: SpringValue<number>;
        transform: SpringValue<string>;
    };
    open: boolean;
    toggleOpen: () => void;
};
interface AccordionComposition {
    Title: typeof Title;
    Content: typeof Content;
}
interface Props {
    onOpen?: () => void;
    onClose?: () => void;
}
/**
 * Animated Accordion component that exposes two Compound Components, `Title` & `Content`
 * TODO: this is how you use the component
 * coming soon: ...
 * @param param0
 * @returns
 */
declare const Accordion: FC<PropsWithChildren<Props>> & AccordionComposition;
/**
 * TODO how to use component
 * @param className fully override all styling classes with your own classes
 * @returns
 */
declare const Title: FC<PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>>;
export declare type AccordionContentRef = RefObject<Partial<HTMLDivElement & {
    open: AccordionContextValue['open'];
    toggleOpen: AccordionContextValue['toggleOpen'];
}>>;
/**
 * TODO how to use component
 * @param param0
 * @returns
 */
declare const Content: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<Partial<HTMLDivElement & {
    open: AccordionContextValue['open'];
    toggleOpen: AccordionContextValue['toggleOpen'];
}> | null>>;
export { Accordion };
export declare const openAccordions: (refList: AccordionContentRef[]) => void;
export declare const closeAccordions: (refList: AccordionContentRef[]) => void;
