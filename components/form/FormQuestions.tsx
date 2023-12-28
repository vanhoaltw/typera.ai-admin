import React, { useState } from 'react';
import { FormItem } from '../../types/form';
import { Control, Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import FormUpload from './FormUpload';
import FormInput from './FormInput';
import { Dialog } from 'primereact/dialog';
import FormTextarea from './FormTextarea';
import FormSelect from './FormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InputText } from 'primereact/inputtext';

const QUESTION_TYPE = {
    RADIO: 'radio',
    TEXT: 'text'
};

const questionSchema = z.object({
    question: z.string().min(1, { message: 'Required' }),
    question_type: z.string().min(1, { message: 'Required' })
});

const AnswerRadio = ({ control, name }: { control: Control; name: string }) => {
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div className="grid mb-3">
            {fields.map((i: any, idx) => (
                <div key={i.id} className="col-3">
                    <span className="p-input-icon-right">
                        <i className="pi pi-trash text-red-400 cursor-pointer" onClick={() => remove(idx)} />
                        <Controller name={`${name}.${idx}`} control={control} render={({ field }) => <InputText {...field} placeholder={`Answer ${idx + 1}`} />} />
                    </span>
                </div>
            ))}
            <div className="col-3">
                <Button outlined className="truncate col-3" label="Add answer" onClick={() => append('')} />
            </div>
        </div>
    );
};

const DialogEditQuestion = ({ visible, onChange, onDismiss, defaultValues }: { visible: boolean; onChange: (values: any) => void; onDismiss: () => void; defaultValues?: any }) => {
    const { control, handleSubmit, watch } = useForm({ defaultValues, resolver: zodResolver(questionSchema) });
    const [questionType] = watch(['question_type']);
    const isEditQuestion = !!defaultValues?.id;

    const onSubmit = (values: any) => {
        onChange(values);
        onDismiss();
    };

    return (
        <Dialog
            visible={visible}
            style={{ maxWidth: '550px', width: '100%' }}
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
            <FormTextarea rows={3} label="Question" control={control} name="question" className="mb-2" />
            <FormSelect label="Type" options={Object.values(QUESTION_TYPE)} control={control} name="question_type" />
            {questionType === QUESTION_TYPE.RADIO && <AnswerRadio control={control} name="answer_options" />}
            <FormUpload label="Image" control={control} name="image_id" width="300px" height="200px" />
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
                    <span className="truncate">{i?.question}</span>
                    <div className="flex-shrink-0 ml-4">
                        <Button onClick={() => remove(idx)} icon="pi pi-trash" text style={{ fontSize: '1rem', height: 8, width: 20, marginRight: 4 }} severity="secondary" />
                        <Button onClick={() => setSelected(i)} icon="pi pi-pencil" text style={{ fontSize: '1rem', height: 8, width: 20 }} />
                    </div>
                </div>
            ))}

            <Button onClick={() => setSelected({})} text size="small" icon="pi pi-plus-circle" label="Add" className="p-2" style={{ width: 'fit-content', height: 24 }} />

            {selected && <DialogEditQuestion visible onDismiss={() => setSelected(null)} defaultValues={selected} onChange={handleSave} />}
        </div>
    );
};

export default FormQuestions;
