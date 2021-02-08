import React from 'react';
import PropTypes from 'prop-types';

import { PixelLoader } from 'modules/spinners';
import { pathBase } from 'lib/utils';
import { t } from 'modules/i18n';

export default class InterviewSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.interviewFulltext ? this.props.interviewFulltext : "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.state.value, id: this.props.archiveId});
    }

    loader(){
        if (this.props.isInterviewSearching) {
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
                            placeholder={t(this.props, 'enter_search_field')}
                        />
                    </label>
                    <input type="submit" value="" className={'search-button'}/>
                </form>
                {this.loader()}
            </div>
        );
    }
}

InterviewSearchForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    interviewFulltext: PropTypes.bool,
    isInterviewSearching: PropTypes.bool,
    searchInInterview: PropTypes.func.isRequired,
};
