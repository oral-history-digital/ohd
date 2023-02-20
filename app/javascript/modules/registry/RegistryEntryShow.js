import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaGlobeEurope } from 'react-icons/fa';

import EntryReferencesContainer from './EntryReferencesContainer';

export default class RegistryEntryShow extends Component {
    componentDidMount() {
        this.loadWithAssociations();
    }

    componentDidUpdate() {
        this.loadWithAssociations();
    }

    loadWithAssociations() {
        if (
            !this.registryEntry()?.associations_loaded &&
            this.props.registryEntriesStatus[this.props.registryEntryId] !== 'fetching'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryEntryId, null, 'with_associations=true');
        }
    }

    registryEntry() {
        return this.props.registryEntries[this.props.registryEntryId];
    }

    show(id, key) {
        if(this.registryEntry().ancestors[id]){
            return (
                <span className={'breadcrumb'} key={key}>
                    {this.registryEntry().ancestors[id].name[this.props.locale]}
                    {/* {` (ID: ${id})`} */}
                </span>
            )
        } else {
            return null;
        }
    }

    breadCrumb() {
        let paths = []
        let bread_crumbs = this.registryEntry().bread_crumb;
        if (bread_crumbs) {
            Object.keys(bread_crumbs).map((id, key) => {
                let breadCrumbPath = [];
                breadCrumbPath.push(this.show(id, `${key}`));
                let current = bread_crumbs[id]
                let counter = 0
                while (current) {
                    counter = counter + 1;
                    let currentId = Object.keys(current)[0];
                    breadCrumbPath.push(this.show(currentId, `${key}-${counter}`));
                    current = current[currentId];
                }
                paths.push(breadCrumbPath.reverse().splice(1)); // remove first "Register"
                paths.push(<br key={key}/>)
            })
            paths.splice(-1,1) //remove last <br />
        }
        return paths;
    }

    osmLink() {
        const { locale } = this.props;
        const re = this.registryEntry();

        if ((re.latitude + re.longitude === 0) ||
            typeof re.latitude !== 'number' ||
            typeof re.longitude !== 'number'
        ) {
            return null;
        }

        return(
            <small className="u-ml-small">
                <a
                    href={`https://www.openstreetmap.org/?mlat=${re.latitude}&mlon=${re.longitude}&zoom=6`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaGlobeEurope className="Icon Icon--text Icon--small" />
                    {' '}
                    {re.latitude.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {'; '}
                    {re.longitude.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </a>
            </small>
        );
    }

    render() {
        const { locale } = this.props;

        if (!this.registryEntry()?.associations_loaded) {
            return null;
        }

        return (
            <div>
                <div>
                    {this.breadCrumb()}
                </div>
                <h3>
                    {this.registryEntry().name[locale]}
                    {this.osmLink()}
                </h3>
                <div className='small-right'>
                    {this.props.normDataLinks}
                </div>
                <p>
                    {this.registryEntry().notes[locale]}
                </p>
                <EntryReferencesContainer registryEntry={this.registryEntry()} onSubmit={this.props.onSubmit} />
            </div>
        );
    }
}

RegistryEntryShow.propTypes = {
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
