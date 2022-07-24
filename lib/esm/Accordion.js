var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { useSpring, animated as a } from '@react-spring/web';
const AccordionContext = createContext(null);
const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context)
        throw new Error(
            `Accordion compound components cannot be rendered outside the Accordion component`
        );
    return context;
};
/**
 * Animated Accordion component that exposes two Compound Components, `Title` & `Content`
 * TODO: this is how you use the component
 * coming soon: ...
 * @param param0
 * @returns
 */
const Accordion = ({ children, onOpen, onClose }) => {
    const [open, setOpen] = useState(false);
    const [accordionStyles, setAccordionStyles] = useSpring(() => ({
        // height: '0vh',
        maxHeight: '0vh',
        opacity: 0,
        transform: 'scale(0)',
        overflowY: 'auto'
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
            overflowY: 'auto'
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
        () => ({
            accordionStyles,
            toggleOpen,
            open
            // setContentHeight
        }),
        [accordionStyles, toggleOpen, open]
    );
    return React.createElement(AccordionContext.Provider, { value: contextVal }, children);
};
/**
 * TODO how to use component
 * @param className fully override all styling classes with your own classes
 * @returns
 */
const Title = (_a) => {
    var {
            children,
            className = 'cursor-pointer bg-gray-300 h-16 p-5 whitespace-no-wrap overflow-hidden text-overflow-ellipsis border-t border-gray-100'
        } = _a,
        props = __rest(_a, ['children', 'className']);
    const { toggleOpen } = useAccordionContext();
    return React.createElement(
        'h3',
        Object.assign({ className: `${className}`, onClick: toggleOpen }, props),
        children
    );
};
/**
 * TODO how to use component
 * @param param0
 * @returns
 */
const Content = forwardRef(({ children, className }, forwardRef) => {
    const {
        accordionStyles,
        open,
        toggleOpen
        // setContentHeight
    } = useAccordionContext();
    useImperativeHandle(forwardRef, () => ({
        open,
        toggleOpen
    }));
    // const [contentRef, contentBounds] = useMeasure();
    // useEffect(() => {
    //     setContentHeight(contentBounds.height);
    // });
    return React.createElement(
        a.div,
        { style: accordionStyles, className: className, ref: forwardRef },
        children
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
export const openAccordions = (refList) => {
    var _a, _b, _c;
    for (const ref of refList) {
        if (((_a = ref.current) === null || _a === void 0 ? void 0 : _a.open) === false)
            (_c = (_b = ref.current).toggleOpen) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
};
/**
 * @see https://gist.github.com/mechanicMo/58d6744e892445341d39f3c8f3324562
 * @param refList
 */
export const closeAccordions = (refList) => {
    var _a, _b, _c;
    for (const ref of refList) {
        if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.open)
            (_c = (_b = ref.current).toggleOpen) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
};
