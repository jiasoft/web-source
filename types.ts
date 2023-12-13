export type ChartType = 'timeseries_panel'|'bar_chart'|'gauge'|'pie_chart'|'table_panel' | 'text_panel';
export interface ChartOptions {
    type?:ChartType
}
export interface ConfigType {
    id?:string;
    PanelOptions?:any;
    ChartOptions?:ChartOptions;
}