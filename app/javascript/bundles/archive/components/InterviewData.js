import React from 'react';
import PropTypes from 'prop-types';

export default class InterviewData extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            open: !this.props.isLoggedIn || this.props.open
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        if (this.props.url && this.props.location.pathname !== this.props.url) {
            this.setState({['open']: true});
            this.props.history.push(this.props.url);
        } else {
            this.setState({['open']: !this.state.open});
        }
    }

    render() {
        let headerCss = this.state.open ? "accordion active" : 'accordion';
        let panelCss = this.state.open ? "panel open" : 'panel';

        return (
            <div>
                <button className={headerCss} lang={this.props.locale} onClick={this.handleClick} >
                    {this.props.title}
                </button>
                <div className={panelCss}> {this.props.content} </div>
            </div>
        );
    }
}
