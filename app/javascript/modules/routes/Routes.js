import { memo } from 'react';

import {
    ArchivePage,
    HelpTextAdminPage,
    WrappedInstitutionsContainer,
} from 'modules/admin';
import { Homepage } from 'modules/homepage';
import { ProjectHome } from 'modules/startpage';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';

import CatalogRoutes from './CatalogRoutes';
import NotFoundPage from './NotFoundPage';
import ProjectRoutes from './ProjectRoutes';

const RoutesWithoutProjectId = ({ project }) => (
    <Routes>
        <Route path="/:locale/not_found" element={<NotFoundPage />} />
        {project.is_ohd ? (
            <>
                <Route exact path="/:locale" element={<Homepage />} />
                <Route
                    exact
                    path="/:locale/projects"
                    element={<ArchivePage />}
                />
                <Route
                    exact
                    path="/:locale/institutions"
                    element={<WrappedInstitutionsContainer />}
                />
                <Route
                    exact
                    path="/:locale/help_texts"
                    element={<HelpTextAdminPage />}
                />
                <Route path="/:locale/catalog/*" element={<CatalogRoutes />} />
            </>
        ) : (
            <Route exact path="/:locale" element={<ProjectHome />} />
        )}
        <Route path="/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithoutProjectId = memo(RoutesWithoutProjectId);

const RoutesWithProjectId = () => (
    <Routes>
        <Route path="/:locale/not_found" element={<NotFoundPage />} />
        <Route exact path="/:projectId/:locale" element={<ProjectHome />} />
        <Route path="/:projectId/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithProjectId = memo(RoutesWithProjectId);

RoutesWithoutProjectId.propTypes = {
    project: PropTypes.object,
};
