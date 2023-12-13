import { __decorate } from "tslib";
import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
const DRAG_ID = 100000;
export class GridLayoutWc extends LitElement {
    reRender() {
        this.RenderIndex++;
    }
    drawDragDataHtml() {
        return html `<div class="grid-item drag" drag="${true}" style="${this.getGridItemStyle(this.dragData)}"></div>`;
    }
    constructor() {
        super();
        this.RenderIndex = 0; //这个属性改动，页面才会render
        // static stylemap:CSSType = { borderWidth:'1', borderColor:'', borderStyle:'', backgroundColor:'' };
        this.griddingWidth = 10;
        this.gridMargin = 1;
        this.edit = false;
        this.layoutData = [];
        this.hideToolbar = false;
        this.curGridItemSubMenuPos = { x: 0, y: 0 };
        this.curGridItemSubMenuShow = false;
        this.curGridItemSubMenuGridData = null;
        this.oldLayoutData = "";
        this.styleMapEditing = false;
        this.showDialogGridStyle = false;
        this.dragData = { x: 0, y: 0, w: 60, h: 60, z: 0, id: DRAG_ID };
        this.draggIng = false;
        // stageHeight: number = 0;
        this.stageWidth = 1000;
        /** resize相关 */
        this.resizeFixPosition = { top: 0, left: 0 };
        this.resizeingPosition = { top: 0, left: 0 };
        this.resizeFixGridItemData = null;
        this.curResizingGridItemData = null;
        this.dataStore = [];
        this.dataStoreIndex = 0;
        this.curMovingGridItemData = null;
        this.movePosition = { left: 0, top: 0 };
        this.fixPosition = { left: 0, top: 0 };
        this.oldPosition = { left: 0, top: 0 };
        this.transition = false;
        //查找GridItem
        this.findGridItemData = (id) => {
            return this.layoutData.find((item) => item.id === id);
        };
        /**
         * 查找存在的最大的重叠交叉项
         * */
        this.findBigestOverlapItem = (dataList, x, y, w, h, exceptIds) => {
            const list = this.findOverlapItem(dataList, x, y, w, h, exceptIds);
            let BigestOverlapArea = -99999999999; //最大的重叠交叉面积
            let BigestOverlapItem = undefined;
            list.forEach((item) => {
                let curItemX = item.x;
                let curItemY = item.y;
                let curItemW = item.w;
                let curItemH = item.h;
                // if (this.curActiveGridItem && this.curActiveGridItem.id === item.id && this.dragData) {
                //   curItemX = this.dragData.x;
                //   curItemY = this.dragData.y;
                //   curItemW = this.dragData.w;
                //   curItemH = this.dragData.h;
                // }
                const overX1 = Math.max(x, curItemX);
                const overX2 = Math.min(x + w, curItemX + curItemW);
                const overW = overX2 - overX1;
                const overY1 = Math.max(y, curItemY);
                const overY2 = Math.min(y + h, curItemY + curItemH);
                const overH = overY2 - overY1;
                const overArea = overH * overW;
                if (overArea > BigestOverlapArea) {
                    BigestOverlapArea = overArea;
                    BigestOverlapItem = item;
                }
            });
            return BigestOverlapItem;
        };
        /**
         * 获取交叉的GridItem 列表
         * @param x x
         * @param y y
         * @param w w
         * @param h h
         * @param exceptIds 排序的id
         * @returns 交叉的GridItem 列表
         */
        this.findOverlapItem = (dataList, x, y, w, h, exceptIds, overCount = 0) => {
            const list = [];
            let data = dataList.filter((item) => !item.float);
            if (this.curActiveGridItem && this.dragData) {
                if (!data.find(item => item.id === this.dragData.id)) {
                    data = [...data, this.dragData];
                }
            }
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (exceptIds && exceptIds.indexOf(item.id) >= 0) {
                    continue;
                }
                let curItemX = item.x;
                let curItemY = item.y;
                let curItemW = item.w;
                let curItemH = item.h;
                let x1 = Math.min(curItemX, x);
                let x2 = Math.max(curItemX + curItemW, x + w);
                let y1 = Math.min(curItemY, y);
                let y2 = Math.max(curItemY + curItemH, y + h);
                //是否存在交叉的算法
                if (((x2 - x1) - (curItemW + w) + overCount) < this.gridMargin &&
                    ((y2 - y1) - (curItemH + h) + overCount) < this.gridMargin) {
                    list.push(item);
                }
            }
            return list;
        };
        /**
         * 转换成的GidPosition
         * @param left style.left
         * @param top style.top
         * @returns {x,y}
         */
        this.calcNearPosition = (left, top) => {
            let x = Math.round(left / this.griddingWidth);
            let y = Math.round(top / this.griddingWidth);
            return { x, y };
        };
        /**
         * 返回 上次的layout
         * @returns JSON
         */
        this.getBackLayout = () => {
            this.dataStoreIndex--;
            return this.dataStore[this.dataStoreIndex];
        };
        /**
         * 打开上次的保存layout
         */
        this.backLayout = () => {
            const data = this.getBackLayout();
            if (data) {
                this.layoutData = JSON.parse(data);
            }
        };
        /** 下一个layout */
        this.getForwardLayout = () => {
            this.dataStoreIndex = this.dataStore.length - 1 > this.dataStoreIndex ? this.dataStoreIndex + 1 : this.dataStore.length - 1;
            return this.dataStore[this.dataStoreIndex];
        };
        /** 打开下一步的layout */
        this.forwardLayout = () => {
            const data = this.getForwardLayout();
            if (data) {
                this.layoutData = JSON.parse(data);
            }
        };
        //关闭事件
        this.close = () => {
            const emit = new Event('close');
            emit.detail = this.layoutData;
            this.dispatchEvent(emit);
        };
        this.save = () => {
            const emit = new Event('save');
            emit.detail = this.layoutData;
            this.dispatchEvent(emit);
        };
        //浮动事件
        this.gridItemFloat = (event) => {
            const gridItem = this.getGridItem(event === null || event === void 0 ? void 0 : event.currentTarget);
            if (gridItem) {
                gridItem.float = !gridItem.float;
                let z = 0;
                this.layoutData.filter(item => item.float).forEach(item => { z = z < item.z ? item.z : z; });
                if (gridItem.float) {
                    gridItem.z = z + 1;
                }
                else {
                    gridItem.z = 0;
                }
            }
            this.reRender();
        };
        //浮动事件
        this.gridItemFloatBySubMenu = () => {
            const gridItem = this.curGridItemSubMenuGridData;
            if (gridItem) {
                gridItem.float = !gridItem.float;
                let z = 0;
                this.layoutData.filter(item => item.float).forEach(item => { z = z < item.z ? item.z : z; });
                if (gridItem.float) {
                    gridItem.z = z + 1;
                }
                else {
                    gridItem.z = 0;
                }
                this.closeGridItemSubMenu();
                this.reRender();
            }
        };
    }
    //add
    addGridItem() {
        const w = 30;
        const h = 12;
        let { x, y } = this.getEmptyBound(w, h);
        let time = new Date().getTime();
        const item = { x, y, w, h, z: 0, id: time, slot: "slot_" + time.toString(), title: time.toString() };
        this.layoutData.push(item);
        this.reRender();
        this.saveCurLayout();
        return item;
    }
    /**
     * 获取空间的位置
     * @param w
     * @param h
     * @returns { x, y }
     */
    getEmptyBound(w, h) {
        this.stageWidth = this.getBoundingClientRect().width;
        let x = this.gridMargin, y = this.gridMargin;
        let item = this.findBigestOverlapItem(this.layoutData, x, y, w, h);
        while (item) {
            x = item.x + item.w + this.gridMargin;
            if ((x + this.gridMargin) * this.griddingWidth + w * this.griddingWidth > this.stageWidth) {
                y += this.gridMargin;
                x = this.gridMargin;
            }
            item = this.findBigestOverlapItem(this.layoutData, x, y, w, h);
        }
        return { x, y };
    }
    /**
     * Resize start
     * @param event MouseEvent
     */
    gridItemResizeStart(event) {
        if (!this.edit)
            return;
        event.preventDefault();
        event.stopPropagation();
        const index = this.getGridItemIndex(event.currentTarget);
        this.curResizingGridItemData = this.layoutData[index];
        this.resizeFixGridItemData = { ...this.layoutData[index] };
        this.resizeFixPosition.left = event.clientX;
        this.resizeFixPosition.top = event.clientY;
        this.resizeingPosition.left = event.clientX;
        this.resizeingPosition.top = event.clientY;
        this.transition = true;
        this.reRender();
        document.body.setAttribute("onselectstart", "return false");
        document.body.style.cursor = "se-resize";
        const mouseMove = (event) => {
            this.gridItemResizeing(event);
        };
        let { x, y, w, h, id } = this.curResizingGridItemData;
        this.dragData.x = x;
        this.dragData.y = y;
        this.dragData.w = w;
        this.dragData.h = h;
        const mouseup = () => {
            document.body.removeAttribute("onselectstart");
            document.body.style.cursor = "";
            this.gridItemResizeEnd();
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseup);
        };
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseup);
    }
    /**
     * resizeing
     * @param event
     */
    gridItemResizeing(event) {
        var _a, _b, _c, _d, _e;
        if (!this.edit)
            return;
        this.resizeingPosition.left = event.clientX;
        this.resizeingPosition.top = event.clientY;
        if (!this.resizeFixGridItemData)
            return;
        let w = ((_a = this.resizeFixGridItemData) === null || _a === void 0 ? void 0 : _a.w) + Math.round((this.resizeingPosition.left - this.resizeFixPosition.left) / this.griddingWidth);
        let h = ((_b = this.resizeFixGridItemData) === null || _b === void 0 ? void 0 : _b.h) + Math.round((this.resizeingPosition.top - this.resizeFixPosition.top) / this.griddingWidth);
        let x = (_c = this.resizeFixGridItemData) === null || _c === void 0 ? void 0 : _c.x;
        let y = (_d = this.resizeFixGridItemData) === null || _d === void 0 ? void 0 : _d.y;
        let z = (_e = this.resizeFixGridItemData) === null || _e === void 0 ? void 0 : _e.z;
        if (this.curResizingGridItemData.float) {
            this.draggIng = true;
            this.dragData.x = x;
            this.dragData.y = y;
            this.dragData.w = w;
            this.dragData.h = h;
            this.dragData.z = z;
            this.curResizingGridItemData.style = { width: w * this.griddingWidth, height: h * this.griddingWidth, left: x * this.griddingWidth, top: y * this.griddingWidth };
            this.reRender();
            return;
        }
        let height = this.resizeFixGridItemData.h * this.griddingWidth + (this.resizeingPosition.top - this.resizeFixPosition.top);
        let width = this.resizeFixGridItemData.w * this.griddingWidth + (this.resizeingPosition.left - this.resizeFixPosition.left);
        if (width > this.stageWidth - x * this.griddingWidth) {
            width = this.stageWidth - x * this.griddingWidth;
        }
        this.curResizingGridItemData.style = { width, height, left: x * this.griddingWidth, top: y * this.griddingWidth };
        /** 不允许超出griddingWidth */
        w = w * this.griddingWidth <= this.stageWidth - (x + this.gridMargin) * this.griddingWidth ?
            w : Math.floor(this.stageWidth / this.griddingWidth) - x - this.gridMargin;
        w = w < 8 ? 8 : w;
        h = h < 3 ? 3 : h;
        this.draggIng = true;
        this.dragData.x = x;
        this.dragData.y = y;
        this.dragData.w = w;
        this.dragData.h = h;
        this.rearrangement();
        this.reRender();
    }
    /**
     * Resize end
     */
    gridItemResizeEnd() {
        if (!this.edit)
            return;
        this.draggIng = false;
        let { x, y, w, h } = this.dragData;
        this.curResizingGridItemData.x = x;
        this.curResizingGridItemData.y = y;
        this.curResizingGridItemData.w = w;
        this.curResizingGridItemData.h = h;
        delete this.curResizingGridItemData.style;
        this.curResizingGridItemData = null;
        this.rearrangement();
        this.transition = false;
        this.reRender();
        this.saveCurLayout();
    }
    /**
     * ItemStyle事件
     * @param data GridItemData
     * @returns
     */
    getGridItemStyle(data) {
        const ActiveZindex = 10000;
        const DragZInxex = 9999;
        const FloatZindex = 100000;
        const css = [];
        if (data.userStyle) {
            const attr = [];
            if (data.userStyle.borderWidth)
                attr.push(`border-width:${data.userStyle.borderWidth}px;`);
            if (data.userStyle.borderStyle)
                attr.push(`border-style:${data.userStyle.borderStyle};`);
            if (data.userStyle.borderColor)
                attr.push(`border-color:${data.userStyle.borderColor};`);
            if (data.userStyle.borderRadius)
                attr.push(`border-radius:${data.userStyle.borderRadius}px;`);
            if (data.userStyle.backgroundColor)
                attr.push(`background-color:${data.userStyle.backgroundColor};`);
            css.push(`
        ${attr.join('')}
      `);
        }
        if (data.style) {
            css.push(`
      transition:none;
      left:${data.style.left}px;
      top:${data.style.top}px;
      z-index:${data.float ? FloatZindex + (data.z || 0) : ActiveZindex};
      width:${data.style.width}px; 
      height:${data.style.height}px`);
            return css.join('');
        }
        const style = { left: data.x * this.griddingWidth, top: data.y * this.griddingWidth, width: data.w * this.griddingWidth, height: data.h * this.griddingWidth };
        let zIndex = data.z || 0;
        if (data.id === DRAG_ID)
            zIndex = DragZInxex;
        if (data.float)
            zIndex = FloatZindex + (data.z || 0);
        css.push(`
      left:${style.left}px;
      top:${style.top}px;
      z-index:${zIndex};
      width:${style.width}px; 
      height:${style.height}px;`);
        return css.join('');
    }
    /** 保存Layout */
    saveCurLayout() {
        let jsonstr = JSON.stringify(this.layoutData);
        let json = JSON.stringify(JSON.parse(jsonstr).map((item) => {
            delete item.time;
            delete item.selected;
            return item;
        }));
        if (json != this.dataStore[this.dataStoreIndex]) {
            this.dataStoreIndex++;
            this.dataStore[this.dataStoreIndex] = json;
        }
    }
    animateGridItem(item, w = 3, h = 2) {
        return new Promise(resolve => {
            let minusW = Math.floor((item.w - w) / 5);
            let minusH = Math.floor((item.h - h) / 5);
            if (minusW < 1)
                minusW = 1;
            if (minusH < 1)
                minusH = 1;
            const animate = () => {
                item.w -= minusW;
                item.h -= minusH;
                if (item.w < w) {
                    item.w = w;
                }
                if (item.h < h) {
                    item.h = h;
                }
                this.rearrangement();
                this.reRender();
                if (item.w > w || item.h > h) {
                    window.requestAnimationFrame(() => { animate(); });
                }
                else {
                    resolve(null);
                }
            };
            animate();
        });
    }
    /** 移除GridItem */
    async gridItemClose(event) {
        const index = this.getGridItemIndex(event.currentTarget);
        const item = this.layoutData[index];
        await this.animateGridItem(item, 3, 3);
        this.layoutData.splice(index, 1);
        this.transition = false;
        this.rearrangement();
        this.reRender();
    }
    closeGridItemSubMenu() {
        this.curGridItemSubMenuShow = false;
        this.curGridItemSubMenuGridData = null;
    }
    /** 移除GridItem */
    async gridItemCloseBySubMenu() {
        if (!this.curGridItemSubMenuGridData)
            return;
        const item = this.curGridItemSubMenuGridData;
        const index = this.layoutData.findIndex((a) => a.id === item.id);
        await this.animateGridItem(item, 3, 3);
        this.layoutData.splice(index, 1);
        this.transition = false;
        this.closeGridItemSubMenu();
        this.rearrangement();
        this.reRender();
    }
    getGridItemIndex(target) {
        const grid = (target === null || target === void 0 ? void 0 : target.closest('.grid-item')) || null;
        return Number((grid === null || grid === void 0 ? void 0 : grid.dataset.index) || '0');
    }
    getGridItem(target) {
        const index = this.getGridItemIndex(target);
        return this.layoutData[index];
    }
    /**
     * 拖拽开始
     * @param event PointerEvent
     * @returns void
     */
    gridItemDragstart(event) {
        var _a, _b;
        if (!this.edit)
            return;
        const target = event === null || event === void 0 ? void 0 : event.target;
        if (target === null || target === void 0 ? void 0 : target.closest('.grid-item-close')) {
            this.styleMapEditing = false;
            this.gridItemClose(event);
            return;
        }
        if (target === null || target === void 0 ? void 0 : target.closest('.set-float')) {
            this.gridItemFloat(event);
            return;
        }
        if (target === null || target === void 0 ? void 0 : target.closest('.btn-more')) {
            const rect = target.getBoundingClientRect();
            const parentRect = ((_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect()) || { left: 0, top: 0, width: this.stageWidth, height: this.stageHeight };
            this.curGridItemSubMenuPos.x = rect.left - parentRect.left + rect.width;
            this.curGridItemSubMenuPos.y = rect.top - parentRect.top + rect.height;
            this.curGridItemSubMenuShow = true;
            this.curGridItemSubMenuGridData = this.getGridItem(event.currentTarget);
            this.layoutData.forEach((item) => { delete item.selected; });
            this.curGridItemSubMenuGridData.selected = true;
            this.reRender();
            return;
        }
        this.closeGridItemSubMenu();
        event.preventDefault();
        const grid = this.getGridItem(event.currentTarget);
        if (this.curSelectGridItem && this.curSelectGridItem.id !== grid.id) {
            this.styleMapEditing = false;
        }
        this.curMovingGridItemData = grid;
        if (!this.curMovingGridItemData)
            return;
        const { w, h, x, y, id } = this.curMovingGridItemData;
        this.movePosition = {
            left: this.curMovingGridItemData.x * this.griddingWidth,
            top: this.curMovingGridItemData.y * this.griddingWidth
        };
        this.fixPosition.left = event.clientX;
        this.fixPosition.top = event.clientY;
        this.oldPosition.left = this.movePosition.left;
        this.oldPosition.top = this.movePosition.top;
        this.layoutData.forEach((item) => { if (item.id !== this.curMovingGridItemData.id)
            delete item.selected; });
        this.curMovingGridItemData.selected = true;
        this.dragData.w = w;
        this.dragData.h = h;
        this.dragData.x = x;
        this.dragData.y = y;
        this.transition = true;
        this.oldLayoutData = JSON.stringify(this.layoutData);
        this.reRender();
        const onDragging = (event) => {
            if (!this.curMovingGridItemData)
                return;
            this.curMovingGridItemData.selected = true;
            this.movePosition.left = this.oldPosition.left + (event.clientX - this.fixPosition.left);
            this.movePosition.top = this.oldPosition.top + (event.clientY - this.fixPosition.top);
            if (!this.edit)
                return;
            this.draggIng = true;
            const { w, h, id } = this.curMovingGridItemData;
            this.dragData.w = w;
            this.dragData.h = h;
            let height = this.curMovingGridItemData.h * this.griddingWidth;
            let width = this.curMovingGridItemData.w * this.griddingWidth;
            this.curMovingGridItemData.style = { width, height, left: this.movePosition.left, top: this.movePosition.top };
            const { x, y } = this.calcNearPosition(this.movePosition.left, this.movePosition.top);
            if (this.curMovingGridItemData.float) {
                this.dragData.x = x;
                this.dragData.y = y;
                this.reRender();
                return;
            }
            const newPos = this.getNearEmptyPosition({ x, y, w, h, id: 0, z: 0 });
            if (newPos) {
                this.dragData.x = newPos.x;
                this.dragData.y = newPos.y;
            }
            this.rearrangement();
            this.reRender();
        };
        const onDragEnd = () => {
            if (!this.edit)
                return;
            this.draggIng = false;
            if (!this.curMovingGridItemData)
                return;
            delete this.curMovingGridItemData.style;
            this.curMovingGridItemData.x = this.dragData.x;
            this.curMovingGridItemData.y = this.dragData.y;
            this.curMovingGridItemData.time = new Date().getTime();
            this.curMovingGridItemData = null;
            this.transition = false;
            this.oldLayoutData = "";
            this.reRender();
            this.saveCurLayout();
            document.body.removeAttribute("onselectstart");
            window.removeEventListener("mousemove", onDragging);
            window.removeEventListener("mouseup", onDragEnd);
        };
        document.body.setAttribute("onselectstart", "return false");
        window.addEventListener("mousemove", onDragging);
        window.addEventListener("mouseup", onDragEnd);
    }
    /**
     * 获取最近的空间
     * @param grid :GridItemData
     * @returns {x,y}
     */
    getNearEmptyPosition(grid) {
        const overMax = 10;
        let { x, y, w, h } = grid;
        if (y < this.gridMargin)
            y = this.gridMargin;
        if (x < this.gridMargin)
            x = this.gridMargin;
        x = x < this.gridMargin ? this.gridMargin : x;
        x = (x + w + this.gridMargin) > Math.floor(this.stageWidth / this.griddingWidth) ?
            Math.floor(this.stageWidth / this.griddingWidth) - this.gridMargin - w : x;
        const overList = this.findOverlapItem(this.layoutData, x, y, w, h, [this.dragData.id, this.curActiveGridItem.id]);
        overList.forEach(overItem => {
            let overW = w + overItem.w - (Math.max(x + w, overItem.x + overItem.w) - Math.min(x, overItem.x));
            let overH = h + overItem.h - (Math.max(y + h, overItem.y + overItem.h) - Math.min(y, overItem.y));
            if (overH < overW) {
                if (overH < overMax && overH < overItem.h && overH < h) {
                    if (y < overItem.y)
                        y = overItem.y - h - this.gridMargin;
                    else
                        y = overItem.y + overItem.h + this.gridMargin;
                }
            }
            else {
                if (overW < overMax && overW < overItem.w && overW < w) {
                    if (x < overItem.x)
                        x = overItem.x - w - this.gridMargin;
                    else
                        return x = overItem.x + overItem.w + this.gridMargin;
                }
            }
        });
        return { x, y };
    }
    //GridLayout的点击事件
    onGridLayoutClick(event) {
        var _a, _b, _c, _d, _e;
        if ((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.closest(".toolbar"))
            return;
        if ((_b = event === null || event === void 0 ? void 0 : event.target) === null || _b === void 0 ? void 0 : _b.closest(".grid-item"))
            return;
        if ((_c = event === null || event === void 0 ? void 0 : event.target) === null || _c === void 0 ? void 0 : _c.closest("[slot]"))
            return;
        if ((_d = event === null || event === void 0 ? void 0 : event.target) === null || _d === void 0 ? void 0 : _d.closest(".btn-more"))
            return;
        if ((_e = event === null || event === void 0 ? void 0 : event.target) === null || _e === void 0 ? void 0 : _e.closest(".box-menu"))
            return;
        this.layoutData.forEach((item) => { delete item.selected; });
        this.styleMapEditing = false;
        this.closeGridItemSubMenu();
        this.reRender();
    }
    //获取GridItem的TOP y座标
    getGridItemTopY(dataList, grid, exceptIds) {
        let { x, h, w, y } = grid;
        let item = this.findBigestOverlapItem(dataList, x, y - this.gridMargin, w, h, exceptIds);
        while (!item) {
            y = y - this.gridMargin;
            if (y <= this.gridMargin) {
                y = this.gridMargin;
                return { x, y };
            }
            item = this.findBigestOverlapItem(dataList, x, y - this.gridMargin, w, h, exceptIds);
        }
        return { x, y };
    }
    //计算交叉点
    calcOverArea(data1, data2) {
        const overX1 = Math.max(data1.x, data2.x);
        const overX2 = Math.min(data1.x + data1.w, data2.x + data2.w);
        const overW = overX2 - overX1;
        const overY1 = Math.max(data1.y, data2.y);
        const overY2 = Math.min(data1.y + data1.h, data2.y + data1.h);
        const overH = overY2 - overY1;
        const overArea = overH * overW;
        return overArea;
    }
    // changeInput(attr: "borderStyle" | "borderColor" | "borderWidth" | "backgroundColor" | "borderRadius", e:any){
    //   if(this.curSelectGridItemUserStyle){
    //     this.curSelectGridItemUserStyle[attr] = e.currentTarget.value;
    //     this.reRender();
    //   }
    // }
    dialogChangeInput(attr, e) {
        if (this.curGridItemSubMenuGridDataUserStyle) {
            this.curGridItemSubMenuGridDataUserStyle[attr] = e.currentTarget.value;
            this.reRender();
        }
    }
    //排序上面有空白的地方
    sortTopSpace(list) {
        var _a, _b;
        let maxWidth = Math.round(this.stageWidth / this.griddingWidth);
        let maxHeight = Math.round(this.stageHeight / this.griddingWidth);
        for (let sx = this.gridMargin; sx < maxWidth; sx += this.griddingWidth) {
            for (let sy = this.gridMargin; sy < maxHeight; sy += this.griddingWidth) {
                let w = this.griddingWidth;
                let h = this.griddingWidth;
                let item = this.findBigestOverlapItem(list, sx, sy, w, h, [(_a = this.curActiveGridItem) === null || _a === void 0 ? void 0 : _a.id]);
                if (item) {
                    let { x, y } = this.getGridItemTopY(list, item, [(_b = this.curActiveGridItem) === null || _b === void 0 ? void 0 : _b.id, item.id]);
                    item.x = x;
                    item.y = y;
                    sy = item.y + item.h;
                }
            }
        }
    }
    //排序底部重叠的地方
    sortBottomOver(list) {
        var _a;
        for (let item of list) {
            if (item.float) {
                continue;
            }
            if (((_a = this.curMovingGridItemData) === null || _a === void 0 ? void 0 : _a.id) === item.id) {
                continue;
            }
            this.pressDownOver(list, item);
        }
    }
    //往下压
    pressDownOver(list, item) {
        var _a, _b;
        let { id, x, y, w, h } = item;
        let newList = this.findOverlapItem(list, x, y, w, h, [id, (_a = this.dragData) === null || _a === void 0 ? void 0 : _a.id, (_b = this.curActiveGridItem) === null || _b === void 0 ? void 0 : _b.id]);
        if (newList.length) {
            for (let i = 0; i < newList.length; i++) {
                newList[i].y = y + h + this.gridMargin;
                this.pressDownOver(list, newList[i]);
            }
        }
    }
    //重新排序
    rearrangement() {
        let list = [...this.layoutData];
        if (this.curActiveGridItem) {
            list = [...list, this.dragData];
        }
        this.sortBottomOver(list);
        this.sortTopSpace(list);
        this.layoutData = list.filter(item => {
            if (item.id === DRAG_ID) {
                this.dragData = item;
                return false;
            }
            return true;
        }).map(item => {
            var _a;
            if (item.id === ((_a = this.curActiveGridItem) === null || _a === void 0 ? void 0 : _a.id)) {
                return this.curActiveGridItem;
            }
            return item;
        });
        this.reRender();
    }
    //向上
    setZindexUp() {
        var _a;
        if (!((_a = this.curSelectGridItem) === null || _a === void 0 ? void 0 : _a.float)) {
            return;
        }
        let floatGridItems = this.layoutData.filter(item => item.float);
        floatGridItems = floatGridItems.sort((a, b) => a.z - b.z);
        floatGridItems.forEach((item, i) => {
            item.z = i;
        });
        let index = floatGridItems.findIndex((item) => { var _a; return item.id === ((_a = this.curSelectGridItem) === null || _a === void 0 ? void 0 : _a.id); });
        if (index >= floatGridItems.length - 1)
            return;
        const item = floatGridItems.splice(index, 1);
        floatGridItems.splice(index + 1, 0, item[0]);
        floatGridItems.forEach((item, i) => {
            item.z = i;
        });
        this.reRender();
    }
    //向下
    setZindexDown() {
        var _a;
        if (!((_a = this.curSelectGridItem) === null || _a === void 0 ? void 0 : _a.float)) {
            return;
        }
        let floatGridItems = this.layoutData.filter(item => item.float);
        floatGridItems = floatGridItems.sort((a, b) => a.z - b.z);
        floatGridItems.forEach((item, i) => {
            item.z = i;
        });
        let index = floatGridItems.findIndex((item) => { var _a; return item.id === ((_a = this.curSelectGridItem) === null || _a === void 0 ? void 0 : _a.id); });
        if (index === 0)
            return;
        const item = floatGridItems.splice(index, 1);
        floatGridItems.splice(index - 1, 0, item[0]);
        floatGridItems.forEach((item, i) => {
            item.z = i;
        });
        this.reRender();
        ;
    }
    openSetStyle() {
        if (!this.curSelectGridItem)
            return;
        if (!this.curSelectGridItem.userStyle) {
            this.curSelectGridItem.userStyle = {
                borderWidth: '1',
                borderColor: "",
                borderStyle: "",
                backgroundColor: ""
            };
        }
        this.styleMapEditing = !this.styleMapEditing;
        this.reRender();
    }
    openSetStyleBySubMenu() {
        if (!this.curGridItemSubMenuGridData)
            return;
        if (!this.curGridItemSubMenuGridData.userStyle) {
            this.curGridItemSubMenuGridData.userStyle = {
                borderWidth: '1',
                borderColor: "",
                borderStyle: "",
                backgroundColor: ""
            };
        }
        this.showDialogGridStyle = true;
        this.reRender();
    }
    // openConfigSet() {
    //   if(!this.curSelectGridItem) return;
    //   const emit: any = new Event('openConfigSet');
    //   emit.detail = this.curSelectGridItem;
    //   this.dispatchEvent(emit);
    // }
    openConfigSetBySubMenu() {
        if (!this.curGridItemSubMenuGridData)
            return;
        const emit = new Event('openConfigSet');
        emit.detail = this.curGridItemSubMenuGridData;
        this.closeGridItemSubMenu();
        this.dispatchEvent(emit);
    }
    //当前活动的GridItem
    get curActiveGridItem() {
        return this.curMovingGridItemData || this.curResizingGridItemData || null;
    }
    //当前活动的GridItem style
    get curActiveGridItemStyle() {
        var _a;
        return (_a = this.curActiveGridItem) === null || _a === void 0 ? void 0 : _a.style;
    }
    get curSelectGridItem() {
        return this.layoutData.find(item => item.selected);
    }
    //选中的UserStyle;
    // get curSelectGridItemUserStyle(): CSSType | undefined {
    //   if(!this.curSelectGridItem) return;
    //   if(!this.curSelectGridItem.userStyle) {
    //     this.curSelectGridItem.userStyle = {
    //       borderStyle: "",
    //       borderWidth: "",
    //       borderColor: "",
    //       borderRadius: "",
    //       backgroundColor: ""
    //     }
    //   }
    //   return this.curSelectGridItem.userStyle;
    // }
    //选中的UserStyle;
    get curGridItemSubMenuGridDataUserStyle() {
        if (!this.curGridItemSubMenuGridData)
            return;
        if (!this.curGridItemSubMenuGridData.userStyle) {
            this.curGridItemSubMenuGridData.userStyle = {
                borderStyle: "",
                borderWidth: "",
                borderColor: "",
                borderRadius: "",
                backgroundColor: ""
            };
        }
        return this.curGridItemSubMenuGridData.userStyle;
    }
    get stageHeight() {
        let list = [...this.layoutData];
        if (this.dragData) {
            list = [this.dragData, ...list];
        }
        let h = 0;
        list.forEach(item => {
            h = h < item.y + item.h ? item.y + item.h : h;
        });
        h = h + this.gridMargin;
        return h * this.griddingWidth;
    }
    dialogClose() {
        this.showDialogGridStyle = false;
        this.closeGridItemSubMenu();
        this.reRender();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        var _a, _b, _c;
        this.stageWidth = this.getBoundingClientRect().width;
        return html `<div class="grid-layout" @click="${this.onGridLayoutClick}">
    <div class="grid-sitting" style="height:${this.stageHeight}px"></div>
    ${this.edit ? html `
      <div class="toolbar" hide="${this.hideToolbar}">
        <i class="el-icon add" @click="${this.addGridItem}" >
          <!--[-->
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path>
          </svg>
          <!--]-->
        </i>
        <i class="el-icon back" @click="${this.backLayout}">
          <!--[-->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
            <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
          </svg>
          <!--]-->
        </i>
        <i class="el-icon forward" @click="${this.forwardLayout}">
          <!--[-->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
            <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
          </svg>
          <!--]-->
        </i>
        <i class="el-icon save" @click="${this.save}">
          <!--[-->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <!--]-->
        </i>
        <i class="el-icon close" @click="${this.close}">
          <!--[-->
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
          <!--]-->
        </i>
        
      </div>
      
      <div style="top:calc(40% + ${(_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.host.scrollTop}px);display:${this.curSelectGridItem ? 'flex' : 'none'}"  class="toolbar vertical">
      <i class="el-icon z-index-up" @click="${this.setZindexUp}" style="display:${((_b = this.curSelectGridItem) === null || _b === void 0 ? void 0 : _b.float) ? 'flex' : 'none'}">
        <!--[-->
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0 33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176 28.913 28.913 0 0 1-42.647 0l-219.618-233.23z"></path></svg>
        <!--]-->
      </i>
      <i class="el-icon z-index-down" @click="${this.setZindexDown}" style="display:${((_c = this.curSelectGridItem) === null || _c === void 0 ? void 0 : _c.float) ? 'flex' : 'none'}">
        <!--[-->
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M544 805.888V168a32 32 0 1 0-64 0v637.888L246.656 557.952a30.72 30.72 0 0 0-45.312 0 35.52 35.52 0 0 0 0 48.064l288 306.048a30.72 30.72 0 0 0 45.312 0l288-306.048a35.52 35.52 0 0 0 0-48 30.72 30.72 0 0 0-45.312 0L544 805.824z"></path></svg>
        <!--]-->
      </i>
      <!-- <div class="style-box">
        {this.renderStyleSet()}
        
        <i class="el-icon style-update-btn"  @click="${this.openSetStyle}" active="${this.styleMapEditing}">
          --[--
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-border-style" viewBox="0 0 16 16">
              <path d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4-4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1z" />
            </svg>
          --]--
        </i>
         <i class="el-icon" @click="{this.openConfigSet}">
            --[--
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"></path></svg>
            --]--
        </i> 
      </div> -->
    </div>
    ${this.showGridItemMenu()}
    ` : ''}
    
    ${this.layoutData.map((item, i) => {
            return html `
      <div class="grid-item"  data-index="${i}" .griddingWidth="${this.griddingWidth}"
        selected="${item.selected || false}"
        float="${item.float || false}"
        edit="${this.edit}"
        @mousedown="${this.gridItemDragstart}"
        style="${this.getGridItemStyle(item)}"
        transition="${this.transition}"
        >
        <slot name="${item.slot || ''}"></slot>
        ${this.renderToobar()}
      </div>
      `;
        })}
    ${this.draggIng ? this.drawDragDataHtml() : ''}
  </div>
  ${this.showDialog()}
    `;
    }
    // renderStyleSet() {
    //   return this.styleMapEditing ? html`
    //   <div class="style-set">
    //     <div class="head">Style</div>
    //     <div class="item">
    //       <span class="lab">border-width:</span>
    //       <div class="ctr">
    //         <input class="ctr-input" type="number" min="0" max="10"
    //           value="${this.curSelectGridItemUserStyle?.borderWidth||0}"
    //           @change="${(e:any)=>{this.changeInput('borderWidth',e)}}" />
    //       </div>
    //     </div>
    //     <div class="item">
    //       <span class="lab">border-style:</span>
    //       <div class="ctr">
    //         <select class="ctr-input" 
    //           value="${this.curSelectGridItemUserStyle?.borderStyle||''}"
    //           @change="${(e:any)=>{this.changeInput('borderStyle',e)}}">
    //           <option value=""></option>
    //           <option value="solid">solid</option>
    //           <option value="dotted">dotted</option>
    //           <option value="double">double</option>
    //           <option value="dashed">dashed</option>
    //           <option value="hidden">hidden</option>
    //           <option value="inset">inset</option>
    //           <option value="outset">outset</option>
    //           <option value="ridge">ridge</option>    
    //           <option value="none">none</option>
    //         </select>
    //       </div>
    //     </div>
    //     <div class="item">
    //       <span class="lab">border-color:</span>
    //       <div class="ctr">
    //         <input class="ctr-input"  type="color"
    //         value="${this.curSelectGridItemUserStyle?.borderColor||''}" 
    //         @change="${(e:any)=>{this.changeInput('borderColor',e)}}" />
    //       </div>
    //     </div>
    //     <div class="item">
    //       <span class="lab">border-radius:</span>
    //       <div class="ctr">
    //         <input class="ctr-input"  type="number" min="0" max="10"
    //         value="${this.curSelectGridItemUserStyle?.borderRadius||''}" 
    //         @change="${(e:any)=>{this.changeInput('borderRadius',e)}}" />
    //       </div>
    //     </div>
    //     <div class="item">
    //       <span class="lab">background-color:</span>
    //       <div class="ctr">
    //         <input class="ctr-input" type="color" 
    //           value="${this.curSelectGridItemUserStyle?.backgroundColor||''}" 
    //           @change="${(e:any)=>{this.changeInput('backgroundColor',e)}}" />
    //       </div>
    //     </div>
    //   </div>`:``;
    // }
    renderToobar() {
        if (!this.edit)
            return '';
        return html `<div class="tool-box">
    <i class="el-icon btn-more" style="font-size: 20px;">
      <!--[-->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96"></path>
      </svg>
      <!--]-->
        
    </i>

    <!-- <i class="el-icon set-float" >
      --[--
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-subtract" viewBox="0 0 16 16">
        <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
      </svg>
      --]--
    </i>
    <i class="el-icon close grid-item-close" style="font-size:20px;" >
      --[--
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
      --]--
    </i> -->
  </div>
  <div class="resize bottom-right" @mousedown="${this.gridItemResizeStart}" ></div>`;
    }
    showGridItemMenu() {
        return html `
    <div class="box-menu ${this.curGridItemSubMenuShow ? 'show' : ''}" style="left:${this.curGridItemSubMenuPos.x}px;top:${this.curGridItemSubMenuPos.y}px">
        <div  class="menu-item" @click="${this.openSetStyleBySubMenu}">
          <i class="el-icon">
            <!--[-->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-border-style" viewBox="0 0 16 16">
              <path d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm8 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-4-4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1z"></path>
            </svg>
            <!--]-->
          </i>
          <span class="el-label">Grid Style</span>
        </div>
        <div  class="menu-item" @click="${this.openConfigSetBySubMenu}">
          <i class="el-icon">
            <!--[-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728="">
              <path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"></path>
            </svg>
            <!--]-->
          </i>
          <span class="el-label">Config Set</span>
        </div>
        <div  class="menu-item" @click="${this.gridItemFloatBySubMenu}">
          <i class="el-icon">
            <!--[-->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-subtract" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
            </svg>
            <!--]-->
          </i>
          <span class="el-label">Float Up</span>
        </div>
        <div  class="menu-item" @click="${this.gridItemCloseBySubMenu}">
          <i class="el-icon close grid-item-close" style="font-size:20px;" >
            <!--[-->
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
            <!--]-->
          </i>
          <span class="el-label">Remove</span>
        </div>
      </div>
    `;
    }
    showDialog() {
        var _a, _b, _c, _d, _e;
        if (!this.showDialogGridStyle)
            return '';
        return html `<div class="dialog" open>
    <div class="style-dialog">
        <div class="head">Style</div>
        <div class="item">
          <span class="lab">border-width:</span>
          <div class="ctr">
            <input class="ctr-input" type="number" min="0" max="10"
              value="${((_a = this.curGridItemSubMenuGridDataUserStyle) === null || _a === void 0 ? void 0 : _a.borderWidth) || 0}"
              @change="${(e) => { this.dialogChangeInput('borderWidth', e); }}" />
          </div>
        </div>
        <div class="item">
          <span class="lab">border-style:</span>
          <div class="ctr">
          
            <select class="ctr-input" 
              value="${((_b = this.curGridItemSubMenuGridDataUserStyle) === null || _b === void 0 ? void 0 : _b.borderStyle) || ''}"
              @change="${(e) => { this.dialogChangeInput('borderStyle', e); }}">
              <option value=""></option>
              <option value="solid">solid</option>
              <option value="dotted">dotted</option>
              <option value="double">double</option>
              <option value="dashed">dashed</option>
              <option value="hidden">hidden</option>
              <option value="inset">inset</option>
              <option value="outset">outset</option>
              <option value="ridge">ridge</option>    
              <option value="none">none</option>
            </select>
          </div>
        </div>
        <div class="item">
          <span class="lab">border-color:</span>
          <div class="ctr">
            <input class="ctr-input"  type="color"
            value="${((_c = this.curGridItemSubMenuGridDataUserStyle) === null || _c === void 0 ? void 0 : _c.borderColor) || ''}" 
            @change="${(e) => { this.dialogChangeInput('borderColor', e); }}" />
          </div>
        </div>
        <div class="item">
          <span class="lab">border-radius:</span>
          <div class="ctr">
            <input class="ctr-input"  type="number" min="0" max="10"
            value="${((_d = this.curGridItemSubMenuGridDataUserStyle) === null || _d === void 0 ? void 0 : _d.borderRadius) || ''}" 
            @change="${(e) => { this.dialogChangeInput('borderRadius', e); }}" />
          </div>
        </div>
        <div class="item">
          <span class="lab">background-color:</span>
          <div class="ctr">
            <input class="ctr-input" type="color" 
              value="${((_e = this.curGridItemSubMenuGridDataUserStyle) === null || _e === void 0 ? void 0 : _e.backgroundColor) || ''}" 
              @change="${(e) => { this.dialogChangeInput('backgroundColor', e); }}" />
          </div>
        </div>
        <i class="el-icon close" @click="${this.dialogClose}">
          <!--[-->
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
          <!--]-->
        </i>
      </div>
      
    </div>`;
    }
}
GridLayoutWc.styles = css `
  :host {
    display: block;
    padding: 0px;
    height:100%;
    overflow-x: hidden;
  }
  :host::-webkit-scrollbar{
    width: 8px;
    background: #b3b3b3;
   
  }
  :host::-webkit-scrollbar-thumb{
    width: 8px;
    background: #767676;
    border-radius: 5px;
  }
  :host::-webkit-scrollbar-track{
    background: transparent;
    border-radius: 0px;
  }
  .grid-layout {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .toolbar {
    position: absolute;
    right:5px;
    top:5px;
    padding:2px 3px;
    z-index: 999999;
    display:flex;
    background: #000;
    box-shadow: 2px 2px 5px #000;
    border-radius:3px;
    border:1px solid rgb(103 103 103);
  }
  .toolbar[hide="true"]{
    display:none;
  }
  .toolbar.vertical {
    top:20%;
    right:5px;
    flex-flow: column;
  }
  .toolbar .el-icon svg {
    width:18px;
    height: 18px;
  }
  .toolbar .el-icon {
    cursor: pointer;
    margin:3px 3px;
    border:1px solid #dbdbdb;
    border-radius: 3px;
    padding: 3px;
    display: inline-flex;
    width: 18px;height: 18px;
    background-color: #fff;
    color:#333;
  }
  .toolbar .el-icon:hover {
    background-color: #4097e4;
    color:#fff;
    opacity:0.7;
  }

  .toolbar .el-icon[active="true"] {
    background-color: #4097e4;
    color:#fff;
  }
  .toolbar .el-icon:active{
    background-color: rgb(131 177 217);
    color:#fff;
  }
  .toolbar .el-icon.forward svg {
    transform: scaleX(-1);
  }
  .old-data {
    opacity: 0.3;
  }
  .grid-sitting {
    width:100%;
    top:0px;
    position: absolute;
    z-index:-1
  }  
  .grid-item {
    display:block;
    position:absolute;
    min-width: 20px;
    min-height: 10px;
    border-radius: 3px;
    overflow:hidden;
    background-color:#fff;
    border:1px solid #c3c3c3;
    box-sizing: border-box;
  }
  .grid-item[transition="true"] {
    transition: all 0.3s;
  }
  .grid-item.move {
    cursor:move;
  }
  .grid-item[edit="true"][selected="true"] {
    outline:2px solid #a2c1d6;
  }
  .grid-item[float="true"] {
    box-shadow:rgb(0, 0, 0) 5px 5px 14px -10px;
  }
  .grid-item[float="true"] .tool-box .set-float {
    opacity: 1;
    color:#3250a7;
  }
  .grid-item:hover .resize {
    display: flex;
  }
  .grid-item .bottom-right {
   cursor: se-resize;
   right: 4px;
   bottom: 4px;
   width: 10px;
   height: 10px;
   border-right: 3px solid #c3bebe;
   border-bottom: 3px solid #c3bebe;
  }
  .grid-item .tool-box {
   position: absolute;
   top:5px;
   right:10px;
   display: flex;
  }
 .grid-item  .tool-box .el-icon {
   width:15px;
   height:15px;
   color:#929292;
   padding:3px;
   border-radius: 3px;
   display: flex;
 }
 .grid-item .tool-box .el-icon:hover {
   cursor:pointer;
   opacity: 0.6;
  }
  .grid-item .resize > svg {
    color: rgb(160 160 160)
  }
  .grid-item .resize:hover {
    opacity: 0.6;
  }

  .grid-item[drag=true] {
   opacity: 0.5;
   background-color: rgb(249, 227, 193);
   box-shadow: none;
   border: none;
   transition: none;
 }
 .grid-item[drag=true] .close,
 .grid-item[drag=true] .set-float {
   display: none;
 }
 .resize {
   position: absolute;
 }
 /* .style-box {
  position:relative;
  display:flex;
  flex-flow:column;
 } 
 .style-set {
  border:1px solid #9a9a9a;
  padding:10px;
  position:absolute;
  min-width:100px;
  min-height:100px;
  background: #181b1f;
  z-index:0;
  top:0px;
  right:40px;
  border-radius:3px;
  box-shadow:0px 0px 10px #000;
  color:#fff;
 }
 .style-set .item {
  margin:10px 0px;
 }
 .style-set .item > span {
  display: block;
  min-width: 125px;
  margin-right: 13px;
  color: #e2e2e2;
  font-size: 14px;
 }
 .style-set .ctr-input {
  height: 28px;
  width: 100%;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 0px;
  background-color:#000;
  box-sizing: border-box;
  color:#fff;
  border:1px solid #424242;
 }
 .style-set .ctr-input option {
  height:28px;
  margin:5px;
 } */
 .toolbar .el-icon.style-update-btn:hover {
  background-color:#fff;
  color:#333;
 }
 .toolbar .el-icon.style-update-btn[active="true"] {
    background-color: #4097e4;
    color:#fff;
 }
 .btn-more {
  position: relative;
 }
 .box-menu {
  display:none;
  min-width: 105px;
  min-height: 32px;
  position: absolute;
  z-index:200001;
  background-color:#fff;
  box-shadow:0px 0px 8px -6px #000;
  border:1px solid #e0e0e0;
  font-style:normal;
  font-size:12px;
  color:#333;
  transform: translateX(-100%);
 }
 .box-menu.show{
  display:block;
 }
 .box-menu .menu-item {
  display:flex;
  padding:5px 10px;
  align-items:center;
  cursor:pointer;
 }
 .box-menu .menu-item .el-icon {
  width:14px;
  height:14px;
  align-items:center;
  display:flex;
  color:#585656;
 }
 .box-menu .menu-item:hover {
  background-color:#f1f1f1;
  color:#7990be;
 }
 .box-menu .menu-item:hover .el-icon {
  color:#7990be;
 }
 .box-menu .menu-item span {
  margin-left:10px;
 }
 .dialog {
  position:absolute;
  z-index:999999;
  left:0;
  top:0;
  right:0;
  bottom:0;
  background:rgba(0,0,0,0.3);
 }
 
 .style-dialog {
    font-size:12px;
    position:absolute;
    width: 260px;
    top: 50%;
    
    left:50%;
    transform: translate(-50%,-50%);
    border: 1px solid #e6e6e6;
    box-shadow: 0px 0px 15px -6px;
    background: white;
    padding:42px 20px 20px;
    border-radius: 5px;
 }
 .dialog .close {
    width:18px;
    height:18px;
    position:absolute;
    top:10px;
    right:10px;
    cursor:pointer;
 }
 .dialog .close:hover {
    opacity:0.7;
 }
 .style-dialog .head {
    position:absolute;
    top:0;
    left:0;
    right:0;
    padding:8px;
    border-bottom:1px solid #dddddd;
 }
`;
__decorate([
    state()
], GridLayoutWc.prototype, "RenderIndex", void 0);
__decorate([
    property({ type: Number })
], GridLayoutWc.prototype, "griddingWidth", void 0);
__decorate([
    property({ type: Number })
], GridLayoutWc.prototype, "gridMargin", void 0);
__decorate([
    property({ type: Boolean })
], GridLayoutWc.prototype, "edit", void 0);
__decorate([
    property({ type: Array })
], GridLayoutWc.prototype, "layoutData", void 0);
__decorate([
    property({ type: Boolean })
], GridLayoutWc.prototype, "hideToolbar", void 0);
//# sourceMappingURL=GridLayoutWc.js.map