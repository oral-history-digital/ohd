import React from 'react';
import HeadingContainer from '../containers/HeadingContainer';

export default class TableOfContents extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 0);
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

        if(this.props.interview && this.props.interview.headings) {
            this.props.interview.headings.map( (segment, index) => {

                //if (!segment.subheading[this.props.locale] || segment.subheading[this.props.locale] === '') {
                if (segment.mainheading[this.props.locale] && segment.mainheading[this.props.locale] !== '' && segment.mainheading[this.props.locale] !== lastMainheading ) {
                    mainIndex += 1;
                    subIndex = 0;
                    lastMainheading = segment.mainheading[this.props.locale];
                    mainheading = mainIndex + '. ' + segment.mainheading[this.props.locale]
                    headings.push({main: true, heading: mainheading, time: segment.time, tape_nbr: segment.tape_nbr, subheadings: []});
                }
                if (segment.subheading[this.props.locale] && segment.subheading[this.props.locale] !== '') {
                    subIndex += 1;
                    subheading = mainIndex + '.' + subIndex + '. ' + segment.subheading[this.props.locale];
                    headings[mainIndex - 1].subheadings.push({main: false, heading: subheading, time: segment.time, tape_nbr: segment.tape_nbr});
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

