class TestPages::RegistrationPage < TestPages::ApplicationPage
  def path
    '/login'
  end

  def fill_in_all_required_fields
    select 'Frau', :from => 'Anrede*'
    fill_in 'Vorname*', :with => 'Petra'
    fill_in 'Nachname*', :with => 'Polder'
    fill_in 'E-Mail*', :with => 'petra.polder@polli.de'
    select 'Bildungsarbeit', :from => 'Recherche-Anliegen*'
    fill_in 'Präzisierung des Anliegens*', :with => 'Viel Testen, damit es auch mit dem IE klappt.'
    fill_in 'Straße*', :with => 'Pickenweg 9'
    fill_in 'PLZ*', :with => '66739'
    fill_in 'Ort*', :with => 'Pullach'
    select 'Deutschland', :from => 'Land*'
    check 'Nutzungsbedingungen*'
    check 'Datenschutzbestimmungen*'
  end

  def send_registration_button
    'Registrierung senden'
  end
end
