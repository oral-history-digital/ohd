import React from 'react';

export default class Subfacet extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            checked: this.props.checkedState,
        };
    }


    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        let newState =  !this.state.checked;
        this.setState({checked: newState }, function(){
            this.props.onChange(null, name, newState, value );
        });

    }

    render() {
        return (
            <div>
                <input className={this.props.categoryId + ' checkbox'} id={this.props.categoryId + "_" + this.props.data.entry.id}
                       name={this.props.categoryId + "[]"} checked={this.state.checked} type="checkbox" value={this.props.data.entry.id}
                       onChange={this.handleChange}>

                </input>
                <span> {this.props.data.entry.descriptor}</span>
                <span>({this.props.data.count})</span>
            </div>
        )
    }

}


