import { ConfigType } from "../../../../../types";
export declare class ChartConfig {
    config: string;
    configOBJ: ConfigType;
    el: HTMLElement;
    chartElement: HTMLDivElement;
    chart: any;
    attr: any;
    onConfigChange(): void;
    setEchart(): void;
    connectedCallback(): void;
    componentDidLoad(): void;
    getBar(): any;
    render(): any;
}
