import type { Components, JSX } from "../types/components";

interface ChartConfig extends Components.ChartConfig, HTMLElement {}
export const ChartConfig: {
    prototype: ChartConfig;
    new (): ChartConfig;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
