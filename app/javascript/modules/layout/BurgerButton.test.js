import renderer from 'react-test-renderer';
import BurgerButton from './BurgerButton';

it('renders correctly in closed state', () => {
    const tree = renderer
        .create(<BurgerButton onClick={() => {}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly in open state', () => {
    const tree = renderer
        .create(<BurgerButton open onClick={() => {}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
