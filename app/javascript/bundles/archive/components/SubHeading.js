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
        let endTime =  (this.props.data.next_start_time) ? this.props.data.next_start_time : this.props.data.interview_duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime > nextProps.transcriptTime && this.props.data.start_time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }


    handleClick(tape, time) {
            this.props.handleSegmentClick(tape, time);
    }


    render() {
        let css = 'subheading ' + (this.state.active ? 'active' : 'inactive');
        return (
            <div>
                <div
                    className={css}
                    onClick={() => this.handleClick(this.props.data.tape_nbr, this.props.data.time)}
                >
                    <div className='chapter-number'>{this.props.data.chapter}</div><div className='chapter-text'>{this.props.data.heading}</div>
                </div>
            </div>
        )
    }
}

