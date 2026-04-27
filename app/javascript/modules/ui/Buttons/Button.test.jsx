import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';

import Button from './Button';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
}));

describe('<Button />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders an anchor when href is provided', () => {
        const wrapper = shallow(
            <Button buttonText="Open archive" href="https://example.org" />
        );

        expect(wrapper.find('a')).toHaveLength(1);
        expect(wrapper.find('a').prop('href')).toBe('https://example.org');
        expect(wrapper.find('button')).toHaveLength(0);
    });

    it('sets secure rel for target=_blank by default', () => {
        const wrapper = shallow(
            <Button
                buttonText="Open archive"
                href="https://example.org"
                target="_blank"
            />
        );

        expect(wrapper.find('a').prop('rel')).toBe('noopener noreferrer');
    });

    it('prevents click behavior when link is disabled', () => {
        const onClick = jest.fn();
        const preventDefault = jest.fn();
        const wrapper = shallow(
            <Button
                buttonText="Open archive"
                href="https://example.org"
                onClick={onClick}
                isDisabled
            />
        );

        wrapper.find('a').simulate('click', { preventDefault });

        expect(preventDefault).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
    });
});
