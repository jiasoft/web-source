import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { applyPolyfills as chartConfigApplyPolyfills, defineCustomElements as chartConfigDefineCustomElements } from '../../../../chart-config/loader';
import { applyPolyfills as chartAttrApplyPolyfills, defineCustomElements as chartAttrDefineCustomElements } from '../../../../chart-attribute/loader';
import { applyPolyfills as dsApplyPolyfills, defineCustomElements as dsDefineCustomElements } from '../../../../data-source-edit/loader';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-ng';
  constructor() {
    // chartConfigDefineCustomElements(window);
    // Angular中使用Stencil编写的Web组件
    // defineCustomElements(window);
    chartConfigApplyPolyfills().then(() => {
      chartConfigDefineCustomElements(window);
    });
    chartAttrApplyPolyfills().then(() => {
      chartAttrDefineCustomElements();
    });
     dsApplyPolyfills().then(() => {
       dsDefineCustomElements();
     });
  }

  config = JSON.stringify({
    PanelOptions:{
      title:"title",
      description:"description"
    }
  })
  onConfigChange = (e:any) => {
    this.config = JSON.stringify(e.detail);
  }
}
