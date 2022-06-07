import useMainData from './useMainData';
import useInstance from './useInstance';
import CatalogTable from './CatalogTable';

export default function MainCatalog() {
    const { data } = useMainData();
    const { instance } = useInstance(data, 'main');

    return <CatalogTable className="u-mt" instance={instance} />;
}
