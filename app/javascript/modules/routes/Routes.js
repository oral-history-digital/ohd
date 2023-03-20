import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AccountPage, OrderNewPasswordContainer, RegisterContainer,
    ActivateAccount } from 'modules/user';
import { SearchPage } from 'modules/search';
import { UsersAdminPage, WrappedInstitutionsContainer, ArchivePage, HelpTextAdminPage } from 'modules/admin';
import { SiteStartpage } from 'modules/site-startpage';
import { HomeContainer } from 'modules/startpage';
import ProjectRoutes from './ProjectRoutes';
import CatalogRoutes from './CatalogRoutes';
import NotFoundPage from './NotFoundPage';

const RoutesWithoutProjectId = ({project}) => (
    <Routes>
        <Route path="/:locale/not_found" element={<NotFoundPage />} />
        { project.is_ohd ?
            <>
                <Route exact path="/:locale" element={<SiteStartpage />} />
                <Route exact path="/:locale/projects" element={<ArchivePage />} />
                <Route exact path="/:locale/institutions" element={<WrappedInstitutionsContainer />} />
                <Route exact path="/:locale/help_texts" element={<HelpTextAdminPage />} />
                <Route path="/:locale/catalog/*" element={<CatalogRoutes />} />
            </> : <Route exact path="/:locale" element={<HomeContainer />} />
        }
        <Route path="/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithoutProjectId = memo(RoutesWithoutProjectId);

const RoutesWithProjectId = () => (
    <Routes>
        <Route path="/:locale/not_found" element={<NotFoundPage />} />
        <Route exact path="/:projectId/:locale" element={<HomeContainer />} />
        <Route path="/:projectId/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithProjectId = memo(RoutesWithProjectId);
