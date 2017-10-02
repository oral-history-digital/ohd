import React from 'react';

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        //this.props.searchSegments({fulltext: this.props.value, id: this.props.interviewId});
        this.props.searchSegments($('#interviewSearchForm').serialize());
    }

    render() {
        return (
            <div>
                <form id="interviewSearchForm" onSubmit={this.handleSubmit}>
                    <input name="id" type="hidden" value={this.props.interviewId} />
                    <label>
                        <input type="text" name="fulltext" value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}
