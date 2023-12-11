import { Component, h,Prop,State, Event, EventEmitter } from '@stencil/core';

export interface ConfigType {
    title:string;
    description:string;
    transparentBackground:boolean;
}

@Component({
  tag: 'panel-options',
  styleUrl: 'panel-options.css',
  shadow: true,
  
})
export class PanelOptions {
    @Prop() config:string;
    @State() configObj:ConfigType;
    @State() open:boolean = true;

    @Event({
        eventName: 'configChange',
        composed: false,
        cancelable: true,
        bubbles: true,
    }) configChange:EventEmitter;
    expOnClick(){
        this.open = !this.open;
    }

    updateAttributeChange(e:any,attr:string){
        this.configObj[attr]  =  e.currentTarget.value;
        this.configChange.emit(this.configObj);
    }
    updateTransparentBackground(e:any){
        this.configObj.transparentBackground =  e.currentTarget.checked;
        this.configChange.emit(this.configObj);
    }
    connectedCallback(){
        if(!this.config) return;
        this.configObj = JSON.parse(this.config);   
    }
    render() {
        return <div class="panel-options">
            <div class={`panel-set ${this.open?'open':'close'}`} >
                <div class="title box-middle"  onClick={()=> this.expOnClick()}>
                    <div class="css-exp-Icon box-middle" >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"></path></svg>
                    </div>
                    <label>Panel options</label>
                </div>
                
                <div class="css-content">
                    <div class="item">
                        <div class="label">Title</div>
                        <div class="enter">
                           
                            <input type="text" class="text-input" value={this.configObj?.title}  onChange={(e)=>this.updateAttributeChange(e,'title')} />
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">Description</div>
                        <div class="enter">
                            <textarea class="text-input area" value={this.configObj?.description} onChange={(e)=>this.updateAttributeChange(e,'description')}></textarea>
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">Transparent background</div>
                        <div class="enter">
                            <div class="css-checkbox" >
                                <input type="checkbox" checked={this.configObj?.transparentBackground} onChange={(e)=>this.updateTransparentBackground(e)} /><label ></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
