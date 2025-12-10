import CatalogTable from './CatalogTable';
import useInstance from './useInstance';
import useMainData from './useMainData';

export default function MainCatalog() {
    const data = useMainData();
    const { instance } = useInstance(data, 'main');

    return <CatalogTable className="u-mt" instance={instance} />;
}
