"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccordions = exports.openAccordions = exports.Accordion = void 0;
const react_1 = __importStar(require("react"));
const web_1 = require("@react-spring/web");
const AccordionContext = (0, react_1.createContext)(null);
const useAccordionContext = () => {
    const context = (0, react_1.useContext)(AccordionContext);
    if (!context)
        throw new Error(`Accordion compound components cannot be rendered outside the Accordion component`);
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
    const [open, setOpen] = (0, react_1.useState)(false);
    const [accordionStyles, setAccordionStyles] = (0, web_1.useSpring)(() => ({
        // height: '0vh',
        maxHeight: '0vh',
        opacity: 0,
        transform: 'scale(0)',
        overflowY: 'auto'
    }));
    // const [contentHeight, setContentHeight] = useState<number>(0);
    // console.log({ contentHeight });
    (0, react_1.useEffect)(() => {
        setAccordionStyles({
            // TODO calculate maxHeight by the height of the content within? "auto"?
            // height: (open ? contentHeight : 0) + 'px',
            maxHeight: open ? '100vh' : '0vh',
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1)' : 'scale(0)',
            overflowY: 'auto'
        });
    }, [open, setAccordionStyles]);
    (0, react_1.useEffect)(() => {
        if (open)
            onOpen && onOpen();
        else
            onClose && onClose();
    }, [open]);
    const toggleOpen = (0, react_1.useCallback)(() => {
        setOpen((oldOpen) => !oldOpen);
    }, []);
    const contextVal = (0, react_1.useMemo)(() => ({
        accordionStyles,
        toggleOpen,
        open
        // setContentHeight
    }), [accordionStyles, toggleOpen, open]);
    return react_1.default.createElement(AccordionContext.Provider, { value: contextVal }, children);
};
exports.Accordion = Accordion;
/**
 * TODO how to use component
 * @param className fully override all styling classes with your own classes
 * @returns
 */
const Title = (_a) => {
    var { children, className = 'cursor-pointer bg-gray-300 h-16 p-5 whitespace-no-wrap overflow-hidden text-overflow-ellipsis border-t border-gray-100' } = _a, props = __rest(_a, ["children", "className"]);
    const { toggleOpen } = useAccordionContext();
    return (react_1.default.createElement("h3", Object.assign({ className: `${className}`, onClick: toggleOpen }, props), children));
};
/**
 * TODO how to use component
 * @param param0
 * @returns
 */
const Content = (0, react_1.forwardRef)(({ children, className }, forwardRef) => {
    const { accordionStyles, open, toggleOpen
    // setContentHeight
     } = useAccordionContext();
    (0, react_1.useImperativeHandle)(forwardRef, () => ({
        open,
        toggleOpen
    }));
    // const [contentRef, contentBounds] = useMeasure();
    // useEffect(() => {
    //     setContentHeight(contentBounds.height);
    // });
    return (react_1.default.createElement(web_1.animated.div, { style: accordionStyles, className: className, ref: forwardRef }, children));
});
Content.displayName = 'Content';
Accordion.Title = Title;
Accordion.Content = Content;
/**
 * @see https://gist.github.com/mechanicMo/58d6744e892445341d39f3c8f3324562
 * @param refList
 */
const openAccordions = (refList) => {
    var _a, _b, _c;
    for (const ref of refList) {
        if (((_a = ref.current) === null || _a === void 0 ? void 0 : _a.open) === false)
            (_c = (_b = ref.current).toggleOpen) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
};
exports.openAccordions = openAccordions;
/**
 * @see https://gist.github.com/mechanicMo/58d6744e892445341d39f3c8f3324562
 * @param refList
 */
const closeAccordions = (refList) => {
    var _a, _b, _c;
    for (const ref of refList) {
        if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.open)
            (_c = (_b = ref.current).toggleOpen) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
};
exports.closeAccordions = closeAccordions;
