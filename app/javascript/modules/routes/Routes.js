import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AccountPage, OrderNewPasswordContainer, RegisterContainer,
    ActivateAccount } from 'modules/account';
import { UserRegistrationsContainer } from 'modules/users';
import { SearchPage } from 'modules/search';
import { WrappedInstitutionsContainer, ArchivePage, HelpTextAdminPage } from 'modules/admin';
import { SiteStartpage } from 'modules/site-startpage';
import ProjectRoutes from './ProjectRoutes';
import CatalogRoutes from './CatalogRoutes';
import NotFoundPage from './NotFoundPage';

const AllRoutes = () => (
    <Routes>
        <Route path="/:locale/not_found" element={<NotFoundPage />} />
        <Route path="/:locale/user_accounts/password/new" element={<OrderNewPasswordContainer />} />
        <Route path="/:locale/user_accounts/password/edit" element={<ActivateAccount />} />
        <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate" element={<ActivateAccount />} />
        <Route exact path="/:locale/user_registrations/new" element={<RegisterContainer />} />
        <Route exact path="/:locale/user_registrations" element={<UserRegistrationsContainer />} />
        <Route path="/:locale/accounts/current" element={<AccountPage />} />
        <Route path="/:locale/searches/archive" element={<SearchPage />} />
        <Route path="/:locale/catalog/*" element={<CatalogRoutes />} />
        <Route exact path="/:locale" element={<SiteStartpage />} />
        <Route exact path="/:locale/projects" element={<ArchivePage />} />
        <Route exact path="/:locale/institutions" element={<WrappedInstitutionsContainer />} />
        <Route exact path="/:locale/help_texts" element={<HelpTextAdminPage />} />
        <Route path="/:projectId/:locale/*" element={<ProjectRoutes />} />
    </Routes>
);

export const MemoizedRoutes = memo(AllRoutes);
