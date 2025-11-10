import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Account from 'startup/Account.js';
import OrderNewPassword from 'startup/OrderNewPassword.js';
import ActivateAccount from 'startup/ActivateAccount.js';
import UsersAdmin from 'startup/UsersAdmin.js';
import archiveStore from 'startup/archiveStore.js';


ReactOnRails.registerStore({ archiveStore });
ReactOnRails.register({
    Sidebar,
    Account,
    OrderNewPassword,
    ActivateAccount,
    UsersAdmin,
});



