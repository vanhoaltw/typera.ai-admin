import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { FormItem } from '../../types/form';
import { Image, ImageProps } from 'primereact/image';

const FormUpload = ({ ...props }: FormItem & ImageProps) => {
    const { name, control, label, width = '150', ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="field">
                    {label && <label htmlFor={name}>{label}</label>}
                    <div
                        style={{ borderRadius: 'var(--border-radius)', overflow: 'hidden' }}
                        className={classNames('w-fit cursor-pointer', {
                            'border-solid border-red-400': !!fieldState.error?.message
                        })}
                    >
                        <Image src={field.value || '/layout/images/placeholder.webp'} alt={name} width={width} preview={!!field.value} />
                    </div>
                    {!!fieldState.error?.message && <small className="p-invalid">{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
};

export default FormUpload;
