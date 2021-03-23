import React from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import HeadingContainer from './HeadingContainer';

export default class TableOfContents extends React.Component {
    componentDidMount() {
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

    prepareHeadings() {
        let mainIndex = 0;
        let mainheading = '';
        let subIndex = 0;
        let subheading = '';
        let headings = [];
        let lastMainheading = '';

        if (this.props.interview?.headings) {
            Object.values(this.props.interview.headings).sort(function(a, b) {return a.tape_nbr - b.tape_nbr || a.time - b.time}).map((segment, index) => {
                mainheading = segment.mainheading[this.props.locale] ||
                    segment.mainheading[`${this.props.locale}-public`]
                subheading = segment.subheading[this.props.locale] ||
                    segment.subheading[`${this.props.locale}-public`]
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
                        duration: this.props.interview.duration,
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
                            segment: segment,
                            main: false,
                            heading: subheading,
                            chapter: mainIndex + '.' + subIndex + '.',
                            time: segment.time,
                            tape_nbr: segment.tape_nbr,
                            duration: this.props.interview.duration
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
        if (Object.values(this.props.interview.headings).length <= 0) {
            return t(this.props, 'without_index');
        } else if (headings.length <= 0) {
            return t(this.props, 'without_index_locale');
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
            return <Spinner />;
        }
    }
}

TableOfContents.propTypes = {
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    headingsStatus: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
