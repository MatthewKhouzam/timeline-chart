import { TimelineChart } from "./time-graph-model";

export class TimeGraphRowController {
    private _selectedRow: TimelineChart.TimeGraphRowModel | undefined = undefined;
    private _selectedRowIndex: number = -1;
    private _verticalOffset: number;
    private _pinnedRows: Set<number> = new Set();
    protected selectedRowChangedHandlers: ((row: TimelineChart.TimeGraphRowModel) => void)[] = [];
    protected verticalOffsetChangedHandlers: ((verticalOffset: number) => void)[] = [];
    protected totalHeightChangedHandlers: ((totalHeight: number) => void)[] = [];
    protected pinnedRowsChangedHandlers: ((pinnedRows: Set<number>) => void)[] = [];

    constructor(public rowHeight: number, private _totalHeight: number) {
        this._verticalOffset = 0;
    }

    protected handleVerticalOffsetChanged() {
        this.verticalOffsetChangedHandlers.forEach(h => h(this._verticalOffset));
    }

    protected handleSelectedRowChanged() {
        const selectedRow = this._selectedRow;
        if (selectedRow) {
            this.selectedRowChangedHandlers.forEach(h => h(selectedRow));
        }
    }

    protected handleTotalHeightChanged(){
        this.totalHeightChangedHandlers.forEach(h=>h(this._totalHeight));
    }

    protected handlePinnedRowsChanged() {
        this.pinnedRowsChangedHandlers.forEach(h => h(this._pinnedRows));
    }

    onSelectedRowChangedHandler(handler: (row: TimelineChart.TimeGraphRowModel) => void) {
        this.selectedRowChangedHandlers.push(handler);
    }

    removeSelectedRowChangedHandler(handler: (row: TimelineChart.TimeGraphRowModel) => void) {
        const index = this.selectedRowChangedHandlers.indexOf(handler);
        if (index > -1) {
            this.selectedRowChangedHandlers.splice(index, 1);
        }
    }

    onVerticalOffsetChangedHandler(handler: (verticalOffset: number) => void) {
        this.verticalOffsetChangedHandlers.push(handler);
    }

    removeVerticalOffsetChangedHandler(handler: (verticalOffset: number) => void) {
        const index = this.verticalOffsetChangedHandlers.indexOf(handler);
        if (index > -1) {
            this.verticalOffsetChangedHandlers.splice(index, 1);
        }
    }

    onTotalHeightChangedHandler(handler: (totalHeight: number) =>  void) {
        this.totalHeightChangedHandlers.push(handler);
    }

    removeTotalHeightChangedHandler(handler: (totalHeight: number) =>  void) {
        const index = this.totalHeightChangedHandlers.indexOf(handler);
        if (index > -1) {
            this.totalHeightChangedHandlers.splice(index, 1);
        }
    }

    onPinnedRowsChangedHandler(handler: (pinnedRows: Set<number>) => void) {
        this.pinnedRowsChangedHandlers.push(handler);
    }

    removePinnedRowsChangedHandler(handler: (pinnedRows: Set<number>) => void) {
        const index = this.pinnedRowsChangedHandlers.indexOf(handler);
        if (index > -1) {
            this.pinnedRowsChangedHandlers.splice(index, 1);
        }
    }

    get totalHeight(): number {
        return this._totalHeight;
    }

    set totalHeight(height: number) {
        this._totalHeight = height;
        this.handleTotalHeightChanged();
    }

    get verticalOffset(): number {
        return this._verticalOffset;
    }

    set verticalOffset(value: number) {
        this._verticalOffset = value;
        this.handleVerticalOffsetChanged();
    }

    get selectedRow(): TimelineChart.TimeGraphRowModel | undefined {
        return this._selectedRow;
    }

    set selectedRow(value: TimelineChart.TimeGraphRowModel | undefined) {
        this._selectedRow = value;
        this.handleSelectedRowChanged();
    }

    get selectedRowIndex(): number {
        return this._selectedRowIndex;
    }

    set selectedRowIndex(index: number) {
        this._selectedRowIndex = index;
        this.handleSelectedRowChanged();
    }

    get pinnedRows(): Set<number> {
        return this._pinnedRows;
    }

    toggleRowPin(rowId: number) {
        if (this._pinnedRows.has(rowId)) {
            this._pinnedRows.delete(rowId);
        } else {
            this._pinnedRows.add(rowId);
        }
        this.handlePinnedRowsChanged();
    }

    isPinned(rowId: number): boolean {
        return this._pinnedRows.has(rowId);
    }
}