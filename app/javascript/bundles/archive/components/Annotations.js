import React from 'react';
import PropTypes from 'prop-types';

import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import AnnotationContainer from '../containers/AnnotationContainer';
import AuthorizedContent from './AuthorizedContent';
import { t } from 'lib/utils';

export default class Annotations extends React.Component {
    annotations() {
        return Object.values(this.props.segment.annotations)
            .filter(annotation => annotation.text.hasOwnProperty(this.props.locale))
            .map(annotation => (
                <AnnotationContainer
                    annotation={annotation}
                    segment={this.props.segment}
                    key={annotation.id}
                    locale={this.props.locale}
                />
            ));
    }

    addAnnotation() {
        const tProps = { locale: this.props.currentLocale, translations: this.props.translations };

        return (
            <AuthorizedContent object={{type: 'Annotation', action: 'create', interview_id: this.props.segment.interview_id}}>
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(tProps, 'edit.annotation.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(tProps, 'edit.annotation.new'),
                        content: <AnnotationFormContainer
                                     segment={this.props.segment}
                                     locale={this.props.locale}
                                 />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            </AuthorizedContent>
        );
    }

    render() {
        return (
            <div>
                {this.annotations()}
                {this.addAnnotation()}
            </div>
        )
    }
}

Annotations.propTypes = {
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    currentLocale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
};
