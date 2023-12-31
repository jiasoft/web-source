/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ChartType } from "../../../types";
export { ChartType } from "../../../types";
export namespace Components {
    interface ChartAttribute {
        "config": string;
        "selectId": ChartType;
    }
    interface PanelOptions {
        "config": string;
    }
    interface ValueOptions {
        "config": object;
    }
}
export interface ChartAttributeCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLChartAttributeElement;
}
export interface PanelOptionsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPanelOptionsElement;
}
declare global {
    interface HTMLChartAttributeElementEventMap {
        "configChange": any;
    }
    interface HTMLChartAttributeElement extends Components.ChartAttribute, HTMLStencilElement {
        addEventListener<K extends keyof HTMLChartAttributeElementEventMap>(type: K, listener: (this: HTMLChartAttributeElement, ev: ChartAttributeCustomEvent<HTMLChartAttributeElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLChartAttributeElementEventMap>(type: K, listener: (this: HTMLChartAttributeElement, ev: ChartAttributeCustomEvent<HTMLChartAttributeElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLChartAttributeElement: {
        prototype: HTMLChartAttributeElement;
        new (): HTMLChartAttributeElement;
    };
    interface HTMLPanelOptionsElementEventMap {
        "configChange": any;
    }
    interface HTMLPanelOptionsElement extends Components.PanelOptions, HTMLStencilElement {
        addEventListener<K extends keyof HTMLPanelOptionsElementEventMap>(type: K, listener: (this: HTMLPanelOptionsElement, ev: PanelOptionsCustomEvent<HTMLPanelOptionsElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLPanelOptionsElementEventMap>(type: K, listener: (this: HTMLPanelOptionsElement, ev: PanelOptionsCustomEvent<HTMLPanelOptionsElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLPanelOptionsElement: {
        prototype: HTMLPanelOptionsElement;
        new (): HTMLPanelOptionsElement;
    };
    interface HTMLValueOptionsElement extends Components.ValueOptions, HTMLStencilElement {
    }
    var HTMLValueOptionsElement: {
        prototype: HTMLValueOptionsElement;
        new (): HTMLValueOptionsElement;
    };
    interface HTMLElementTagNameMap {
        "chart-attribute": HTMLChartAttributeElement;
        "panel-options": HTMLPanelOptionsElement;
        "value-options": HTMLValueOptionsElement;
    }
}
declare namespace LocalJSX {
    interface ChartAttribute {
        "config"?: string;
        "onConfigChange"?: (event: ChartAttributeCustomEvent<any>) => void;
        "selectId"?: ChartType;
    }
    interface PanelOptions {
        "config"?: string;
        "onConfigChange"?: (event: PanelOptionsCustomEvent<any>) => void;
    }
    interface ValueOptions {
        "config"?: object;
    }
    interface IntrinsicElements {
        "chart-attribute": ChartAttribute;
        "panel-options": PanelOptions;
        "value-options": ValueOptions;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "chart-attribute": LocalJSX.ChartAttribute & JSXBase.HTMLAttributes<HTMLChartAttributeElement>;
            "panel-options": LocalJSX.PanelOptions & JSXBase.HTMLAttributes<HTMLPanelOptionsElement>;
            "value-options": LocalJSX.ValueOptions & JSXBase.HTMLAttributes<HTMLValueOptionsElement>;
        }
    }
}
