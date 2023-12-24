import React, { useState } from 'react';
import { FormItem } from '../../types/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import FormUpload from './FormUpload';
import FormInput from './FormInput';
import { Dialog } from 'primereact/dialog';

const DialogQuestion = ({ visible, onChange, onDismiss, defaultValues }: { visible: boolean; onChange: (values: any) => void; onDismiss: () => void; defaultValues?: any }) => {
    const { control, handleSubmit } = useForm({
        defaultValues
    });

    const isEditQuestion = !!defaultValues;

    const onSubmit = (values: any) => {
        onChange(values);
        onDismiss();
    };

    return (
        <Dialog
            visible={visible}
            style={{ maxWidth: '450px', width: '100%' }}
            header={!isEditQuestion ? 'Add Question' : 'Edit Question'}
            modal
            className="p-fluid"
            onHide={onDismiss}
            footer={
                <>
                    <Button label="Cancel" text onClick={onDismiss} />
                    <Button label="Save" onClick={handleSubmit(onSubmit)} />
                </>
            }
        >
            <FormInput label="Question" control={control} name="text" className="mb-2" />
            <FormUpload label="Image" control={control} name="image" width="200" />
        </Dialog>
    );
};

const FormQuestions = ({ control, name }: FormItem) => {
    const [selected, setSelected] = useState<any>(null);
    const { fields, append, remove, update } = useFieldArray({ control, name });

    const handleSave = (values?: any) => {
        if (selected?.id) {
            const updateIdx = fields.findIndex((i) => i.id === selected.id);
            update(updateIdx, values);
        } else {
            append(values);
        }
    };

    return (
        <div className="flex flex-column" style={{ rowGap: 10 }}>
            {fields.map((i: any, idx) => (
                <div key={i.id} className="flex justify-content-between border-bottom-1 border-100 pb-1">
                    <span>{i?.text}</span>
                    <div>
                        <Button onClick={() => remove(idx)} icon="pi pi-trash" text style={{ fontSize: '1rem', height: 8, width: 20, marginRight: 4 }} severity="secondary" />
                        <Button onClick={() => setSelected(i)} icon="pi pi-eye text-primary-600" text style={{ fontSize: '1rem', height: 8, width: 20 }} />
                    </div>
                </div>
            ))}

            <Button onClick={() => setSelected({})} text size="small" icon="pi pi-plus-circle" label="Add" className="p-2" style={{ width: 'fit-content', height: 24 }} />

            {selected && <DialogQuestion visible onDismiss={() => setSelected(null)} defaultValues={selected} onChange={handleSave} />}
        </div>
    );
};

export default FormQuestions;
