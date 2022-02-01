import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { WrappedAccountContainer, OrderNewPasswordContainer, RegisterContainer, ActivateAccount }
    from 'modules/account';
import { UserRegistrationsContainer } from 'modules/users';
import { ArchiveSearchContainer } from 'modules/search';
import ProjectIndex from './ProjectIndex';
import ProjectRoutes from './ProjectRoutes';
import { WrappedInstitutionsContainer } from 'modules/admin';

export const Routes = () => (
    <Switch>
        <Route path="/:locale">
            <ProjectRoutes />
        </Route>
    </Switch>
);

export const MemoizedRoutes = memo(Routes);

export const RoutesWithProjectId = () => (
    <Switch>
        {/* OHD account and search routes */}
        <Route path="/:locale/user_accounts/password/new">
            <ErrorBoundary>
                <OrderNewPasswordContainer />
            </ErrorBoundary>
        </Route>
        <Route path="/:locale/user_accounts/password/edit">
            <ErrorBoundary>
                <ActivateAccount />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate">
            <ErrorBoundary>
                <ActivateAccount />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale/user_registrations/new">
            <ErrorBoundary>
                <RegisterContainer />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale/user_registrations">
            <ErrorBoundary>
                <UserRegistrationsContainer />
            </ErrorBoundary>
        </Route>
        <Route path="/:locale/accounts/current">
            <ErrorBoundary>
                <WrappedAccountContainer />
            </ErrorBoundary>
        </Route>
        <Route path="/:locale/searches/archive">
            <ErrorBoundary>
                <ArchiveSearchContainer />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale">
            <ErrorBoundary>
                <ProjectIndex />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale/projects">
            <ErrorBoundary>
                <ProjectIndex />
            </ErrorBoundary>
        </Route>
        <Route exact path="/:locale/institutions">
            <ErrorBoundary>
                <WrappedInstitutionsContainer />
            </ErrorBoundary>
        </Route>

        <Route path="/:projectId/:locale">
            <ProjectRoutes />
        </Route>
    </Switch>
);

export const MemoizedRoutesWithProjectId = memo(RoutesWithProjectId);
