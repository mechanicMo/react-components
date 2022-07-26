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
// import useMeasure from 'react-use-measure';

// context
type AccordionContextValue = {
    accordionStyles: {
        // height: SpringValue<string>;
        maxHeight: SpringValue<string>;
        opacity: SpringValue<number>;
        transform: SpringValue<string>;
    };
    open: boolean;
    toggleOpen: () => void;
    // setContentHeight: React.Dispatch<React.SetStateAction<number>>;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context)
        throw new Error(
            `Accordion compound components cannot be rendered outside the Accordion component`,
        );

    return context;
};

// component
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
const Accordion: FC<PropsWithChildren<Props>> & AccordionComposition = ({
    children,
    onOpen,
    onClose,
}) => {
    const [open, setOpen] = useState(false);

    const [accordionStyles, setAccordionStyles] = useSpring(() => ({
        // height: '0vh',
        maxHeight: '0vh',
        opacity: 0,
        transform: 'scale(0)',
        overflowY: 'auto',
	}));

    // const [contentHeight, setContentHeight] = useState<number>(0);
    // console.log({ contentHeight });

    useEffect(() => {
        setAccordionStyles({
            // TODO calculate maxHeight by the height of the content within? "auto"?
            // height: (open ? contentHeight : 0) + 'px',
            maxHeight: open ? '100vh' : '0vh',
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1)' : 'scale(0)',
            overflowY: 'auto',
		});
    }, [open, setAccordionStyles]);

    useEffect(() => {
        if (open) {
            onOpen && onOpen();
        } else {
            onClose && onClose();
        }
    }, [onClose, onOpen, open]);

    const toggleOpen = useCallback(() => {
        setOpen((oldOpen) => !oldOpen);
    }, []);

    const contextVal = useMemo(
        () => ({
            accordionStyles,
            toggleOpen,
            open,
            // setContentHeight
        }),
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
    const { toggleOpen } = useAccordionContext();

    return (
        <h3 className={`${className}`} onClick={toggleOpen} {...props}>
            {children}
        </h3>
    );
};

export type AccordionContentRef = RefObject<
    Partial<
        HTMLDivElement & {
            open: AccordionContextValue['open'];
            toggleOpen: AccordionContextValue['toggleOpen'];
        }
    >
>;

/**
 * TODO how to use component
 * @param param0
 * @returns
 */
const Content = forwardRef<
    AccordionContentRef['current'],
    PropsWithChildren<HTMLAttributes<HTMLDivElement>>
>(({ children, className }, forwardRef) => {
    const {
        accordionStyles,
        open,
        toggleOpen,
        // setContentHeight
    } = useAccordionContext();

    useImperativeHandle(forwardRef, () => ({
        open,
        toggleOpen,
    }));

    // const [contentRef, contentBounds] = useMeasure();

    // useEffect(() => {
    //     setContentHeight(contentBounds.height);
    // });

    return (
        <a.div
            style={accordionStyles}
            className={className}
            ref={forwardRef as Ref<HTMLDivElement>}
		>
            {/* <div ref={contentRef}> */}
            {children}
            {/* </div> */}
        </a.div>
    );
});
Content.displayName = 'Content';

Accordion.Title = Title;
Accordion.Content = Content;

export { Accordion };

/**
 * @see https://gist.github.com/mechanicMo/58d6744e892445341d39f3c8f3324562
 * @param refList
 */
export const openAccordions = (refList: AccordionContentRef[]): void => {
    for (const ref of refList) {
        if (ref.current?.open === false) {
            ref.current.toggleOpen?.();
        }
    }
};

/**
 * @see https://gist.github.com/mechanicMo/58d6744e892445341d39f3c8f3324562
 * @param refList
 */
export const closeAccordions = (refList: AccordionContentRef[]): void => {
    for (const ref of refList) {
        if (ref.current?.open) {
            ref.current.toggleOpen?.();
        }
    }
};
