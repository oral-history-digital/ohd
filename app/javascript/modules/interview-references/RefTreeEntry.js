import { Component } from 'react';
import PropTypes from 'prop-types';

export default class RefTreeEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        }

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }

    handleClick(tape, time) {
        if (this.props.entry.type === 'leafe') {
            this.props.sendTimeChangeRequest(tape, time);
        } else {
            this.toggle();
        }
    }

    desc() {
        if (this.props.entry.desc) {
            return `${this.props.entry.desc[this.props.locale]} (${this.props.entry.leafe_count})`
        } else {
            return this.props.index + 1;
        }
    }

    render() {
        let icoClass = this.state.expanded ? 'heading-ico active' : 'heading-ico';
        return (
            <div className='heading'>
                <div
                    className={icoClass}
                    onClick={() => this.toggle()}
                />
                <div
                    className='mainheading'
                    onClick={() => this.handleClick(this.props.entry.tape_nbr, this.props.entry.time)}
                >
                    {this.desc()}
                </div>
                <div className={this.state.expanded ? 'expanded' : 'collapsed'}>
                    {this.props.renderChildren(this.props.entry.children)}
                </div>
            </div>
        )
    }
}

RefTreeEntry.propTypes = {
    entry: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    locale: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    renderChildren: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
