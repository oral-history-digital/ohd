import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';

import { WrappedAccountContainer, OrderNewPasswordContainer, RegisterContainer,
    ActivateAccount } from 'modules/account';
import { UserRegistrationsContainer } from 'modules/users';
import { SearchPage } from 'modules/search';
import { WrappedInstitutionsContainer } from 'modules/admin';
import ProjectIndex from './ProjectIndex';
import ProjectRoutes from './ProjectRoutes';

const RoutesWithoutProjectId = () => (
    <Routes>
        <Route path="/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithoutProjectId = memo(RoutesWithoutProjectId);

const RoutesWithProjectId = () => (
    <Routes>
        <Route path="/:locale/user_accounts/password/new" element={<OrderNewPasswordContainer />} />
        <Route path="/:locale/user_accounts/password/edit" element={<ActivateAccount />} />
        <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate" element={<ActivateAccount />} />
        <Route exact path="/:locale/user_registrations/new" element={<RegisterContainer />} />
        <Route exact path="/:locale/user_registrations" element={<UserRegistrationsContainer />} />
        <Route path="/:locale/accounts/current" element={<WrappedAccountContainer />} />
        <Route path="/:locale/searches/archive" element={<SearchPage />} />
        <Route exact path="/:locale" element={<ProjectIndex />} />
        <Route exact path="/:locale/projects" element={<ProjectIndex />} />
        <Route exact path="/:locale/institutions" element={<WrappedInstitutionsContainer />} />
        <Route path="/:projectId/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutesWithProjectId = memo(RoutesWithProjectId);
