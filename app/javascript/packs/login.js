import { Application } from '@hotwired/stimulus';
import '@hotwired/turbo-rails';
import BackupCodeController from 'controllers/backup_code_controller';
import OtpController from 'controllers/otp_controller';

const application = Application.start();
application.register('otp', OtpController);
application.register('backup-code', BackupCodeController);
-1;
