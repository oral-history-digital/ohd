import React from 'react';
import { t } from '../../../lib/utils';
import PixelLoader from '../../../lib/PixelLoader'


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
        this.props.searchInInterview({fulltext: this.state.value, id: this.props.archiveId});
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
                               autoFocus
                               />
                    </label>
                    <input type="submit" value="" className={'search-button'}/>
                </form>
                {this.loader()}
            </div>
        );
    }
}
