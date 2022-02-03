export { NAME as SIDEBAR_NAME, INDEX_NONE, INDEX_ACCOUNT, INDEX_SEARCH,
    INDEX_INTERVIEW, INDEX_REGISTRY_ENTRIES, INDEX_MAP, INDEX_INDEXING,
    INDEX_PROJECTS, INDEX_INSTITUTIONS
} from './constants';

export { showSidebar, hideSidebar, toggleSidebar, setSidebarTabsIndex }
    from './actions';

export { default as sidebarReducer } from './reducer';

export { getSidebarVisible } from './selectors';

export { default as Sidebar } from './components/Sidebar';
