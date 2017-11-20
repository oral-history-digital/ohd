import React from 'react';


export default class InterviewData extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false
        };

    }

    handleClick(){
        this.setState({['open']: !this.state.open});
    }



    render() {

        let headerCss =   this.state.open ? "accordion active" : 'accordion';
        let panelCss =   this.state.open ? "panel open" : 'panel';

        return (
            <div>
                <button className={headerCss} onClick={this.handleClick} >
                    {this.props.title}
                </button>
                <div className={panelCss}> {this.props.content} </div>
            </div>
        );
    }
}
