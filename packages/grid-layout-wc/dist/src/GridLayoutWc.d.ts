import { LitElement } from 'lit';
interface ItemData {
    x: number;
    y: number;
    w: number;
    h: number;
}
interface GridItemStyleTyoe {
    left: number;
    top: number;
    width: number;
    height: number;
}
type CSSType = {
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    backgroundColor?: string;
    borderRadius?: string;
};
interface GridItemData extends ItemData {
    id: number;
    z: number;
    selected?: boolean;
    dataSource?: any;
    time?: number;
    title?: string;
    float?: boolean;
    slot?: string;
    style?: GridItemStyleTyoe;
    userStyle?: CSSType;
}
type HtmlPosition = {
    left: number;
    top: number;
};
type GridPosition = {
    x: number;
    y: number;
};
export declare class GridLayoutWc extends LitElement {
    RenderIndex: number;
    static stylemap: CSSType;
    griddingWidth: number;
    gridMargin: number;
    edit: boolean;
    layoutData: GridItemData[];
    hideToolbar: boolean;
    oldLayoutData: string;
    styleMapEditing: boolean;
    dragData: {
        x: number;
        y: number;
        w: number;
        h: number;
        z: number;
        id: number;
    };
    draggIng: boolean;
    stageWidth: number;
    /** resize相关 */
    resizeFixPosition: any;
    resizeingPosition: any;
    resizeFixGridItemData: GridItemData | null;
    curResizingGridItemData: any | null;
    dataStore: any[];
    dataStoreIndex: number;
    curMovingGridItemData: any | null;
    movePosition: HtmlPosition;
    fixPosition: HtmlPosition;
    oldPosition: HtmlPosition;
    transition: boolean;
    reRender(): void;
    drawDragDataHtml(): import("lit-html").TemplateResult<1>;
    constructor();
    findGridItemData: (id: any) => GridItemData | undefined;
    addGridItem(): void;
    /**
     * 获取空间的位置
     * @param w
     * @param h
     * @returns { x, y }
     */
    getEmptyBound(w: number, h: number): {
        x: number;
        y: number;
    };
    /**
     * 查找存在的最大的重叠交叉项
     * */
    findBigestOverlapItem: (dataList: GridItemData[], x: number, y: number, w: number, h: number, exceptIds?: any[]) => GridItemData | undefined;
    /**
     * 获取交叉的GridItem 列表
     * @param x x
     * @param y y
     * @param w w
     * @param h h
     * @param exceptIds 排序的id
     * @returns 交叉的GridItem 列表
     */
    findOverlapItem: (dataList: GridItemData[], x: number, y: number, w: number, h: number, exceptIds?: any[], overCount?: number) => GridItemData[];
    /**
     * Resize start
     * @param event MouseEvent
     */
    gridItemResizeStart(event: MouseEvent): void;
    /**
     * resizeing
     * @param event
     */
    gridItemResizeing(event: any): void;
    /**
     * Resize end
     */
    gridItemResizeEnd(): void;
    /**
     * ItemStyle事件
     * @param data GridItemData
     * @returns
     */
    getGridItemStyle(data: GridItemData): string;
    /** 保存Layout */
    saveCurLayout(): void;
    animateGridItem(item: GridItemData, w?: number, h?: number): Promise<unknown>;
    /** 移除GridItem */
    gridItemClose(event: PointerEvent): Promise<void>;
    getGridItemIndex(target: any): number;
    getGridItem(target: any): GridItemData;
    /**
     * 拖拽开始
     * @param event PointerEvent
     * @returns void
     */
    gridItemDragstart(event: PointerEvent): void;
    /**
     * 转换成的GidPosition
     * @param left style.left
     * @param top style.top
     * @returns {x,y}
     */
    calcNearPosition: (left: number, top: number) => GridPosition;
    /**
     * 获取最近的空间
     * @param grid :GridItemData
     * @returns {x,y}
     */
    getNearEmptyPosition(grid: GridItemData): {
        x: number;
        y: number;
    };
    /**
     * 返回 上次的layout
     * @returns JSON
     */
    getBackLayout: () => any;
    /**
     * 打开上次的保存layout
     */
    backLayout: () => void;
    /** 下一个layout */
    getForwardLayout: () => any;
    /** 打开下一步的layout */
    forwardLayout: () => void;
    close: () => void;
    save: () => void;
    gridItemFloat: (event: PointerEvent) => void;
    onGridLayoutClick(event: any): void;
    getGridItemTopY(dataList: GridItemData[], grid: ItemData, exceptIds: any[]): {
        x: number;
        y: number;
    };
    calcOverArea(data1: ItemData, data2: ItemData): number;
    changeInput(attr: "borderStyle" | "borderColor" | "borderWidth" | "backgroundColor" | "borderRadius", e: any): void;
    sortTopSpace(list: GridItemData[]): void;
    sortBottomOver(list: GridItemData[]): void;
    pressDownOver(list: GridItemData[], item: GridItemData): void;
    rearrangement(): void;
    setZindexUp(): void;
    setZindexDown(): void;
    openSetStyle(): void;
    openConfigSet(): void;
    get curActiveGridItem(): any;
    get curActiveGridItemStyle(): any;
    get curSelectGridItem(): GridItemData | undefined;
    get curSelectGridItemUserStyle(): CSSType | undefined;
    get stageHeight(): number;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    renderStyleSet(): import("lit-html").TemplateResult<1> | "";
    renderToobar(): import("lit-html").TemplateResult<1> | "";
    static styles: import("lit").CSSResult;
}
export {};
