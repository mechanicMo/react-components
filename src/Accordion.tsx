import React, {
    createContext,
    FC,
    forwardRef,
    HTMLAttributes,
    PropsWithChildren,
    Ref,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';

import { useSpring, animated as a, SpringValue } from '@react-spring/web';

// TODO add feature for `openAccordions: AccordionRef[]` & `closeAccordions: AccordionRef[]`. use forwardRef - make examples of usage
// import { useTableContext } from 'components/UI/Table';

// context
type AccordionContextValue = {
    accordionStyles: {
        maxHeight: SpringValue<string>;
        opacity: SpringValue<number>;
        transform: SpringValue<string>;
    };
    open: boolean;
    toggleOpen: () => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error(
            `Accordion compound components cannot be rendered outside the Accordion component`,
        );
    }

    return context;
};

// component
interface AccordionComposition {
    Title: typeof Title;
    Content: typeof AnimatedDiv;
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
const Accordion: FC<PropsWithChildren<Props>> & AccordionComposition = ({
    children,
    onOpen,
    onClose,
}) => {
    const [open, setOpen] = useState(false);

    const [accordionStyles, setAccordionStyles] = useSpring(() => ({
        maxHeight: '0vh',
        opacity: 0,
        transform: 'scale(0)',
        overflowY: 'auto',
    }));

    useEffect(() => {
        setAccordionStyles({
            maxHeight: open ? '100vh' : '0vh',
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1)' : 'scale(0)',
            overflowY: 'auto',
        });
    }, [open, setAccordionStyles]);

    useEffect(() => {
        if (open) onOpen && onOpen();
        else onClose && onClose();
    }, [open]);

    const toggleOpen = useCallback(() => {
        setOpen((oldOpen) => !oldOpen);
    }, []);

    const contextVal = useMemo(
        () => ({ accordionStyles, toggleOpen, open }),
        [accordionStyles, toggleOpen, open],
    );

    return (
        <AccordionContext.Provider value={contextVal}>
            {children}
        </AccordionContext.Provider>
    );
};

/**
 * TODO how to use component
 * @param className fully override all styling classes with your own classes
 * @returns
 */
const Title: FC<PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>> = ({
    children,
    className = 'cursor-pointer bg-gray-300 h-16 p-5 whitespace-no-wrap overflow-hidden text-overflow-ellipsis border-t border-gray-100',
    ...props
}) => {
    const { toggleOpen, open } = useAccordionContext();

    return (
        <h3
            className={`${className} ${open ? 'ac_opened' : 'ac_closed'}`}
            onClick={toggleOpen}
            {...props}
        >
            {children}
        </h3>
    );
};

type RefType = Partial<HTMLDivElement> & {
    open: AccordionContextValue['open'];
    toggleOpen: AccordionContextValue['toggleOpen'];
};

/**
 * TODO how to use component
 * @param param0
 * @returns
 */
const AnimatedDiv = forwardRef<
    RefObject<RefType>['current'],
    PropsWithChildren<HTMLAttributes<HTMLDivElement>>
>(({ children, className }, forwardRef) => {
    const { accordionStyles, open, toggleOpen } = useAccordionContext();

    useImperativeHandle(forwardRef, () => ({
        open,
        toggleOpen,
    }));

    return (
        <a.div
            style={accordionStyles}
            className={className}
            ref={forwardRef as Ref<HTMLDivElement>}
        >
            {children}
        </a.div>
    );
});

Accordion.Title = Title;
Accordion.Content = AnimatedDiv;

export { Accordion };

export const openAccordions = (refList: RefObject<RefType>[]): void => {
    for (const ref of refList) {
        if (ref.current?.open === false) ref.current.toggleOpen();
    }
};

export const closeAccordions = (refList: RefObject<RefType>[]): void => {
    for (const ref of refList) {
        if (ref.current?.open) ref.current.toggleOpen();
    }
};
