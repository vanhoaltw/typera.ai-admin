import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../form/FormInput';
import FormTextarea from '../form/FormTextarea';
import FormSelect from '../form/FormSelect';
import { languageOptions } from '../../configs/options';
import FormUpload from '../form/FormUpload';
import { Divider } from 'primereact/divider';
import FormQuestions from '../form/FormQuestions';

const schema = z.object({
    name: z.string().min(1, { message: 'Required' }),
    age: z.number().min(10)
});

const CreateProject = ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => {
    const { control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            logo: '',
            language: 'en',
            instructor: '',
            questions: []
        }
    });

    const onSave = () => {};

    return (
        <Dialog
            visible={visible}
            style={{ maxWidth: '650px', width: '100%' }}
            header="Create New Project"
            modal
            className="p-fluid"
            onHide={onDismiss}
            footer={
                <>
                    <Button label="Cancel" text onClick={onDismiss} />
                    <Button label="Save" onClick={onSave} />
                </>
            }
        >
            <FormInput label="Name" name="name" control={control} />
            <FormUpload label="Logo" name="logo" control={control} />
            <FormSelect label="Language" name="language" control={control} options={languageOptions} />
            <FormTextarea rows={4} label="Instructor" name="instructor" control={control} />
            <div className="border-top-1 border-200 pt-4 mt-4">
                <p className="font-bold">Questions</p>
                <FormQuestions name="questions" control={control} />
            </div>
        </Dialog>
    );
};

export default CreateProject;
