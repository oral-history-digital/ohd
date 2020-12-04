import React from 'react';
import PropTypes from 'prop-types';

import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import AuthorizedContent from './AuthorizedContent';
import { t } from 'lib/utils';

export default class Annotation extends React.Component {
    edit() {
        const tProps = { locale: this.props.currentLocale, translations: this.props.translations };

        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(tProps, 'edit.annotation.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(tProps, 'edit.annotation.edit'),
                    content: <AnnotationFormContainer
                                 annotation={this.props.annotation}
                                 segment={this.props.segment}
                                 locale={this.props.locale}
                             />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'annotations', this.props.annotation.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        const tProps = { locale: this.props.currentLocale, translations: this.props.translations };

        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(tProps, 'edit.annotation.delete')}
            onClick={() => this.props.openArchivePopup({
                title: t(tProps, 'edit.annotation.delete'),
                content: (
                    <div>
                        <p dangerouslySetInnerHTML={{__html: this.props.annotation.text[this.props.locale]}} />
                        <div
                            className='any-button'
                            onClick={() => this.destroy()}
                        >
                            {t(tProps, 'edit.annotation.delete')}
                        </div>
                    </div>
                )
            })}
        >
            <i className="fa fa-trash-o"></i>
        </div>
    }

    render() {
        const { annotation } = this.props;

        return (
            <div>
                <p
                    className='content-trans-text-element-data'
                    dangerouslySetInnerHTML={{__html: annotation.text[this.props.locale]}}
                />
                <AuthorizedContent object={annotation}>
                    <span className={'flyout-sub-tabs-content-ico'}>
                        {this.edit()}
                        {this.delete()}
                    </span>
                </AuthorizedContent>
            </div>
        )
    }
}

Annotation.propTypes = {
    annotation: PropTypes.object.isRequired,
    segment: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    deleteData: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
