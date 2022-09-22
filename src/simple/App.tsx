import {ModuleRegistry} from 'ag-grid-community';
import {Component, onMount} from 'solid-js';
import {createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from 'ag-grid-solid';

import 'ag-grid-community/dist/styles/ag-grid.css';
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./styles.css";
import spinnerGif from './images/spinner.gif';

const MyRenderer = (props: any) => {
    return <span class="my-renderer">
        <img src={spinnerGif} class="my-spinner"/>
        {props.value}
    </span>;
}

const App: Component = () => {

    const [getRowData, setRowData] = createSignal<any[]>([]);

    onMount(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => setRowData(data));
    })

    const columnDefs = [
        {field: 'athlete'}, {field: 'age', cellRenderer: MyRenderer},
        {field: 'country'}, {field: 'year'}, {field: 'date'}, {field: 'sport'},
        {field: 'gold'}, {field: 'silver'}, {field: 'bronze'}, {field: 'total'}
    ];

    const defaultColDef = {
        resizable: true,
        filter: true
    };

    let gridRef: AgGridSolidRef;

    return (
        <div class="ag-theme-alpine" style={{height: '500px'}}>
            <AgGridSolid
                columnDefs={columnDefs}
                rowData={getRowData()}
                defaultColDef={defaultColDef}
                ref={gridRef!}
            />
        </div>
    );
};

export default App;
