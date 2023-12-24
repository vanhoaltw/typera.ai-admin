export type FormItem<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    label?: string;
    description?: string;
} & Omit<ControllerProps<TFieldValues, TName>, 'render'>;
