import { Component } from 'react';
import PropTypes from 'prop-types';

import RegistryEntryContainer from './RegistryEntryContainer';

export default class RegistrySearchResult extends Component {
    show(id, key) {
        if (this.props.result.ancestors[id]) {
            return (
                <span className="breadcrumb" key={key}>
                    {this.props.result.ancestors[id].name[this.props.locale]}
                    {` (ID: ${id})`}
                </span>
            )
        }
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

    render() {
        return (
            <RegistryEntryContainer
                key={this.props.result.id}
                className="RegistryEntry--searchResult"
                data={this.props.result}
                hideCheckbox={this.props.hideCheckbox}
                hideEditButtons={this.props.hideEditButtons} 
            >
                {this.breadCrumb()}
            </RegistryEntryContainer>
        )
    }
}

RegistrySearchResult.propTypes = {
    result: PropTypes.object,
    locale: PropTypes.string.isRequired,
};
