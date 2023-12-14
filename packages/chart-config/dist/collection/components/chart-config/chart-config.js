import { h } from "@stencil/core";
import * as echarts from "echarts";
const CT = {
    timeseries_panel: "line",
    bar_chart: "bar",
    gauge: "SCORE",
    pie_chart: "pie"
};
export class ChartConfig {
    constructor() {
        this.config = undefined;
        this.configOBJ = undefined;
        this.attr = {};
    }
    onConfigChange() {
        var _a;
        this.configOBJ = JSON.parse(this.config || '{}');
        this.attr.style = { background: ((_a = this.configOBJ.PanelOptions) === null || _a === void 0 ? void 0 : _a.transparentBackground) ? 'transparent' : "rgb(246 246 246)" };
        if (this.chart)
            this.chart.dispose();
        setTimeout(() => {
            this.setEchart();
        }, (60));
    }
    setEchart() {
        var _a;
        if (['timeseries_panel', 'bar_chart', 'gauge', 'pie_chart'].includes(this.configOBJ.ChartOptions.type)) {
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
                        type: CT[(_a = this.configOBJ.ChartOptions) === null || _a === void 0 ? void 0 : _a.type] || 'line',
                        smooth: true
                    }
                ]
            };
            if (!this.chartElement)
                return;
            this.chart = echarts.init(this.chartElement);
            this.chart.setOption(option);
        }
    }
    connectedCallback() {
        var _a;
        this.configOBJ = JSON.parse(this.config || '{}');
        this.configOBJ.PanelOptions = this.configOBJ.PanelOptions || {};
        this.configOBJ.ChartOptions = this.configOBJ.ChartOptions || {};
        this.attr.style = { background: ((_a = this.configOBJ.PanelOptions) === null || _a === void 0 ? void 0 : _a.transparentBackground) ? 'transparent' : "rgb(246 246 246)" };
    }
    componentDidLoad() {
        this.setEchart();
    }
    getBar() {
        if (this.configOBJ.ChartOptions.type === 'text_panel') {
            return h("div", null);
        }
        else if (this.configOBJ.ChartOptions.type === 'table_panel') {
            return h("div", null, h("table", { class: "tbl-data" }, h("thead", null, h("tr", null, h("th", null, "Mon"), h("th", null, "Tue"), h("th", null, "Wed"), h("th", null, "Thu"), h("th", null, "Fri"), h("th", null, "Sat"), h("th", null, "Sun"))), h("tbody", null, h("tr", null, h("td", null, "820"), h("td", null, "932"), h("td", null, "901"), h("td", null, "934"), h("td", null, "1290"), h("td", null, "1330"), h("td", null, "1320")), h("tr", null, h("td", null, "820"), h("td", null, "932"), h("td", null, "901"), h("td", null, "934"), h("td", null, "1290"), h("td", null, "1330"), h("td", null, "1320")), h("tr", null, h("td", null, "820"), h("td", null, "932"), h("td", null, "901"), h("td", null, "934"), h("td", null, "1290"), h("td", null, "1330"), h("td", null, "1320")))));
        }
        return h("div", { class: "chart", ref: (el) => this.chartElement = el });
    }
    render() {
        var _a, _b;
        return h("div", Object.assign({ class: "box" }, this.attr), h("div", { class: "header" }, h("b", null, (_a = this.configOBJ.PanelOptions) === null || _a === void 0 ? void 0 : _a.title), h("span", null, (_b = this.configOBJ.PanelOptions) === null || _b === void 0 ? void 0 : _b.description)), this.getBar());
    }
    static get is() { return "chart-config"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["chart-config.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["chart-config.css"]
        };
    }
    static get properties() {
        return {
            "config": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "config",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "configOBJ": {},
            "attr": {}
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "config",
                "methodName": "onConfigChange"
            }];
    }
}
//# sourceMappingURL=chart-config.js.map
