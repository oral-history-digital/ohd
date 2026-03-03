import { Route, Routes } from 'react-router-dom';

import Explorer from './Explorer';
import {
    ArchivePage,
    CollectionPage,
    InstitutionPage,
    InstitutionsList,
} from './components';

export const ExplorerRoutes = () => (
    <Routes>
        <Route path="/" element={<Explorer />} />
        <Route path="institutions/" element={<InstitutionsList />} />
        <Route path="institutions/:id" element={<InstitutionPage />} />
        <Route path="archives/:id" element={<ArchivePage />} />
        <Route path="collections/:id" element={<CollectionPage />} />
    </Routes>
);

export default ExplorerRoutes;
