import { Button } from 'primereact/button';
import { useDowload } from '../hooks/useDowload';

const ButtonDowload = ({ researchId }: { researchId: number }) => {
    const { doRequest, loading } = useDowload();
    return <Button outlined icon="pi pi-download" size="small" loading={loading} onClick={() => doRequest(researchId)} />;
};

export default ButtonDowload;
