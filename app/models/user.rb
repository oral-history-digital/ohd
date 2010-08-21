class User < ActiveRecord::Base

  attr_protected :admin

  define_registration_fields [
            { :name => 'appellation',
              :values => [  'Frau',
                            'Herr',
                            'Frau Dr.',
                            'Herr Dr.',
                            'Frau PD Dr.',
                            'Herr PD Dr.',
                            'Frau Prof.',
                            'Herr Prof.' ] },
            'first_name',
            'last_name',
            'email',
            { :name => 'job_description',
              :values => [  'Dozentin/Dozent',
                            'Filmemacherin/Filmemacher',
                            'Journalistin/Journalist',
                            'Lehrerin/Lehrer',
                            'Mitarbeiterin/Mitarbeiter (Museen/Gedenkstätten)',
                            'Schülerin/Schüler',
                            'Studentin/Student',
                            'Sonstiges'],
              :mandatory => false },
            { :name => 'research_intentions',
              :values => [ 'Ausstellung',
                           'Bildungsarbeit',
                           'Dissertation',
                           'Dokumentarfilm',
                           'Familienforschung',
                           'Kunstprojekt',
                           'Persönliches Interesse',
                           'Schulprojekt/Referat',
                           'Universitäre Lehre',
                           'Wissenschaftliche Publikation',
                           'Pressepublikation',
                           'Sonstiges' ] },
            { :name => 'comments',
              :type => :text },
            'organization',
            { :name => 'homepage',
              :mandatory => false },
            'street',
            'zipcode',
            'city',
            { :name => 'state',
              :mandatory => false,
              :values => [  'Bayern',
                            'Baden-Württemberg',
                            'Saarland',
                            'Hessen',
                            'Rheinland-Pfalz',
                            'Nordrhein-Westfalen',
                            'Niedersachsen',
                            'Thüringen',
                            'Sachsen-Anhalt',
                            'Sachsen',
                            'Brandenburg',
                            'Berlin',
                            'Mecklenburg-Vorpommern',
                            'Hamburg',
                            'Bremen',
                            'Schleswig-Holstein',
                            'außerhalb Deutschlands' ]},
            { :name => 'country',
              :type => :country },
            { :name => 'send_newsletter',
              :mandatory => false,
              :type => :boolean }
            
          ]

  def to_s
    [ first_name, last_name ].compact.join(' ')
  end

  def admin?
    read_attribute(:admin) == true
  end


end