import React from 'react';

export default class Subfacet extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        const value = target.value.toString();
        let newState = target.checked;//!this.state.checked;
        this.props.onChange(null, name, newState, value);
    }


    render() {
        return (
            <div>
                <input className={this.props.categoryId + ' checkbox'}
                       id={this.props.categoryId + "_" + this.props.data.entry.id}
                       name={this.props.categoryId + "[]"}
                       checked={this.props.isChecked(this.props.categoryId + "[]", this.props.data.entry.id.toString())}
                       type="checkbox" value={this.props.data.entry.id}
                       onChange={this.handleChange}>
                </input>
                <span> {this.props.data.entry.descriptor}</span>
                <span>({this.props.data.count})</span>
            </div>
        )
    }
}


