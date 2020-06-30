import React from 'react';

import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import { t, admin } from '../../../lib/utils';

export default class RegistryEntrySearchResult extends React.Component {

    show(id, key) {
        if (this.props.result.ancestors[id]) {
            return (
                <span className={'breadcrumb'} key={key}>
                    {this.props.result.ancestors[id].name[this.props.locale]}
                    {` (ID: ${id})`}
                </span>
            )
        }
    }

    spacer() {
        return (
            <span> &rarr; </span>
        )
    }

    breadCrumb() {
        let paths = []
        let bread_crumbs = this.props.result.bread_crumb;
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

    renderCheckbox() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'update'})) {
            return <div>
                <input 
                    type='checkbox' 
                    className='select-checkbox' 
                    checked={this.props.selectedRegistryEntryIds.indexOf(this.props.result.registry_entry.id) > 0} 
                    onChange={() => {this.props.addRemoveRegistryEntryId(this.props.result.registry_entry.id)}}
                />
            </div>
        } else {
            return null;
        }
    }

    render() {
        return (
            <li className={'search-result'}>
                {/*this.renderCheckbox()*/}
                <RegistryEntryContainer 
                    data={this.props.result.registry_entry} 
                    key={`registry_entries-${this.props.result.registry_entry.id}`} 
                    //registryEntryParent={this.props.registryEntryParent}
                    />
                {this.breadCrumb()}
            </li>
        )
    }
}

