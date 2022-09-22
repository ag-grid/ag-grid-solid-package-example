import {ModuleRegistry} from 'ag-grid-community';
import type {Component} from 'solid-js';
import {createEffect, createSignal, onCleanup} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from 'ag-grid-solid';

import 'ag-grid-community/dist/styles/ag-grid.css';
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./styles.css";

const SortingHeader = (props:any) => {

    const [sortState, setSortState] = createSignal();

    const onClick = () => {
        props.progressSort();
    };

    createEffect(() => {
        const listener = () => {
            if (props.column.isSortAscending()) {
                setSortState('ASC');
            } else if (props.column.isSortDescending()) {
                setSortState('DESC');
            } else {
                setSortState(undefined);
            }
        };

        props.column.addEventListener('sortChanged', listener);

        onCleanup(() => props.column.removeEventListener('sortChanged', listener));
    });

    return (
        <span class="my-header" onClick={onClick}>
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" class="my-spinner" />
            {props.displayName} {sortState}
        </span>
    );
};

const MyGroupHeader = (props:any) => {

    const [getExpanded, setExpanded] = createSignal(false);
    const { columnGroup } = props;
    const expandable = columnGroup.isExpandable();
    const providedColumnGroup = columnGroup.getProvidedColumnGroup();

    const onExpandClicked = () => props.setExpanded(!columnGroup.isExpanded());

    createEffect(() => {
        const listener = () => {
            setExpanded(columnGroup.isExpanded());
        };
        listener();
        providedColumnGroup.addEventListener('expandedChanged', listener);
        onCleanup(() => providedColumnGroup.removeEventListener('expandedChanged', listener))
    });

    const showExpandJsx = () => (
        <button onClick={onExpandClicked} class="my-expand">
             {getExpanded() ? '<' : '>'}
         </button>
     );

     return (
         <span class="my-group-header">
             <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" class="my-spinner" />
             {props.displayName}
             {expandable && showExpandJsx()}
         </span>
     );
 };


const App: Component = () => {

    const [getRowData, setRowData] = createSignal<any[]>([]);

    createEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => setRowData(data));
    })

    const columnDefs = [
        {
            headerName: 'Group A',
            headerGroupComponent: MyGroupHeader,
            children: [
                { field: 'athlete', headerComponent: SortingHeader },
                { field: 'age', headerComponent: SortingHeader },
            ]
        },
        {
            headerName: 'Group B',
            headerGroupComponent: MyGroupHeader,
            children: [
                { field: 'country' },
                { field: 'year' },
                { field: 'date', columnGroupShow: 'open' },
                { field: 'sport', columnGroupShow: 'open' }
            ]
        },
    ];

    const defaultColDef = {
        resizable: true,
        filter: true
    };

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    enableRangeSelection={true}
                    columnDefs={columnDefs}
                    rowData={getRowData()}
                    defaultColDef={defaultColDef}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
