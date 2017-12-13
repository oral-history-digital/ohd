import React from 'react';

export default class RefTreeEntry extends React.Component {

    constructor(props, context) {
        super(props, context);

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

    handleClick(time) {
        if (this.props.entry.type === 'leafe') {
            this.props.handleSegmentClick(this.props.tape, time);
        } else {
            this.toggle();
        }
    }

    desc() {
        if (this.props.entry.desc) {
            return this.props.entry.desc[this.props.locale];
        } else {
            return this.props.index + 1;
        }
    }

    render () {
        let icoClass = this.state.expanded ? 'heading-ico active': 'heading-ico' ;
        return (
            <div className='heading'>
                <div className={icoClass}></div>
                <div 
                    className='mainheading'
                    onClick={() => this.handleClick(this.props.entry.start_time)} 
                >
                    {this.desc()}
                    {this.props.renderChildren(this.props.entry.children)}
                </div>
            </div>
        )
    }
}

