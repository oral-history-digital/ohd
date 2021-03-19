import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { t } from 'modules/i18n';
import formatTimecode from './formatTimecode';
import styles from './SubHeading.module.scss';

export default class SubHeading extends React.Component {
    constructor(props) {
        super(props);

        this.state = { active: false };
        this.handleClick = this.handleClick.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let endTime = (this.props.nextSubHeading) ? this.props.nextSubHeading.time : this.props.data.duration;
        let active = this.props.tape === this.props.data.tape_nbr && endTime >= nextProps.mediaTime && this.props.data.time <= nextProps.mediaTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    handleClick(tape, time) {
        // let tabIndex = (this.props.interview.lang === this.props.locale) ? 0 : 1;
        this.props.sendTimeChangeRequest(tape, time);
    }

    render() {
        const { locale, translations, data } = this.props;

        return (
            <div className={styles.container}>
                <div
                    className={classNames(styles.main, {
                        [styles.active]: this.state.active,
                    })}
                    onClick={() => this.handleClick(data.tape_nbr, data.time)}
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
            </div>
        )
    }
}

SubHeading.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    nextSubHeading: PropTypes.object.isRequired,
    tape: PropTypes.number.isRequired,
    mediaTime: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
