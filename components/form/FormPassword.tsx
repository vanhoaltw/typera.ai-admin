import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { FormItem } from '../../types/form';
import { Password, PasswordProps } from 'primereact/password';

const FormPassword = ({ ...props }: FormItem & Omit<PasswordProps, 'name'>) => {
    const { name, control, label, ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="field">
                    {label && <label htmlFor={name}>{label}</label>}
                    <Password
                        id={name}
                        toggleMask
                        className={classNames('w-full', {
                            'p-invalid': !!fieldState.error?.message
                        })}
                        {...field}
                        {...rest}
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

export default FormPassword;
