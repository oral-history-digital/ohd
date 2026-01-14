import { Application } from '@hotwired/stimulus';
import '@hotwired/turbo-rails';
import OtpController from 'controllers/otp_controller';
import PasskeyController from 'controllers/passkey_controller';

const application = Application.start();
application.register('otp', OtpController);
application.register('passkey', PasskeyController);
