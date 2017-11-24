import React from 'react';

export default class InterviewSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.interviewFulltext ? this.props.interviewFulltext : "" ,
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className={'content-search'}>
                    <label>
                        <input type="text" className="search-input" value={this.state.value} onChange={this.handleChange} placeholder="Bitte Suchbegriff eingeben ..." />
                    </label>
                    <input type="submit" value="" className={'search-button'} />
                </form>
            </div>
        );
    }
}
