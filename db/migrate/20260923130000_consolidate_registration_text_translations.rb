class ConsolidateRegistrationTextTranslations < ActiveRecord::Migration[8.0]
  TEXT_PARTS = {
    'user.registration_text_umbrella' => [
      'user.registration_text_one_ohd',
      '%{conditions_link}',
      'user.registration_text_two',
      '%{privacy_link}',
      'user.registration_text_three',
      'user.registration_text_four'
    ],
    'user.registration_text_project' => [
      'user.registration_text_one',
      '%{conditions_link}',
      'user.registration_text_two',
      '%{privacy_link}',
      'user.registration_text_three'
    ]
  }.freeze

  LEGACY_TRANSLATIONS = {
    'user.registration_text_one' => {
      'ar' => 'يُرجى التسجيل للوصول إلى المقابلات. تشرح ',
      'de' => 'Bitte registrieren Sie sich, um auf die Interviews zugreifen zu können. Die ',
      'el' => 'Παρακαλούμε εγγραφείτε για να αποκτήσετε πρόσβαση στις συνεντεύξεις. Οι ',
      'en' => 'Please register to access the interviews. The ',
      'es' => 'Por favor, regístrese para poder acceder las entrevistas. Los ',
      'ru' => 'Пожалуйста, зарегистрируйтесь для получения доступа к интервью.',
      'tr' => 'Lütfen görüşmelere erişebilmek için kaydolun.',
      'uk' => "Будь ласка, зареєструйтеся, щоб отримати доступ до інтерв'ю."
    },
    'user.registration_text_one_ohd' => {
      'de' => 'Bitte registrieren Sie sich, um die Plattform nutzen zu können. Die ',
      'el' => 'Παρακαλούμε εγγραφείτε για να μπορέσετε να χρησιμοποιήσετε την πλατφόρμα. Οι ',
      'en' => 'Please register to use the platform. The ',
      'es' => 'Por favor, regístrese para poder utilizar la plataforma. Los ',
      'ru' => 'Пожалуйста, зарегистрируйтесь для получения доступа к платформе. '
    },
    'user.registration_text_two' => {
      'ar' => 'لمن ولأي أغراض يمكن استخدام %{umbrella_project_name}. تشرح',
      'de' => ' erklären, für wen und für welche Zwecke %{umbrella_project_name} nutzbar ist. Die ',
      'el' => 'εξηγούν από ποιον και για ποιους σκοπούς μπορεί να χρησιμοποιηθεί το %{umbrella_project_name}. Οι ',
      'en' => ' explain who can use %{umbrella_project_name} and for what purposes. The ',
      'es' => ' explican para quien y con que fines puede utilizarse %{umbrella_project_name}. La ',
      'ru' => ' содержат пояснение, кто и с какой целью может использовать %{umbrella_project_name}. ',
      'tr' => "%{umbrella_project_name}'in kimler için ve hangi amaçlarla kullanılabileceğini açıklamak.",
      'uk' => 'пояснюють, для кого і для яких цілей можна використовувати %{umbrella_project_name}.'
    },
    'user.registration_text_three' => {
      'ar' => 'سبب معالجتنا للبيانات والغرض الذي نستخدمها من أجله. لأسباب تتعلق بحماية البيانات، سيُطلب منك تأكيد تسجيلك عن طريق البريد الإلكتروني. ',
      'de' => ' erläutert, warum wir welche Daten verarbeiten und wofür wir sie nutzen. Aus Datenschutzgründen werden Sie per E-Mail gebeten Ihre Registrierung zu bestätigen. ',
      'el' => ' αναλύουν, για ποιους λόγους επεξεργαζόμαστε τα δεδομένα σας, και για ποιο σκοπό τα αξιοποιούμε. Για λόγους προστασίας δεδομένων, θα σας ζητηθεί να επιβεβαιώσετε την εγγραφή σας μέσω e-mail. ',
      'en' => ' explains why we process which data and what we use it for. For privacy reasons, you will be asked to confirm your registration by email. ',
      'es' => ' explica porque procesamos cuales datos y para que los utilizamos. Por motivos de protección de datos, se le pedirá que confirme su registro por correo electrónico. ',
      'ru' => ' поясняет, почему мы запрашиваем некоторые данные и для чего их используем. В целях защиты информации Вы получите электронное письмо с просьбой подтвердить Вашу регистрацию. ',
      'tr' => 'Hangi verileri işlediğimizi ve bunları ne için kullandığımızı açıklıyor. Gizlilik nedenleriyle, kaydınızı onaylamanız için size e-posta ile ulaşılacaktır.',
      'uk' => 'Пояснення, чому і які дані ми обробляємо і для чого їх використовуємо. З міркувань конфіденційності Вам буде запропоновано підтвердити реєстрацію електронною поштою.'
    },
    'user.registration_text_four' => {
      'de' => 'Danach können Sie die Freischaltung für verschiedene in der Plattform enthaltene Interview-Archive beantragen.',
      'el' => 'Στη συνέχεια, μπορείτε να ζητήσετε την ενεργοποίηση των διάφορων αρχείων μαρτυριών που περιλαμβάνονται στην πλατφόρμα.',
      'en' => 'You can then request activation for various interview archives included in the platform.',
      'es' => 'Después, podrá solicitar el acceso para varios archivos de entrevistas incluidos en la plataforma.',
      'ru' => 'После этого Вы сможете подать запрос на активацию допуска к различным архивам интервью, размещенным на платформе.'
    }
  }.freeze

  SOURCE_KEYS = LEGACY_TRANSLATIONS.keys.freeze

  def up
    # Add interpolated translation strings
    source_values = SOURCE_KEYS.index_with { |key| TranslationValue.find_by(key: key) }
    return if source_values.values.any?(&:nil?)

    TEXT_PARTS.each do |target_key, parts|
      locales = source_values.values.first.translations.pluck(:locale)
      target_value = TranslationValue.find_or_create_by!(key: target_key)

      locales.each do |locale|
        text = parts.map do |part|
          if source_values.key?(part)
            source_values.fetch(part).translations.find_by(locale: locale)&.value
          else
            part
          end
        end
        next if text.any?(&:nil?)

        target_value.translations.find_or_initialize_by(locale: locale).update!(value: text.map(&:strip).join(' '))
      end
    end

    # Delete legacy translations
    TranslationValue.where(key: SOURCE_KEYS).destroy_all
  end

  def down
    # Delete added translations
    TranslationValue.where(key: TEXT_PARTS.keys).destroy_all

    # Restore legacy translations
    LEGACY_TRANSLATIONS.each do |key, translations|
      TranslationValue.create_or_update_for_key(key, translations)
    end
  end
end
