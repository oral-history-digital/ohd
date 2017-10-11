import React from 'react';

import WrapperPage from '../components/WrapperPage';
import InterviewPreview from '../components/InterviewPreview';

export default class ArchiveSearch extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(event){
        let page = ($(event.target).data().page);
        let query = this.props.searchQuery;
        query['page'] = page;
        this.props.searchInArchive(this.props.url, query);
    }


    renderPaginationTabs() {
        if (this.props.resultPagesCount > 1) {

            let resultPages = []
            for (let i = 1; i <= this.props.resultPagesCount; i++){
                resultPages.push(i);
            }

            return resultPages.map((page, index) => {
                return (
                    <button
                        className='pagination-button'
                        data-page={page}
                        key={"page-" + index}
                        onClick={this.handleClick}>
                        {page}
                    </button>
                )
            })
        }
    }


    render() {
        return (
            <WrapperPage
                tabIndex={2}
            >
                <div className='pagination'>
                    {this.renderPaginationTabs()}
                </div>
                <div className='interviews wrapper-content'>
                    <h1 className='search-results-title'>Suchergebnisse</h1>
                    {this.props.foundInterviews.map((interview, index) => {
                        let foundSegmentsForInterview = this.props.foundSegmentsForInterviews[interview.archive_id] !== undefined ? this.props.foundSegmentsForInterviews[interview.archive_id] : [];
                        return <InterviewPreview
                            interview={interview}
                            key={"interview-" + interview.id}
                            locale={this.props.match.params.locale}
                            foundSegmentsForInterview={foundSegmentsForInterview}
                        />;
                    })}
                </div>
                <div className='pagination'>
                    {this.renderPaginationTabs()}
                </div>
            </WrapperPage>
        )
    }
}

