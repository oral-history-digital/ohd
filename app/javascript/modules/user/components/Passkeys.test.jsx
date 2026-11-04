import { fireEvent, render, screen } from '@testing-library/react';
import { deleteData } from 'modules/data';
import { usePathBase } from 'modules/routes';

import Passkeys from './Passkeys';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/data', () => ({
    deleteData: jest.fn(() => ({ type: 'DELETE' })),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));

test.each(['/adg/de', '/en'])(
    'passkey deletion uses %s and tolerates an account disappearing after logout',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const { rerender } = render(
            <Passkeys
                user={{ webauthn_credentials: [{ id: 7, nickname: 'Key' }] }}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: 'Delete Passkey' }));
        expect(deleteData).toHaveBeenLastCalledWith(
            { pathBase },
            'passkeys',
            7
        );
        rerender(<Passkeys user={{}} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        rerender(<Passkeys />);
        expect(screen.queryByText('Passkeys')).not.toBeInTheDocument();
    }
);
