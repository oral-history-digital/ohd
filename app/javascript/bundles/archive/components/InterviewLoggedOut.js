import React from 'react';
import PropTypes from 'prop-types';

export default function InterviewLoggedOut({
    project,
    interview,
    locale,
}) {
    return (
        <div>
            <div className="VideoPlayer">
                <header className="VideoHeader">
                    <h1 className="VideoHeader-title">
                        {project.fullname_on_landing_page ? interview.title[locale] : interview.anonymous_title[locale]}
                    </h1>
                </header>
                <div className="VideoElement">
                    <img src={interview.still_url} alt="Video preview" />
                </div>
            </div>
            <div
                className='wrapper-content'
                dangerouslySetInnerHTML={{__html: interview.landing_page_texts[locale]}}
            />
        </div>
    );
}

InterviewLoggedOut.propTypes = {
    project: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
