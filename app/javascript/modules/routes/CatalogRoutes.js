import {
    CollectionPage,
    Explorer,
    InstitutionPage,
    ProjectPage,
} from 'modules/explorer';
import { Route, Routes } from 'react-router-dom';

const CatalogRoutes = () => (
    <Routes>
        <Route path="/" element={<Explorer />} />
        <Route path="institutions" element={<Explorer />} />
        <Route path="institutions/:id" element={<InstitutionPage />} />
        <Route path="archives/:id" element={<ProjectPage />} />
        <Route path="collections/:id" element={<CollectionPage />} />
    </Routes>
);

export default CatalogRoutes;
