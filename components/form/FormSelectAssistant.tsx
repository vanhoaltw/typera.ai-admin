'use client';

import { useMemo } from 'react';
import FormSelect, { FormSelectProps } from './FormSelect';
import { useQuery } from '@apollo/client';
import { ASSISTANT_LIST } from '../../graphql/query';

const FormSelectAssistant = (props: Omit<FormSelectProps, 'options'>) => {
    const { data, loading } = useQuery(ASSISTANT_LIST, {
        fetchPolicy: 'cache-first'
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options = useMemo(() => data?.getAssistantList?.map?.((i: any) => ({ label: i.name, value: i.id })) || [], [data?.getAssistantList?.length]);

    return <FormSelect {...props} disabled={loading} options={options} />;
};

export default FormSelectAssistant;
