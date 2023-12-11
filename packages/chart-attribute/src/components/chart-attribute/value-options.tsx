import { Component, h,Prop,State } from '@stencil/core';

@Component({
  tag: 'value-options',
  styleUrl: 'value-options.css',
  shadow: true,
})
export class ValueOptions {
    @Prop() config:object = {};
    @State() open:boolean = false;
    @State() selectedName:string = "Calculate"
    expOnClick(){
        this.open = !this.open;
    }
    render() {
        return <div class="value-options">
            <div class={`panel-set ${this.open?'open':'close'}`} >
                <div class="title box-middle"  onClick={()=> this.expOnClick()}>
                    <div class="css-exp-Icon box-middle" >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"></path></svg>
                    </div>
                    <label>Value options</label>
                </div>
                
                <div class="css-content">
                    <div class="head">
                        <div class="name">Show</div>
                        <div class="des">Calculate a single value per column or series or show each row</div>
                    </div>
                    <div class="tool-bar">
                        <button type="button" class={this.selectedName=='Calculate'?'selected':''} onClick={()=>this.selectedName='Calculate'}>Calculate</button>
                        <button type="button" class={this.selectedName=='AllValues'?'selected':''} onClick={()=>this.selectedName='AllValues'}>AllValues</button>
                    </div>
                </div>
            </div>
        </div>
    }
}
