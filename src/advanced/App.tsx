import {Component, onMount} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from 'ag-grid-solid';

import 'ag-grid-community/dist/styles/ag-grid.css';
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./styles.css";
import spinnerGif from './images/spinner.gif';

const MyRenderer = (props: any) => {
    return <span class="my-renderer">
        <img src={spinnerGif} class="my-spinner"/>
        <span class="my-renderer-value">{props.value}</span>
    </span>;
}


const App: Component = () => {

    const [getRowData, setRowData] = createSignal<any[]>([]);

    let gridRef: AgGridSolidRef;

    onMount(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => setRowData(data));
    });

    // show chart of first rendering
    const onFirstDataRendered = ()=> {
        console.log(gridRef.columnApi.getAllDisplayedColumnGroups());
        gridRef.api.createRangeChart({
            chartType: 'groupedColumn',
            cellRange: {
                rowStartIndex: 0,
                rowEndIndex: 4,
                columns: ['ag-Grid-AutoColumn', 'gold', 'silver'],
            }
        });
    };

    const columnDefs = [
        {field: 'country', enableRowGroup: true, rowGroup: true, hide: true, cellRenderer: MyRenderer},
        {field: 'sport', enableRowGroup: true, hide: true, rowGroup: true},
        {field: 'athlete', enableRowGroup: true, hide: true},
        {field: 'gold', aggFunc: 'sum'},
        {field: 'silver', aggFunc: 'sum'},
        {field: 'bronze', aggFunc: 'sum'},
        {field: 'total', aggFunc: 'sum'}
    ];

    const defaultColDef = {
        resizable: true,
        sortable: true
    };
    const autoGroupColumnDef = {
        cellRendererParams: {
            suppressCount: true,
            checkbox: true
        },
        field: 'athlete',
        width: 300
    }

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    animateRows={true}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    rowGroupPanelShow="always"
                    enableRangeSelection={true}
                    enableCharts={true}
                    rowData={getRowData()}
                    rowSelection="multiple"
                    onFirstDataRendered={onFirstDataRendered}
                    groupSelectsChildren={true}
                    suppressRowClickSelection={true}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
