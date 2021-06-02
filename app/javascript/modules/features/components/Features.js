import { useSelector, useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getFeatures } from '../selectors';
import { enable, disable } from '../actions';

export default function Features() {
    const features = useSelector(getFeatures);
    const dispatch = useDispatch();
    const { t } = useI18n();

    return (
        <section>
            <h4>{t('modules.features.experimental_features')}</h4>

            <form>
                <ul className="Features">
                    {
                        features.map(([name, isEnabled]) => (
                            <li key={name}>
                                <label className="Features-label">
                                    <input
                                        name={name}
                                        type="checkbox"
                                        checked={isEnabled}
                                        aria-checked={isEnabled}
                                        onChange={() =>
                                            dispatch(isEnabled ? disable(name) : enable(name))
                                        }
                                    />
                                    {' '}
                                    {t(`modules.features.${name.replace(/-/g, '_')}`)}
                                </label>
                            </li>
                        ))
                    }
                </ul>
            </form>
        </section>
    );
}
