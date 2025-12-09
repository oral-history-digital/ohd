import { useI18n } from 'modules/i18n';
import { Checkbox } from 'modules/ui';
import { useDispatch, useSelector } from 'react-redux';

import { disable, enable } from '../actions';
import { getFeatures } from '../selectors';

export default function Features() {
    const features = useSelector(getFeatures);
    const dispatch = useDispatch();
    const { t } = useI18n();

    if (features.length === 0) {
        return null;
    }

    return (
        <section>
            <h4>{t('modules.features.experimental_features')}</h4>

            <form>
                <ul className="Features">
                    {features.map(([name, isEnabled]) => (
                        <li key={name}>
                            <label className="Features-label">
                                <Checkbox
                                    name={name}
                                    checked={isEnabled}
                                    onChange={() =>
                                        dispatch(
                                            isEnabled
                                                ? disable(name)
                                                : enable(name)
                                        )
                                    }
                                />{' '}
                                {t(
                                    `modules.features.${name.replace(/-/g, '_')}`
                                )}
                            </label>
                        </li>
                    ))}
                </ul>
            </form>
        </section>
    );
}
