import { useSelector } from 'react-redux';

import { getRegistrationStatus } from '../selectors';
import ChangePasswordFormContainer from './ChangePasswordFormContainer';

export default function ActivateAccount() {
    const registrationStatus = useSelector(getRegistrationStatus);

    return (
        <div className='wrapper-content register'>
            {
                registrationStatus ?
                    <div className='errors'>{registrationStatus}</div> :
                    <ChangePasswordFormContainer />
            }
        </div>
    );
}
