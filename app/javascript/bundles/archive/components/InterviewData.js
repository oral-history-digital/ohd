import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class InterviewData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: !this.props.isLoggedIn || this.props.open
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        if (this.props.url && this.props.location.pathname !== this.props.url) {
            this.setState({ open: true });
            this.props.history.push(this.props.url);
        } else {
            this.setState({ open: !this.state.open });
        }
    }

    render() {
        const { open } = this.state;

        return (
            <div>
                <button
                    type="button"
                    className={classNames('accordion', { 'active': open })}
                    lang={this.props.locale}
                    onClick={this.handleClick}
                >
                    {this.props.title}
                </button>
                <div className={classNames('panel', { 'open': open })}>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

InterviewData.propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool,
    content: PropTypes.element.isRequired,
    url: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};
