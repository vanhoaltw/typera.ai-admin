import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { FormItem } from '../../types/form';
import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';

const FormTextarea = ({ ...props }: FormItem & Omit<InputTextareaProps, 'name'>) => {
    const { name, control, label, ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="field">
                    {label && <label htmlFor={name}>{label}</label>}
                    <InputTextarea
                        id={name}
                        {...field}
                        {...rest}
                        className={classNames({
                            'p-invalid': !!fieldState.error?.message
                        })}
                    />
                    {!!fieldState.error?.message && <small className="text-red-500">{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
};

export default FormTextarea;
