import React from 'react';
import PropTypes from 'prop-types';
import { loggedIn } from '../../../lib/utils';

export default class InterviewData extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: !loggedIn(this.props) || this.props.open
        };

    }

    handleClick(){
        if (this.props.url && this.context.router.route.location.pathname !== this.props.url) {
            this.setState({['open']: true});
            this.context.router.history.push(this.props.url);
        } else {
            this.setState({['open']: !this.state.open});
        }
    }

    render() {
        let headerCss =   this.state.open ? "accordion active" : 'accordion';
        let panelCss =   this.state.open ? "panel open" : 'panel';

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
