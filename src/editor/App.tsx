import {ICellEditorParams, ICellEditor} from 'ag-grid-community';
import {Component, createResource, onMount} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from 'ag-grid-solid';

import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"

export const MySolidEditor = (props: ICellEditorParams) => {
    let value = props.value;
    let refInput: any;

    const api: ICellEditor = {
        getValue: () => value
    };

    (props as any).ref(api);

    const onValueChanged = (event: any) => {
        value = event.target.value;
    };

     createEffect(() => {
         refInput.focus();
     })


    return (
        <input type="number" class={styles["my-editor"]}
               ref={refInput}
               value={value}
               onChange={onValueChanged}
        />    );
}

const fetchData = async () =>
    (await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)).json();

const App: Component = () => {

    const [rowData] = createResource<any[]>(fetchData);

    const columnDefs = [
        {
            field: 'country'
        },
        {
            field: 'athlete',
        },
        {
            field: 'gold',
            editable: true,
            cellEditor: MySolidEditor
        },
        {
            field: 'silver',
            cellEditor: MySolidEditor,
            cellEditorPopup: true
        }
    ];

    const defaultColDef = {
        resizable: true,
        filter: true,
        editable: true,
        sortable: true,
        flex: 1
    };

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    enableRangeSelection={true}
                    columnDefs={columnDefs}
                    rowData={rowData()}
                    defaultColDef={defaultColDef}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
