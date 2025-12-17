import { Application } from '@hotwired/stimulus';
import OtpController from 'controllers/otp_controller';

const application = Application.start();
application.register('otp', OtpController);
