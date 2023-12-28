import { InputText, InputTextProps } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { FormItem } from '../../types/form';

const FormInput = ({ ...props }: FormItem & Omit<InputTextProps, 'name'> & { rootClassName?: string }) => {
    const { name, control, label, rootClassName, ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className={classNames('field', rootClassName)}>
                    {label && <label htmlFor={name}>{label}</label>}
                    <InputText
                        id={name}
                        {...field}
                        {...rest}
                        className={classNames('w-full', {
                            'p-invalid': !!fieldState.error?.message
                        })}
                    />
                    {!!fieldState.error?.message && (
                        <div>
                            <small className="p-invalid text-red-500">{fieldState.error.message}</small>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export default FormInput;
