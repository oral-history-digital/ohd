import React from 'react';
import HeadingContainer from '../containers/HeadingContainer';
import { t } from "../../../lib/utils";
import spinnerSrc from '../../../images/large_spinner.gif'

export default class TableOfContents extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        if(this.props.transcriptScrollEnabled) {
            window.scrollTo(0, 114);
        } else {
            window.scrollTo(0, 1);
        }
        this.loadHeadings();
    }

    componentDidUpdate() {
        this.loadHeadings();
    }

    loadHeadings() {
        if (
            !this.props.headingsStatus[`for_interviews_${this.props.archiveId}`] ||
            this.props.headingsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'reload'
        ) {
            this.props.fetchData('interviews', this.props.archiveId, 'headings');
        }
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

    prepareHeadings() {
        let mainIndex = 0;
        let mainheading = '';
        let subIndex = 0;
        let subheading = '';
        let headings = [];
        let lastMainheading = '';

        if (this.props.interview && this.props.interview.headings) {
            Object.values(this.props.interview.headings).map((segment, index) => {
                if (segment.mainheading[this.props.locale] && /\w+/.test(segment.subheading[this.props.locale]) && segment.mainheading[this.props.locale] !== lastMainheading) {
                    mainIndex += 1;
                    subIndex = 0;
                    lastMainheading = segment.mainheading[this.props.locale];
                    mainheading = segment.mainheading[this.props.locale];
                    headings.push({
                        main: true,
                        chapter: mainIndex + '.',
                        heading: mainheading,
                        time: segment.time,
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        interview_duration: this.props.interview.duration,
                        subheadings: []
                    });
                    if (headings.length > 1) {
                        if (index < this.props.interview.headings.length) {
                            if (headings[headings.length - 2].tape_nbr == segment.tape_nbr) {
                                headings[headings.length - 2].next_time = segment.time;
                            }
                        }
                        if (headings[headings.length - 2].subheadings.length > 0) {
                            if (!headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time) {
                                if (headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].tape_nbr == segment.tape_nbr) {
                                    headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time = segment.time;
                                }
                            }
                        }
                    }
                }
                if (segment.subheading[this.props.locale] && /\w+/.test(segment.subheading[this.props.locale])) {
                    subIndex += 1;
                    subheading = segment.subheading[this.props.locale];
                    headings[mainIndex - 1].subheadings.push({
                        main: false,
                        heading: subheading,
                        chapter: mainIndex + '.' + subIndex + '.',
                        time: segment.time,
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        interview_duration: this.props.interview.duration
                    });
                    if (headings[mainIndex - 1].subheadings.length > 1) {
                        if (index < (this.props.interview.headings.length)) {
                            if (headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].tape_nbr == segment.tape_nbr) {
                                headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].next_time = segment.time;
                            }
                        }
                    }
                }
            })
        }
        return headings;
    }

    emptyHeadingsNote(headings) {
        if (headings.length <= 0) {
            if (this.props.translations !== undefined) {
                return t(this.props, 'without_index');
            }
        }
    }

    render() {
        if (
            this.props.headingsStatus[`for_interviews_${this.props.archiveId}`] && 
            this.props.headingsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched'
        ) {
            let headings = this.prepareHeadings();
            return (
                <div className={'content-index'}>
                    {this.emptyHeadingsNote(headings)}
                    {headings.map((heading, index) => {
                        return <HeadingContainer
                            key={'mainheading-' + index}
                            data={heading}
                            nextHeading={headings[index+1]}
                        />
                    })}
                </div>
            );
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
    }
}

