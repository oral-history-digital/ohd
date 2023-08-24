import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function RegistryEntryBreadcrumbs({
    registryEntry,
}) {
    const { locale } = useI18n();

    function label(id, key) {
        if (!registryEntry.ancestors[id]) {
            return null;
        }

        return (
            <span className="breadcrumb" key={key}>
                {registryEntry.ancestors[id].name[locale]}
            </span>
        );
    }

    let paths = [];
    let breadCrumbs = registryEntry.bread_crumb;

    if (breadCrumbs) {
        Object.keys(breadCrumbs).map((id, key) => {
            let breadCrumbPath = [];
            breadCrumbPath.push(label(id, `${key}`));
            let current = breadCrumbs[id]
            let counter = 0
            while (current) {
                counter = counter + 1;
                let currentId = Object.keys(current)[0];
                breadCrumbPath.push(label(currentId, `${key}-${counter}`));
                current = current[currentId];
            }
            paths.push(breadCrumbPath.reverse().splice(1)); // remove first "Register"
            paths.push(<br key={key}/>)
        })
        paths.splice(-1,1) //remove last <br />
    }
    return paths;
}

RegistryEntryBreadcrumbs.propTypes = {
    registryEntry: PropTypes.object.isRequired,
};
