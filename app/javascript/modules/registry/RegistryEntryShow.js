import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaGlobeEurope } from 'react-icons/fa';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { admin } from 'modules/auth';
import { formatTimecode } from 'modules/interview-helpers';
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
        if((this.registryEntry().latitude + this.registryEntry().longitude) !== 0 ) {
            return(
                <small style={{float: 'right'}}>
                    <FaGlobeEurope className="Icon Icon--text Icon--small" />
                    &nbsp;
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${this.registryEntry().latitude}&mlon=${this.registryEntry().longitude}&zoom=6`}
                        target="_blank"
                        rel="noreferrer"
                        >
                        {`${this.registryEntry().latitude}, ${this.registryEntry().longitude}`}
                        &nbsp;
                    </a>
                </small>
            )
        } else {
            return null;
        }
    }

    render() {
        const { locale } = this.props;

        if (!this.registryEntry()?.associations_loaded) {
            return null;
        }

        return (
            <div>
                <div>
                    {this.osmLink()}
                    {this.breadCrumb()}
                </div>
                <h3>
                    {this.registryEntry().name[locale]}
                </h3>
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
