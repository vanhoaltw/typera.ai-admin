import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../form/FormInput';
import FormTextarea from '../form/FormTextarea';
import FormUpload from '../form/FormUpload';
import FormQuestions from '../form/FormQuestions';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_RESEARCH, UPDATE_RESEARCH } from '../../graphql/mutation';
import { GET_REASEARCH_LISH } from '../../graphql/query';
import { useEffect } from 'react';
import { safeParse } from '../../utils/common';
import { pick } from 'lodash';
import FormSelectAssistant from '../form/FormSelectAssistant';
import toast from 'react-hot-toast';

const schema = z.object({
    title: z.string().min(1, { message: 'Required' }),
    instruction: z.string().min(1, { message: 'Required' }),
    assignedTo: z.string().min(1, { message: 'Required' })
});

const initialValue = {
    title: '',
    brand: '',
    instruction: '',
    questions: '',
    assignedTo: ''
};

const CreateProject = ({ visible, onDismiss, defaultValues }: { visible: boolean; onDismiss: () => void; defaultValues?: any }) => {
    const [doCreate, { loading: createLoading }] = useMutation(CREATE_RESEARCH);
    const [doUpdate, { loading: updateLoading }] = useMutation(UPDATE_RESEARCH);
    const isEdit = !!defaultValues?.id;

    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialValue
    });

    const onSave = () => {
        const params = pick(getValues(), ['title', 'brand', 'instruction', 'questions', 'assignedTo']);
        if (params?.questions?.length) params.questions = JSON.stringify(params.questions);
        else params.questions = '';
        params.brand = params.brand || '';

        if (isEdit) {
            doUpdate({
                variables: {
                    input: params,
                    updateResearchId: defaultValues.id
                },
                onCompleted: () => onDismiss(),
                onError: (err) => toast.error(err?.message)
            });
        } else {
            doCreate({
                refetchQueries: [GET_REASEARCH_LISH],
                variables: { input: params },
                onCompleted: () => onDismiss(),
                onError: (err) => toast.error(err?.message)
            });
        }
    };

    useEffect(() => {
        if (defaultValues?.id) {
            let questionParser = safeParse(defaultValues?.questions);

            if (Array.isArray(questionParser)) {
                questionParser = questionParser.map((i) => ({ ...i, image_id: defaultValues?.files?.[i.image_id] || i.image_id }));
            }
            reset({ ...defaultValues, questions: questionParser });
        } else {
            reset(initialValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues?.id]);

    return (
        <Dialog visible={visible} style={{ maxWidth: '650px', width: '100%' }} header={isEdit ? 'Edit' : 'Create New Project'} modal className="p-fluid" onHide={onDismiss}>
            <FormInput label="Name" name="title" control={control} />
            <FormUpload label="Logo" name="brand" control={control} height="120px" width="180px" />
            <FormSelectAssistant label="Assistant" name="assignedTo" control={control} />
            {/* <FormSelect label="Language" name="language" control={control} options={languageOptions} /> */}
            <FormTextarea rows={8} label="Instructor" name="instruction" control={control} />
            <div className="border-top-1 border-200 pt-4 mt-4">
                <p className="font-bold">Questions</p>
                <FormQuestions name="questions" control={control} />
            </div>

            <footer className="flex-center mt-4 justify-content-end">
                <Button label="Cancel" text onClick={onDismiss} className="w-9rem" />
                <Button loading={updateLoading || createLoading} className="w-9rem" label="Save" onClick={handleSubmit(onSave)} />
            </footer>
        </Dialog>
    );
};

export default CreateProject;
