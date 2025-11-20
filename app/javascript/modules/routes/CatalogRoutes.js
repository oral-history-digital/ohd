import { Routes, Route } from 'react-router-dom';
import {
    MainCatalogPage,
    InstitutionCatalogPage,
    ArchiveCatalogPage,
    CollectionCatalogPage,
} from 'modules/catalog';

const CatalogRoutes = () => (
    <Routes>
        <Route path="/" element={<MainCatalogPage />} />
        <Route path="institutions/:id" element={<InstitutionCatalogPage />} />
        <Route path="archives/:id" element={<ArchiveCatalogPage />} />
        <Route path="collections/:id" element={<CollectionCatalogPage />} />
    </Routes>
);

export default CatalogRoutes;
