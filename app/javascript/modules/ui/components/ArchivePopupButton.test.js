import renderer from 'react-test-renderer';

import ArchivePopupButton from './ArchivePopupButton';

const mockedState = {
    data: {
        accounts: {
            current: {
                admin: true
            }
        }
    }
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockImplementation(() => mockedState)
  }));

it('renders correctly', () => {
    const tree = renderer
        .create(
            <ArchivePopupButton
                title='Bearbeiten'
                buttonFaKey='pencil'
            >
                {'Klaus'}
            </ArchivePopupButton>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

