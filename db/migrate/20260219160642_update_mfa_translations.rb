class UpdateMfaTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('user.mfa_login_info', {
      en: 'In addition to your password, you can use multi-factor authentication (MFA) to protect your account from unauthorised access. You can do this using one of the following two methods:',
      de: 'Mit einer Multifaktor-Authentifizierung (MFA) können Sie Ihr Konto - zusätzlich zu Ihrem Passwort - vor unbefugtem Zugriff schützen. Nutzen Sie dafür eine der beiden folgenden Methoden:',
      uk: 'Окрім пароля, ви можете використовувати багатофакторну автентифікацію (MFA) для захисту свого облікового запису від несанкціонованого доступу. Ви можете зробити це, використовуючи один із двох наступних методів:',
      ru: 'В дополнение к паролю вы можете использовать многофакторную аутентификацию (MFA) для защиты своей учетной записи от несанкционированного доступа. Для этого можно воспользоваться одним из двух следующих методов:',
      es: 'Además de su contraseña, puede utilizar la autenticación multifactor (MFA) para proteger su cuenta contra accesos no autorizados. Para ello, puede utilizar uno de los dos métodos siguientes:',
      el: 'Εκτός από τον κωδικό πρόσβασής σας, μπορείτε να χρησιμοποιήσετε την πολυπαραγοντική επαλήθευση ταυτότητας (MFA) για να προστατεύσετε τον λογαριασμό σας από μη εξουσιοδοτημένη πρόσβαση. Μπορείτε να το κάνετε αυτό χρησιμοποιώντας μία από τις δύο ακόλουθες μεθόδους:',
      ar: 'بالإضافة إلى كلمة المرور الخاصة بك، يمكنك استخدام المصادقة متعددة العوامل (MFA) لحماية حسابك من الوصول غير المصرح به. يمكنك القيام بذلك باستخدام إحدى الطريقتين التاليتين:'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.otp_required_for_login", {
      en: 'Enable/disable authentication app (optional).',
      de: 'Authentifizierungs-App aktivieren/deaktivieren (optional).',
      uk: 'Увімкнути/вимкнути додаток для автентифікації (опціонально).',
      ru: 'Включить/отключить приложение аутентификации (опционально).',
      es: 'Activar/desactivar la aplicación de autenticación (opcional).',
      el: 'Ενεργοποίηση/απενεργοποίηση εφαρμογής ελέγχου ταυτότητας (προαιρετικό).',
      ar: 'تمكين/تعطيل تطبيق المصادقة (اختياري).'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.passkey_required_for_login", {
      en: 'Enable/disable Passkey on your device (optional).',
      de: 'Passkey auf Ihrem Gerät aktivieren/deaktivieren (optional).',
      uk: 'Увімкнути/вимкнути Passkey на вашому пристрої (опціонально).',
      ru: 'Включение/выключение Passkey на вашем устройстве (опционально).',
      es: 'Activar/desactivar llave de acceso en su dispositivo (opcional).',
      el: 'Ενεργοποίηση/απενεργοποίηση του Passkey στη συσκευή σας (προαιρετικό).',
      ar: 'قم بتمكين/تعطيل Passkey على جهازك (اختياري).'
    })
    TranslationValue.create_or_update_for_key("after_enable_2fa.title", {
      en: "MFA QR Code",
      de: "MFA QR Code",
      uk: "MFA QR-код",
      ru: "MFA QR-код",
      es: "Código QR MFA",
      el: "Κωδικός QR MFA",
      ar: "رمز الاستجابة السريعة MFA"
    })
    TranslationValue.create_or_update_for_key("after_enable_2fa.text", {
      en: "Scan this QR code with your authentication app (2FAS, Authy, Google Authenticator, etc.).",
      de: "Scannen Sie diesen QR Code mit Ihrer Authentifizierungs-App (2FAS, Authy, Google Authenticator, ...).",
      uk: "Відскануйте цей QR-код за допомогою вашого додатка для аутентифікації (2FAS, Authy, Google Authenticator тощо).",
      ru: "Отсканируйте этот QR-код с помощью вашего приложения для аутентификации (2FAS, Authy, Google Authenticator и т. д.).",
      es: "Escanee este código QR con su aplicación de autenticación (2FAS, Authy, Google Authenticator, …).",
      el: "Σαρώστε αυτόν τον κωδικό QR με την εφαρμογή πιστοποίησης σαςΣαρώστε αυτόν τον κωδικό QR με την εφαρμογή πιστοποίησης (2FAS, Authy, Google Authenticator, ...)..",
      ar: "امسح هذا الرمز QR باستخدام تطبيق المصادقة الخاص بك."
    })
    TranslationValue.create_or_update_for_key(:no_passkeys_found, {
      en: 'No passkey was found for this email address. Once you have logged in, you can set up multi-factor authentication in your account.',
      de: 'Für diese E-Mail wurde kein Passkey gefunden. Nach Anmeldung können Sie in Ihrem Konto eine Multifaktor-Authentifizierung einrichten.',
      uk: 'Для цієї адреси електронної пошти не знайдено пароль. Після входу в систему ви можете налаштувати багатофакторну автентифікацію у своєму обліковому записі.',
      ru: 'Ключ доступа для этого адреса электронной почты не найден. После входа в систему вы можете настроить многофакторную аутентификацию в своей учетной записи.',
      es: 'No se ha encontrado ningun llave de acceso para esta dirección de correo electrónico. Una vez que haya iniciado sesión, podrá configurar la autenticación multifactor en su cuenta.',
      el: 'Δεν βρέθηκε κωδικός πρόσβασης για αυτή τη διεύθυνση email. Αφού συνδεθείτε, μπορείτε να ρυθμίσετε την πολυπαραγοντική επαλήθευση ταυτότητας στον λογαριασμό σας.',
      ar: 'لم يتم العثور على مفتاح مرور لهذا العنوان البريدي الإلكتروني. بمجرد تسجيل الدخول، يمكنك إعداد المصادقة متعددة العوامل في حسابك.'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.otp_attempt", {
      en: "One-time code",
      de: "Einmal-Code",
      uk: "Одноразовий код",
      ru: "Одноразовый код",
      es: "Código de un solo uso",
      el: "Μοναδικός κωδικός",
      ar: "رمز لمرة واحدة"
    })
    TranslationValue.create_or_update_for_key(:send_otp_per_mail, {
      en: 'Send one-time code by email.',
      de: 'Einmal-Code per E-Mail senden.',
      uk: 'Надіслати одноразовий код електронною поштою.',
      ru: 'Отправить одноразовый код по электронной почте.',
      es: 'Enviar código de un solo uso por correo electrónico.',
      el: 'Αποστολή κωδικού μίας χρήσης μέσω email.',
      ar: 'إرسال رمز لمرة واحدة عبر البريد الإلكتروني.'
    })
    TranslationValue.create_or_update_for_key(:sent_otp_per_mail, {
      en: 'An one-time code has been sent to your email address.',
      de: 'Ein Einmal-Code wurde an Ihre E-Mail-Adresse gesendet.',
      uk: 'Одноразовий код був надісланий на вашу електронну адресу.',
      ru: 'Одноразовый код был отправлен на ваш адрес электронной почты.',
      es: 'Se ha enviado un código de un solo uso a su dirección de correo electrónico.',
      el: 'Ένας κωδικός μίας χρήσης έχει σταλεί στη διεύθυνση ηλεκτρονικού ταχυδρομείου σας.',
      ar: 'تم إرسال رمز لمرة واحدة إلى عنوان بريدك الإلكتروني.'
    })
    TranslationValue.create_or_update_for_key('devise.failure.invalid_otp', {
      en: 'You have entered an incorrect or expired one-time code. Please go back to the login screen and enter a valid 6-digit code.',
      de: 'Sie haben einen fehlerhaften oder abgelaufenen Einmal-Code eingegeben. Bitte kehren Sie zum Anmeldefenster zurück und geben Sie einen aktuellen 6-stelligen Code ein.',
      uk: 'Ви ввели неправильний або прострочений одноразовий код. Поверніться до екрана входу та введіть дійсний 6-значний код.',
      ru: 'Вы ввели неверный или просроченный одноразовый код. Вернитесь на экран входа в систему и введите действительный 6-значный код.',
      es: 'Ha introducido un código de un solo uso incorrecto o caducado. Vuelva a la pantalla de inicio de sesión e introduzca un código válido de seis dígitos.',
      el: 'Έχετε εισαγάγει έναν λανθασμένο ή λήξαντα κωδικό μίας χρήσης. Επιστρέψτε στην οθόνη σύνδεσης και εισαγάγετε έναν έγκυρο 6ψήφιο κωδικό.',
      ar: 'لقد أدخلت رمزًا غير صحيح أو منتهي الصلاحية. يرجى العودة إلى شاشة تسجيل الدخول وإدخال رمز صالح مكون من 6 أرقام.'
    })
    TranslationValue.create_or_update_for_key('passkey.explanation', {
      en: 'Set up a passkey for each device if necessary.',
      de: 'Richten Sie bei Bedarf pro Gerät einen Passkey ein.',
      uk: 'При необхідності налаштуйте пароль для кожного пристрою.',
      ru: 'При необходимости настройте пароль для каждого устройства.',
      es: 'Configure un llave de acceso para cada dispositivo si es necesario.',
      el: 'Ρυθμίστε ένα κωδικό πρόσβασης για κάθε συσκευή, εάν είναι απαραίτητο.',
      ar: 'قم بإعداد مفتاح مرور لكل جهاز إذا لزم الأمر.'
    })
    TranslationValue.create_or_update_for_key('devise.failure.locked', {
      en: 'For security reasons, your account is locked after multiple failed attempts. Please try again in 30 minutes. If the problems persist, please contact us for help.',
      de: 'Ihr Konto wurde nach mehreren ungültigen Anmeldeversuchen temporär gesperrt. Bitte versuchen Sie es in 30 Minuten erneut. Falls die Probleme bestehen bleiben, kontaktieren Sie uns bitte.',
      uk: 'З міркувань безпеки ваш обліковий запис заблоковано після декількох невдалих спроб. Спробуйте знову через 30 хвилин. Якщо проблема не вирішиться, зверніться до нас за допомогою.',
      ru: 'Из соображений безопасности ваша учетная запись заблокирована после нескольких неудачных попыток входа. Повторите попытку через 30 минут. Если проблема не устранена, обратитесь к нам за помощью.',
      es: 'Por motivos de seguridad, su cuenta ha sido bloqueada temporalmente tras varios intentos de acceso no válidos. Vuelva a intentarlo dentro de 30 minutos. Si el problema persiste, póngase en contacto con nosotros.',
      el: 'Για λόγους ασφαλείας, ο λογαριασμός σας κλειδώνεται μετά από πολλές αποτυχημένες προσπάθειες. Παρακαλώ δοκιμάστε ξανά σε 30 λεπτά. Εάν το πρόβλημα παραμένει, παρακαλώ επικοινωνήστε μαζί μας για βοήθεια.',
      ar: 'لأسباب أمنية، تم قفل حسابك بعد عدة محاولات فاشلة. يرجى المحاولة مرة أخرى بعد 30 دقيقة. إذا استمرت المشكلة، يرجى الاتصال بنا للحصول على المساعدة.'
    })
  end

  def down
    TranslationValue.where(key: 'user.mfa_login_info').destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.otp_required_for_login").destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.passkey_required_for_login").destroy_all
    TranslationValue.where(key: "after_enable_2fa.title").destroy_all
    TranslationValue.where(key: "after_enable_2fa.text").destroy_all
    TranslationValue.where(key: :no_passkeys_found).destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.otp_attempt").destroy_all
    TranslationValue.where(key: :send_otp_per_mail).destroy_all
    TranslationValue.where(key: :sent_otp_per_mail).destroy_all
    TranslationValue.where(key: 'devise.failure.invalid_otp').destroy_all
    TranslationValue.where(key: 'passkey.explanation').destroy_all
    TranslationValue.where(key: 'devise.failure.locked').destroy_all
  end
end

