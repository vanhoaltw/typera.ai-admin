/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import CreateProject from '../../components/projects/CreateProject';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REASEARCH_LISH } from '../../graphql/query';
import { ProgressSpinner } from 'primereact/progressspinner';
import dayjs from 'dayjs';
import { confirmPopup } from 'primereact/confirmpopup';
import { InputText } from 'primereact/inputtext';
import { useFilter } from '../../hooks/useFilter';
import { OPERATOR } from '../../configs/constant';
import { Menu } from 'primereact/menu';
import { DELETE_RESEARCH } from '../../graphql/mutation';

const defaultPageSize = 10;

const Dashboard = () => {
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [selectedRows, setSelectedRows] = useState<any>(null);
    const { query, onSearch } = useFilter(['search', 'page', 'pageSize']);
    const menuRef = useRef<Menu>(null);
    const [doDelete, { loading: deleteloading }] = useMutation(DELETE_RESEARCH);

    const filters = useMemo(() => [{ field: 'name', operator: OPERATOR.contains, value: query?.search }].filter((i) => !!i.value), [query?.search]);
    const pageSize = Number(query?.pageSize || defaultPageSize);
    const page = Number(query?.page || 0);

    const { data, loading } = useQuery(GET_REASEARCH_LISH, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: filters,
            page,
            pageSize
        }
    });

    const items = data?.getResearchList?.results || [];
    const total = data?.getResearchList?.total || 0;

    const onConfirmDelete = (event: any, id: string) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to delete?',
            icon: 'pi pi-exclamation-triangle text-red-500',
            accept: () => {
                return doDelete({
                    variables: { deleteResearchId: id },
                    refetchQueries: [GET_REASEARCH_LISH]
                });
            }
        });
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable
                        ref={dt}
                        value={items}
                        lazy
                        selectionMode="single"
                        loading={loading}
                        loadingIcon={<ProgressSpinner />}
                        selection={selectedRows}
                        onSelectionChange={(e) => setSelectedRows(e.value as any)}
                        dataKey="id"
                        totalRecords={total}
                        paginator
                        rows={pageSize}
                        rowsPerPageOptions={[5, 10, 25]}
                        first={pageSize * page}
                        onPage={(e) => onSearch({ page: e.page ? `${e.page}` : 0, pageSize: `${e.rows}` })}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        header={
                            <div className="flex justify-content-end">
                                <div className="p-input-icon-left mr-3">
                                    <i className="pi pi-search" />
                                    <InputText onChange={(e) => onSearch({ search: e.target.value.trim(), page: 0 })} placeholder="Search" />
                                </div>
                                <Button onClick={() => setSelectedRows({})} icon="pi pi-plus" label="Create" />
                            </div>
                        }
                        emptyMessage="No products found."
                    >
                        <Column headerStyle={{ width: '4rem' }}></Column>
                        <Column field="index" header="#" body={(_, options) => options.rowIndex + 1} headerStyle={{ minWidth: '6rem' }} />
                        <Column field="uuid" header="ID" headerStyle={{ minWidth: '6rem' }} />
                        <Column header="Date" body={(rowData) => dayjs(rowData?.created).format('DD/MM/YYYY')} headerStyle={{ minWidth: '4rem' }} />
                        <Column field="title" header="Name" headerStyle={{ minWidth: '15rem' }} />
                        <Column field="totalThread" header="Views" headerStyle={{ minWidth: '6rem' }} />
                        <Column header="Download" body={() => <Button outlined icon="pi pi-download" size="small" />} headerStyle={{ minWidth: '6rem' }} />
                        {/* <Column
                            header=""
                            body={(rowData) => (
                                <div>
                                    <Button text severity="secondary" icon="pi pi-trash" onClick={(e) => onConfirmDelete(e, rowData.uuid)} />
                                </div>
                            )}
                        /> */}
                    </DataTable>

                    <CreateProject visible={!!selectedRows} defaultValues={selectedRows} onDismiss={() => setSelectedRows(null)} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
