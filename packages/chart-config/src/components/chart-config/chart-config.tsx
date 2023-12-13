import { Component, Prop, Watch, State, h, Element } from '@stencil/core';
import * as echarts from 'echarts';
import { ConfigType } from "../../../../../types"


const CT:{[key:string]:string} = {
  timeseries_panel:"line",
  bar_chart:"bar",
  gauge:"SCORE",
  pie_chart:"pie"
}
@Component({
  tag: 'chart-config',
  styleUrl: 'chart-config.css',
  shadow: true,
})
export class ChartConfig {

  @Prop() config: string;

  @State() configOBJ: ConfigType;

  @Element() el!: HTMLElement;

  chartElement!: HTMLDivElement;
  chart!:any;

  @State() attr:any = {}
  @Watch('config')
  onConfigChange() {
    this.configOBJ = JSON.parse(this.config||'{}');
    this.attr.style = {background:this.configOBJ.PanelOptions?.transparentBackground?'transparent':"rgb(246 246 246)"}
    if(this.chart) this.chart.dispose();
    setTimeout(() => {
      this.setEchart();
    }, (60));
    
  }
  setEchart(){
    
    if(this.configOBJ.ChartOptions.type === 'table_panel'){
      return;
    }
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: CT[this.configOBJ.ChartOptions?.type] || 'line',
          smooth: true
        }
      ]
    };
    if(!this.chartElement) return;
    this.chart = echarts.init(this.chartElement);
    this.chart.setOption(option);
  }
  connectedCallback(){
    this.configOBJ = JSON.parse(this.config||'{}')
    this.configOBJ.PanelOptions = this.configOBJ.PanelOptions || {}
    this.configOBJ.ChartOptions = this.configOBJ.ChartOptions || {}
    this.attr.style = {background:this.configOBJ.PanelOptions?.transparentBackground?'transparent':"rgb(246 246 246)"}
  }
  componentDidLoad(){
    this.setEchart();
  }
  getBar(){
    if(this.configOBJ.ChartOptions.type === 'table_panel'){
      return <div>
        <table class="tbl-data">
          <thead>
            <tr>
              <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>820</td><td>932</td><td>901</td><td>934</td><td>1290</td><td>1330</td><td>1320</td>
            </tr>
            <tr>
              <td>820</td><td>932</td><td>901</td><td>934</td><td>1290</td><td>1330</td><td>1320</td>
            </tr>
            <tr>
              <td>820</td><td>932</td><td>901</td><td>934</td><td>1290</td><td>1330</td><td>1320</td>
            </tr>
          </tbody>
        </table>
      </div>
    } else if ( this.configOBJ.ChartOptions.type === 'text_panel'){
      return <div></div>
    }
    return <div class="chart"  ref={(el) => this.chartElement = el as HTMLDivElement}></div>
  }
  render() {
    return <div class="box" {...this.attr} >
      <div class="header">
        <b>{this.configOBJ.PanelOptions?.title}</b>
        <span>{this.configOBJ.PanelOptions?.description}</span>
      </div>
      {this.getBar()}
    </div>
  }
}
