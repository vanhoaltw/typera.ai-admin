import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { FormItem } from '../../types/form';
import { Image, ImageProps } from 'primereact/image';
import { useUpload } from '../../hooks/upload';
import { ChangeEvent, ChangeEventHandler, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const FormUpload = ({ ...props }: FormItem & ImageProps) => {
    const { loading, onChange: onUpload } = useUpload();
    const inputRef = useRef<HTMLInputElement>(null);
    const { name, control, label, width = '200px', ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
                    const files = (event.target as HTMLInputElement).files?.[0] as File;
                    const results = await onUpload(files);
                    if (results) field.onChange(results);
                    event.target.value = '';
                };

                return (
                    <div className="field">
                        {label && <label htmlFor={name}>{label}</label>}
                        <div
                            onClick={() => inputRef.current?.click()}
                            className={classNames('w-fit cursor-pointer relative border-solid card p-4 overflow-hidden', {
                                'border-red-400': !!fieldState.error?.message
                            })}
                        >
                            {loading && (
                                <div className="overlay flex-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
                                    <ProgressSpinner style={{ height: 40, width: 40 }} />
                                </div>
                            )}
                            <img style={{ borderRadius: 'var(--border-radius)' }} src={field.value || '/layout/images/placeholder.webp'} alt={name} width={width} height="auto" {...rest} />
                        </div>
                        <input disabled={loading} onChange={handleUploadChange} type="file" accept="image/*" aria-hidden={true} multiple={false} style={{ display: 'none' }} ref={inputRef} />
                        {!!fieldState.error?.message && <small className="p-invalid">{fieldState.error.message}</small>}
                    </div>
                );
            }}
        />
    );
};

export default FormUpload;
