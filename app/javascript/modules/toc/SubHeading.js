import React from 'react';

export default class Heading extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            active: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let endTime = (this.props.nextSubHeading) ? this.props.nextSubHeading.time : this.props.data.duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime >= nextProps.mediaTime && this.props.data.time <= nextProps.mediaTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    handleClick(tape, time) {
        // let tabIndex = (this.props.interview.lang === this.props.locale) ? 0 : 1;
        this.props.sendTimeChangeRequest(tape, time);
    }

    render() {
        let css = 'subheading ' + (this.state.active ? 'active' : 'inactive');
        return (
            <div>
                <div
                    className={css}
                    onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)}
                >
                    <div className='chapter-number'>{this.props.data.chapter}</div><div className='chapter-text' dangerouslySetInnerHTML={{__html: this.props.data.heading}} />
                </div>
            </div>
        )
    }
}
