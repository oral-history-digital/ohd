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
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'headings');
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
            Object.values(this.props.interview.headings).sort(function(a, b) {return a.tape_nbr - b.tape_nbr || a.time - b.time}).map((segment, index) => {
                mainheading = segment.mainheading[this.props.locale] ||
                    segment.mainheading[`${this.props.locale}-public`] //||
                    //segment.mainheading['de'] ||
                    //segment.mainheading['de-public'];
                subheading = segment.subheading[this.props.locale] ||
                    segment.subheading[`${this.props.locale}-public`] //||
                    //segment.subheading['de'] ||
                    //segment.subheading['de-public'];
                //
                // if the table of content looks different in languages with different alphabets, have a look to the following and extend the regexp:
                // https://stackoverflow.com/questions/18471159/regular-expression-with-the-cyrillic-alphabet
                //
                // JavaScript (at least the versions most widely used) does not fully support Unicode.
                // That is to say, \w matches only Latin letters, decimal digits, and underscores ([a-zA-Z0-9_])
                //
                if (mainheading && /[\w\u0430-\u044f0-9]+/.test(mainheading) && mainheading !== lastMainheading) {
                    mainIndex += 1;
                    subIndex = 0;
                    lastMainheading = mainheading;
                    // TODO: segment should not be part of the headings object - we need it for editing, but there
                    // should be a leaner solution
                    headings.push({
                        segment: segment,
                        main: true,
                        chapter: mainIndex + '.',
                        heading: mainheading,
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        duration: this.props.interview.duration_seconds,
                        subheadings: []
                    });
                    if (headings.length > 1) {
                        if (index < this.props.interview.headings.length) {
                            // set previous heading's next_time attribute to this segment's time
                            if (headings[headings.length - 2].tape_nbr == segment.tape_nbr) {
                                headings[headings.length - 2].next_time = segment.time;
                            }
                        }
                        if (headings[headings.length - 2].subheadings.length > 0) {
                            // set previous subheading's next_time attribute to this segment's time
                            if (!headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time) {
                                if (headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].tape_nbr == segment.tape_nbr) {
                                    headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time = segment.time;
                                }
                            }
                        }
                    }
                }
                if (subheading && /[\w\u0430-\u044f0-9]+/.test(subheading)) {
                    subIndex += 1;
                    if (headings[mainIndex - 1]) {
                        headings[mainIndex - 1].subheadings.push({
                            main: false,
                            heading: subheading,
                            chapter: mainIndex + '.' + subIndex + '.',
                            time: segment.time,
                            tape_nbr: segment.tape_nbr,
                            duration: this.props.interview.duration_seconds
                        });
                        if (headings[mainIndex - 1].subheadings.length > 1) {
                            if (index < (this.props.interview.headings.length)) {
                                if (headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].tape_nbr == segment.tape_nbr) {
                                    headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].next_time = segment.time;
                                }
                            }
                        }
                    } else {
                        console.log(`segment ${segment.id} with locale ${this.props.locale} tries to add a subheading to headings with index ${mainIndex -1}`);
                        console.log(`There are ${headings.length} headings at this point`);
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
        } else if (this.props.interview && this.props.interview.headings) {
            let first = this.props.interview.headings[0];
            if (
                !first.mainheading[`${this.props.locale}-public`] &&
                !first.mainheading[this.props.locale] &&
                !first.subheading[`${this.props.locale}-public`] &&
                !first.subheading[this.props.locale]
            ) {
                return t(this.props, 'without_index_locale');
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
                <div>
                    {this.emptyHeadingsNote(headings)}
                    <div className={'content-index'}>
                        {headings.map((heading, index) => {
                            return <HeadingContainer
                                key={'mainheading-' + index}
                                data={heading}
                                nextHeading={headings[index+1]}
                            />
                        })}
                    </div>
                </div>
            );
        } else {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
    }
}
