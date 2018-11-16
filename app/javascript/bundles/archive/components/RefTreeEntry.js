import React from 'react';

export default class RefTreeEntry extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            expanded: false,
        }

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > $(".site-header").height());
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }

    toggle() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }

    handleClick(tape, time) {
        if (this.props.entry.type === 'leafe') {
            this.props.handleSegmentClick(tape, time);
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

