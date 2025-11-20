import {
    ArchiveCatalogPage,
    CollectionCatalogPage,
    InstitutionCatalogPage,
    MainCatalogPage,
} from 'modules/catalog';
import { Route, Routes } from 'react-router-dom';

const CatalogRoutes = () => (
    <Routes>
        <Route path="/" element={<MainCatalogPage />} />
        <Route path="institutions/:id" element={<InstitutionCatalogPage />} />
        <Route path="archives/:id" element={<ArchiveCatalogPage />} />
        <Route path="collections/:id" element={<CollectionCatalogPage />} />
    </Routes>
);

export default CatalogRoutes;
