# Startup Components

This directory contains React component wrappers that serve as entry points for individual pages in the multi-page Rails application. Each startup file wraps a page component with the necessary providers (Redux, SWR, Theme) but **without** React Router.

## Purpose

These startup files were created to split the SPA (Single Page Application) into multiple pages for use in a traditional multi-page Rails application. Each file can be independently loaded on different pages without the overhead of routing logic.

## Structure

Each startup file follows this pattern:

```javascript
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { ComponentName } from 'modules/...';

const StartupName = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <ComponentName />
        </Provider>
    </SWRConfig>
);

export default StartupName;
```

## Available Startup Components

### From Routes.js
- **NotFoundPage** - 404 error page
- **SiteStartpage** - Site landing page (for OHD projects)
- **ArchivePage** - Projects/archives listing page
- **Institutions** - Institutions management page
- **HelpTextAdmin** - Help text administration
- **Home** - Project home page

### From CatalogRoutes.js
- **MainCatalog** - Main catalog page
- **InstitutionCatalog** - Institution catalog detail page
- **ArchiveCatalog** - Archive catalog detail page
- **CollectionCatalog** - Collection catalog detail page

### From ProjectRoutes.js

#### Interview Management
- **EditInterview** - Create/edit interview
- **Interview** - Interview detail page

#### Search
- **Search** - Archive search page
- **SearchMap** - Map-based search

#### Registry
- **Registry** - Registry entries listing

#### User Management
- **Account** - User account page
- **OrderNewPassword** - Request new password
- **ActivateAccount** - Account activation
- **UsersAdmin** - User administration

#### Admin Pages
- **Uploads** - File uploads management
- **EditProjectInfo** - Project information editor
- **EditProjectConfig** - Project configuration editor
- **EditProjectAccessConfig** - Access configuration editor
- **EditProjectDisplay** - Display settings editor
- **MetadataFields** - Metadata fields management
- **PeopleAdmin** - People administration
- **EventTypesAdmin** - Event types management

#### Data Management
- **RegistryReferenceTypes** - Registry reference types
- **RegistryNameTypes** - Registry name types
- **ContributionTypes** - Contribution types management
- **Languages** - Languages management
- **TranslationValues** - Translation values management
- **Collections** - Collections management
- **Roles** - Roles management
- **Permissions** - Permissions management
- **TaskTypes** - Task types management

#### Text Pages
- **TextPageConditions** - Terms and conditions
- **TextPageOhdConditions** - OHD conditions
- **TextPagePrivacyProtection** - Privacy policy
- **TextPageContact** - Contact page
- **TextPageLegalInfo** - Legal information

## Pack Files

The startup components are registered in pack files located in `app/javascript/packs/`:

- **routes.js** - Registers components from Routes.js
- **catalog.js** - Registers components from CatalogRoutes.js
- **project.js** - Registers components from ProjectRoutes.js
- **application.js** - Original SPA application (kept for backward compatibility)

## Usage in Rails

To use these components in Rails views, use the `react_component` helper:

```erb
<%= react_component("ComponentName", props: { /* your props */ }) %>
```

Make sure to include the appropriate pack file in your layout or view:

```erb
<%= javascript_pack_tag 'routes' %>
<!-- or -->
<%= javascript_pack_tag 'catalog' %>
<!-- or -->
<%= javascript_pack_tag 'project' %>
```

## Key Differences from SPA Version

- **No React Router** - These components don't include routing logic
- **No BrowserRouter** - Each component is a standalone page
- **Same State Management** - Uses the same Redux store setup
- **Same Styling** - Includes the same SCSS styles

## Migration Notes

The original SPA routing structure remains intact in:
- `modules/routes/Routes.js`
- `modules/routes/ProjectRoutes.js`
- `modules/routes/CatalogRoutes.js`

These router files are still used by the `App.js` component and can coexist with the new startup files.
