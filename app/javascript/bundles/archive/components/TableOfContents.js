import React from 'react';
import HeadingContainer from '../containers/HeadingContainer';

export default class TableOfContents extends React.Component {

    prepareHeadings() {
        let mainIndex = 0;
        let mainheading = '';
        let subIndex = 0;
        let subheading = '';
        let headings = [];

        if(this.props.interview && this.props.interview.headings) {
            this.props.interview.headings.map( (segment, index) => {

                if (!segment.subheading[this.props.locale] || segment.subheading[this.props.locale] === '') {
                    mainIndex += 1;
                    subIndex = 0;
                    mainheading = mainIndex + '. ' + segment.mainheading[this.props.locale]
                    headings.push({main: true, heading: mainheading, time: segment.time, subheadings: []});
                }
                if (segment.subheading[this.props.locale] && segment.subheading[this.props.locale] !== '') {
                    subIndex += 1;
                    subheading = mainIndex + '.' + subIndex + '. ' + segment.subheading[this.props.locale];
                    headings[mainIndex - 1].subheadings.push({main: false, heading: subheading, time: segment.time});
                }
            })
        }

        return headings;
    }

    emptyHeadingsNote(headings) {
        if(headings.length <= 0)
            return "Keine Überschriften für diese Sprache"
    }

    render () {
        let headings = this.prepareHeadings();
        return ( 
            <div className={'content-index'}>
                {this.emptyHeadingsNote(headings)}
                {headings.map( (heading, index) => {
                    return <HeadingContainer 
                                key={'mainheading-' + index}
                                data={heading}
                            />
                })}
            </div>
        );
    }
}

