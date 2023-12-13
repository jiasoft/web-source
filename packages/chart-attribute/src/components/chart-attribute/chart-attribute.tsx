import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

import './panel-options';
import './value-options';
import barchart from "../../icon/barchart.svg";
import icon_gauge from "../../icon/icon_gauge.svg";
import icon_piechart from "../../icon/icon_piechart.svg";
import icn_table_panel from "../../icon/icn-table-panel.svg";
import icn_timeseries_panel from "../../icon/icn-timeseries-panel.svg";
import icn_text_panel from "../../icon/icn-text-panel.svg";
import { ConfigType, ChartType } from "../../../../../types"


interface ChartItemType {
  icon: string;
  header: string;
  content: string;
  id: string;
}
@Component({
  tag: 'chart-attribute',
  styleUrl: 'chart-attribute.css',
  shadow: true,
})
export class ChartAttribute {
  @Prop() config: string;
  @Prop() selectId: ChartType = "text_panel";
  @State() configObj: ConfigType = {};
  @State() chartTypeData: ChartItemType[] = [
    {
      id:"text_panel",
      icon: icn_text_panel,
      header: "Text Panel",
      content: "Supports many column styles"
    },
    {
      id:"timeseries_panel",
      icon: icn_timeseries_panel,
      header: "Time series",
      content: "Time based line, area and bar charts"
    },
    {
      id:"bar_chart",
      icon: barchart,
      header: "Bar chart",
      content: "Categorical charts with group support"
    },
    {
      id:"gauge",
      icon: icon_gauge,
      header: "Gauge",
      content: "Standard gauge visualization"
    },

    {
      id:"pie_chart",
      icon: icon_piechart,
      header: "Pie chart",
      content: "The new core pie chart visualization"
    },
    {
      id:"table_panel",
      icon: icn_table_panel,
      header: "Table",
      content: "Supports many column styles"
    }
    
  ]
  @State() showSearchText: boolean = false;
  @Event({
    eventName: 'configChange',
    composed: false,
    cancelable: true,
    bubbles: true,
  }) configChange:EventEmitter;

  onConfigChange(ev:any){
    this.configObj.PanelOptions = ev.detail;
    this.configChange.emit(this.configObj);
  }
  chartTypeClickHandle(item:any){
    
    this.selectId = item.id;
    this.showSearchText = false;
    this.configObj.ChartOptions.type = this.selectId;
    this.configChange.emit(this.configObj);
  }
  curChartTypeClickHandle() {
    this.showSearchText = true;
  }
  get curChartItem(){
    if(!this.selectId) return null;
    return this.chartTypeData.find(item => item.id === this.selectId)
  }
  getChartTypeHtml(){

    return this.chartTypeData.map((item:ChartItemType) =>{ 
      return <div class="css-item"  title="Bar chart" onClick={() => this.chartTypeClickHandle(item)}>
      <img class="css-img" src={item.icon} alt="" />
      <div class="css-label">
        <div class="css-head">{item.header}</div>
        <span class="css-content">{item.content}</span>
      </div>
    </div>
    })
  }
  connectedCallback(){
    
    this.configObj = JSON.parse(this.config || "{}");
    if(!this.configObj.PanelOptions){
      this.configObj.PanelOptions = {};
    }
    if(!this.configObj.ChartOptions){
      this.configObj.ChartOptions = {};
      
    }
    this.selectId = this.configObj.ChartOptions.type || 'text_panel'
  }
  componentDidLoad(){
    
  }
  render() {
    return <div class="attr">
      
      {
        this.showSearchText?
        <div class="chart-type-list">
          
          <div class="search-text">
            <svg
              class="icon-search"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" width="16" height="16"
            >
              <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"></path>
            </svg>
            <input class="text" type="text" placeholder="Search for..." />
          </div>
          <div class="list">
            {this.getChartTypeHtml()}
          </div>
        </div>
        :
        <div>
          <div class="chart-type-item" onClick={() => this.curChartTypeClickHandle()} >
            <img class="css-img" src={this.curChartItem?.icon} alt="" />
            <div class="css-label">{this.curChartItem?.header}</div>
          </div>
          <panel-options config={JSON.stringify(this.configObj?.PanelOptions)} onConfigChange={(ev)=>this.onConfigChange(ev)}/>
          <value-options />
        </div>
      }
    
      
    </div>
  }
}
