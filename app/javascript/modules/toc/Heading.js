import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import SubHeadingContainer from './SubHeadingContainer';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import formatTimecode from './formatTimecode';
import styles from './Heading.module.scss';

export default class Heading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            active: false
        }

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let endTime = (this.props.nextHeading) ? this.props.nextHeading.time : this.props.data.duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime > nextProps.mediaTime && this.props.data.time <= nextProps.mediaTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    toggle() {
        if (this.props.data.main) {
            this.setState(prevState => ({
                expanded: !prevState.expanded
            }));
        }
    }

    handleClick() {
        const { data, sendTimeChangeRequest } = this.props;

        sendTimeChangeRequest(data.tape_nbr, data.time);
    }

    subHeadings() {
        if (this.props.data.main) {
            return (
                <div className={classNames(styles.subHeadings, {
                    [styles.subHeadingsCollapsed]: !this.state.expanded,
                })}>
                    {this.props.data.subheadings.map((heading, index) => (
                        <div key={index}>
                            <SubHeadingContainer
                                data={heading}
                                nextSubHeading={this.props.data.subheadings[index+1] || this.props.nextHeading}
                            />
                            {this.editHeading(heading.segment)}
                        </div>
                    ))}
                </div>
            );
        }
    }

    expandable() {
        const { data } = this.props;
        const { expanded } = this.state;

        if (data.subheadings.length === 0) {
            return null;
        } else {
            return (
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={this.toggle}
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                    {
                        expanded ?
                            <FaMinus /> :
                            <FaPlus />
                    }
                </button>
            );
        }
    }

    editHeading(segment) {
        return (
            <AuthorizedContent object={segment}>
                <Modal
                    title=""
                    trigger={<i className="fa fa-pencil" />}
                >
                    {closeModal => (
                        <SegmentHeadingFormContainer
                            segment={segment}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        );
    }

    render() {
        const { locale, translations, data } = this.props;

        return (
            <>
                <div className={styles.container}>
                    {this.expandable()}

                    <div
                        className={classNames(styles.main, {
                            [styles.active]: this.state.active,
                        })}
                        onClick={this.handleClick}
                    >
                        <span className={styles.chapter}>
                            {data.chapter}
                        </span>

                        <div>
                            <div className={styles.heading}>
                                {data.heading}
                            </div>

                            <div className={styles.timecode}>
                            {t({locale, translations}, 'tape')} {data.tape_nbr} | {formatTimecode(data.time)}
                            </div>
                        </div>
                    </div>

                    {this.editHeading(data.segment)}
                </div>

                {this.subHeadings()}
            </>
        )
    }
}

Heading.propTypes = {
    data: PropTypes.object.isRequired,
    nextHeading: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    tape: PropTypes.number.isRequired,
    mediaTime: PropTypes.number.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
