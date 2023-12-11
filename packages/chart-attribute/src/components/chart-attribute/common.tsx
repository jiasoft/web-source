import { FunctionalComponent, h } from '@stencil/core';
const expClick = (props:any) => {
    console.log(this,props);
}
interface PropsType {
    title?:string;
    open?:boolean;
}
export const chartPanelOptions : FunctionalComponent<PropsType> = (props) => {
    
    return <div class={`panel-set ${props.open?'open':'close'}`} >
        <div class="title box-middle" title={props?.title} >
            <div class="css-exp-Icon box-middle" onClick={()=> expClick(props)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"></path></svg>
            </div>
            <label>Panel options</label>
        </div>
        
        <div class="css-content">
            <div class="item">
                <div class="label">Title</div>
                <div class="enter">
                    <input type="text" class="text-input" />
                </div>
            </div>
            <div class="item">
                <div class="label">Description</div>
                <div class="enter">
                    <textarea class="text-input area"></textarea>
                </div>
            </div>
        </div>
    </div>;
}