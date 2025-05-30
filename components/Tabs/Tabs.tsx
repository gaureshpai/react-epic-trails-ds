import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    ReactElement,
    isValidElement,
    cloneElement,
    HTMLAttributes,
    ButtonHTMLAttributes,
} from "react";
import clsx from "clsx";

// Context setup
interface TabsContextProps {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// Tabs root
export const Tabs = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
            <div className={clsx("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

// TabList
export const TabList = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabList must be inside Tabs");

    return (
        <div
            className={clsx(
                "flex items-center gap-4 border-b border-gray-600 bg-gray-400 p-1 rounded-t-md",
                className
            )}
            {...props}
        >
            {React.Children.map(children, (child, index) =>
                isValidElement(child)
                    ? cloneElement(child as ReactElement, { index })
                    : child
            )}
        </div>
    );
};

type TabVariant = "basic" | "medium" | "top";

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: TabVariant;
    index?: number;
}

export const Tab = ({
    children,
    variant = "basic",
    index,
    className,
    ...props
}: TabProps) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("Tab must be inside Tabs");

    const { activeIndex, setActiveIndex } = context;
    const isActive = index === activeIndex;

    const baseStyle =
        "px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none";
    const variantStyle: Record<TabVariant, string> = {
        basic: "rounded-sm",
        medium: "rounded-md",
        top: "rounded-t-md",
    };

    const activeStyle = "text-black border-b-2 border-black";
    const inactiveStyle =
        "text-gray-800 hover:text-white hover:border-b-2 hover:border-white";

    return (
        <button
            onClick={() => setActiveIndex(index!)}
            className={clsx(
                baseStyle,
                variantStyle[variant],
                isActive ? activeStyle : inactiveStyle,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const TabPanels = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabPanels must be inside Tabs");

    const { activeIndex } = context;
    const childrenArray = React.Children.toArray(children);

    return (
        <div className={clsx("mt-6", className)} {...props}>
            {childrenArray[activeIndex]}
        </div>
    );
};

export const TabPanel = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={clsx(
                "p-4 bg-gray-50 text-black rounded-md ",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
