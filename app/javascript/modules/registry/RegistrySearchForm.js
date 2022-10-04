import { Component } from 'react';
import { FaSearch } from 'react-icons/fa';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { PixelLoader } from 'modules/spinners';
import { isMobile } from 'modules/user-agent';

export default class RegistrySearchForm extends Component {
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
            this.props.hideSidebar();
        }
        let url = `${pathBase(this.props)}/searches/registry_entry`;
        this.props.searchRegistryEntry(url, {fulltext: this.state.value});
        this.props.changeRegistryEntriesViewMode(true, this.props.projectId);
    }

    loader(){
        if (this.props.isRegistryEntrySearching) {
            return <PixelLoader />
        }
    }

    render() {
        return (
            <div className="content-search">
                <form
                    className="content-search-form"
                    onSubmit={this.handleSubmit}
                >
                    <input
                        type="search"
                        className="search-input"
                        value={this.state.value}
                        onChange={this.handleChange}
                        placeholder={t(this.props, 'search_registry_entry')}
                        aria-label={t(this.props, 'search_registry_entry')}
                    />
                    <button
                        type="submit"
                        className="Button Button--transparent Button--icon search-button"
                    >
                        <FaSearch className="Icon Icon--primary" />
                    </button>
                </form>
                {this.loader()}
            </div>
        );
    }
}
