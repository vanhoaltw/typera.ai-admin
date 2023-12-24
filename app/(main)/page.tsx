/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { Toast } from 'primereact/toast';
import CreateProject from '../../components/projects/CreateProject';

const Dashboard = () => {
    const toast = useRef<Toast>(null);
    const [data, setData] = useState<any[]>([]);
    const dt = useRef<DataTable<any>>(null);
    const [selectedRows, setSelectedRows] = useState<any>(null);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        ProductService.getProducts().then((response) => setData(response as any));
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable
                        ref={dt}
                        value={data}
                        lazy
                        selection={selectedRows}
                        onSelectionChange={(e) => setSelectedRows(e.value as any)}
                        dataKey="id"
                        totalRecords={data?.length as number}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        header={
                            <div className="flex justify-content-end">
                                <Button onClick={() => setSelectedRows({})} icon="pi pi-plus" label="Create" />
                            </div>
                        }
                        emptyMessage="No products found."
                    >
                        <Column headerStyle={{ width: '4rem' }}></Column>
                        <Column header="#" sortable body={(_, options) => options.rowIndex + 1} headerStyle={{ minWidth: '6rem' }} />
                        <Column field="id" header="ID" headerStyle={{ minWidth: '6rem' }} />
                        <Column field="date" header="Date" headerStyle={{ minWidth: '8rem' }} />
                        <Column field="name" header="Name" headerStyle={{ minWidth: '15rem' }} />
                        <Column header="Views" body={(rowData) => <div>{rowData?.id}</div>} headerStyle={{ minWidth: '6rem' }} />
                        <Column header="Download" body={() => <Button outlined icon="pi pi-download" size="small" />} headerStyle={{ minWidth: '6rem' }} />
                    </DataTable>

                    <CreateProject visible={!!selectedRows} onDismiss={() => setSelectedRows(null)} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
