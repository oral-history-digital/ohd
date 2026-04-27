import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import { OHD_DOMAINS } from 'modules/constants';
import { Link } from 'react-router-dom';

import { Logo } from './Logo';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de' }),
}));

describe('<Logo />', () => {
    it('uses anchor with absolute OHD URL when on a different domain', () => {
        Object.defineProperty(window, 'location', {
            value: {
                origin: 'http://localhost:3000',
            },
            writable: true,
        });

        const wrapper = shallow(<Logo />);

        expect(wrapper.find('a').prop('href')).toBe(`${OHD_DOMAINS.test}/de`);
        expect(wrapper.find(Link)).toHaveLength(0);
    });

    it('uses Link without reload when already on OHD domain', () => {
        Object.defineProperty(window, 'location', {
            value: {
                origin: OHD_DOMAINS.test,
            },
            writable: true,
        });

        const wrapper = shallow(<Logo />);

        expect(wrapper.find(Link).prop('to')).toBe('/de');
        expect(wrapper.find('a')).toHaveLength(0);
    });

    it('renders configured title and alt text', () => {
        const wrapper = shallow(<Logo title="Custom OHD" logoSrc="/x.svg" />);

        expect(wrapper.find('.Breadcrumbs-logoLink').prop('title')).toBe(
            'Custom OHD'
        );
        expect(wrapper.find('img').prop('src')).toBe('/x.svg');
        expect(wrapper.find('img').prop('alt')).toBe('Custom OHD logo');
    });
});
