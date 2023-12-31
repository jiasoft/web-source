/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "./stencil-public-runtime";
export namespace Components {
    interface ChartConfig {
        "config": string;
    }
}
declare global {
    interface HTMLChartConfigElement extends Components.ChartConfig, HTMLStencilElement {
    }
    var HTMLChartConfigElement: {
        prototype: HTMLChartConfigElement;
        new (): HTMLChartConfigElement;
    };
    interface HTMLElementTagNameMap {
        "chart-config": HTMLChartConfigElement;
    }
}
declare namespace LocalJSX {
    interface ChartConfig {
        "config"?: string;
    }
    interface IntrinsicElements {
        "chart-config": ChartConfig;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "chart-config": LocalJSX.ChartConfig & JSXBase.HTMLAttributes<HTMLChartConfigElement>;
        }
    }
}
