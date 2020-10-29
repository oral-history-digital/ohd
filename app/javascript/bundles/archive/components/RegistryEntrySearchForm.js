import React from 'react';
import { t, pathBase } from '../../../lib/utils';
import PixelLoader from '../../../lib/PixelLoader'
import isMobile from '../../../lib/media-queries';

export default class RegistryEntrySearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.fulltext ? this.props.fulltext : "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (isMobile()) {
            this.props.hideFlyoutTabs();
        }
        let url = `${pathBase(this.props)}/searches/registry_entry`;
        this.props.searchRegistryEntry(url, {fulltext: this.state.value});
    }

    loader(){
        if (this.props.isRegistryEntrySearching) {
            return <PixelLoader />
        }
    }

    render() {
        return (
            <div className={'content-search'}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text"
                               className="search-input"
                               value={this.state.value}
                               onChange={this.handleChange}
                               placeholder={t(this.props, 'search_registry_entry')}/>
                    </label>
                    <input type="submit" value="" className={'search-button'}/>
                </form>
                {this.loader()}
            </div>
        );
    }
}
