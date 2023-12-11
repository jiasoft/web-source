export type ChartType = 'timeseries_panel'|'bar_chart'|'gauge'|'pie_chart'|'table_panel';
export interface ChartOptions {
    type?:ChartType
}
export interface ConfigType {
    PanelOptions?:any;
    ChartOptions?:ChartOptions;
}