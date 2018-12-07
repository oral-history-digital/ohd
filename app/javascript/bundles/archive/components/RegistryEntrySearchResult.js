import React from 'react';

import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import { t } from '../../../lib/utils';

export default class RegistryEntrySearchResult extends React.Component {

    show(id) {
        return (
            <span>
                {this.props.result.ancestors[id].name[this.props.locale]}
                {` (ID: ${id})`}
            </span>
        )
    }

    spacer() {
        return (
            <span> &rarr; </span>
        )
    }

    breadCrumb() {
        let breadCrumbPath = [];
        let current = this.props.result.bread_crumb;
        while (current) {
            let currentId = Object.keys(current)[0];
            breadCrumbPath.push(this.spacer());
            breadCrumbPath.push(this.show(currentId));
            current = current[currentId];
        }
        return breadCrumbPath.reverse();
    }

    render() {
        return (
            <div>
                {this.breadCrumb()}
                <RegistryEntryContainer 
                    registryEntry={this.props.result.registry_entry} 
                    key={`registry_entries-${this.props.result.registry_entry.id}`} 
                    //registryEntryParent={this.props.registryEntryParent}
                />
            </div>
        )
    }
}

