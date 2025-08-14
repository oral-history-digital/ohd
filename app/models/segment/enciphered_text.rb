module Segment::EncipheredText

  def enciphered_text(version, text_original='', locale)
    text_original ||= ''
    text_original = text_original.gsub('{{', '{[').gsub('}}', ']}') # replace wrong {{ with {[

    hidden_texts = {
      ger: 'Diese Passage wird nicht veröffentlicht.',
      spa: 'Esta parte del texto no se publica.',
      rus: 'Эта часть текста не публикуется.',
      ukr: 'Цей фрагмент не буде опублікований.',
      gre: 'Αυτό το μέρος του κειμένου δεν δημοσιεύεται.'
    }
    hidden_text = hidden_texts.fetch(locale.to_sym, 'This part of the text is not published.')

    # TODO: replace with utf8 À
    text_enciphered =
      case version
      when :subtitle
        apply_subtitle_transformations(text_original, hidden_text)
      when :public
        apply_public_transformations(text_original, hidden_text)
      end
    text_enciphered
  end

  private

  def apply_subtitle_transformations(text, hidden_text)
    # Apply transformations repeatedly to handle nested tags
    previous_text = nil
    current_text = text.dup
    
    while current_text != previous_text
      previous_text = current_text.dup
      current_text = current_text.
        # colonia
        gsub(/<res\s+(.*?)>/, hidden_text).                    # e.g. <res bla bla>
        gsub(/<an\s+(.*?)>/, "XXX").                           # e.g. <an bla bla>
        gsub(/\s*<n\(([^>]*?)\)>/, "").                        # <n(1977)>
        gsub(/<i\((.*?)\)>/, "").                              # <i(Batteriewechsel)>
        gsub(/<p\d+>/, "").                                    # <p1>, <p2>, ...
        gsub(/<\?\s+(.*?)>/, '(\1?)').                         # e.g. <? bla bla>
        gsub(/<=>/, " ").                                      # <=>
        gsub(/<v\((.+?)\)>/, '').                              # e.g. <v(bla bla)>
        gsub(/<s\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <s(lachend) bla bla>
        gsub(/<sim\s+(.*?)>/, '\1').                           # e.g. <sim bla bla>
        gsub(/<nl\((.+?)\)\s*(.*?)>/, '\2').                   # e.g. <nl(Geräusch) bla bla>
        gsub(/<g\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <g(Gestik) bla bla>
        gsub(/<m\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <m(Mimik) bla bla>
        gsub(/<\?\d+>/, "(...?)").                             # <?1>, <?2>, ...
        gsub(/<l\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <l(es) bla bla>
        gsub(/<ld\((.+?)\)\s*(.*?)>/, '\2').                   # e.g. <ld(Dialekt) bla bla>
        # zwar
        #gsub(/\[.*?\]/, "").                                   # e.g. [Kommentar]
        #gsub(/\[\.\.\.\]/, "XXX").                             # e.g. [...]
        #gsub(/\s*\([-|\d]+\)/, "").                            # e.g. (-), (---), (6)
        gsub(/\{.*?\}/, "")                                    # e.g. {[laughs silently]}
        #gsub("~", "").                                         # e.g. Wo waren Sie ~en este tiempo~?
        #gsub("...", "_").                                      # e.g. ...
        #gsub(/\(unverständlich, \d+ \w+\)/, "(...?)").         # e.g. (unverständlich, 1 Wort)
        #gsub(" [---]", "").                                    # e.g. Ich war [---] bei Maria Malta, als das passierte.
        #gsub("(???) ", "(...?)").                              # e.g. Nice grandparents, we played football, (???) it's
        #gsub("<***>", "").                                     # e.g. <***>
    end
    
    # Apply final cleanup
    current_text.
      gsub(/\s+/, " ").                                      # cleanup whitespace (more than one)
      gsub(/\s+([\.\,\?\!\:])/, '\1').                       # cleanup whitespace (before .,?!:)
      gsub(/^\s+/, "")                                       # cleanup whitespace (beginning of phrase)
  end

  def apply_public_transformations(text, hidden_text)
    text.
      # colonia
      gsub(/<res\s+(.*?)>/, hidden_text).                    # e.g. <res bla bla>
      gsub(/<an\s+(.*?)>/, "XXX").                           # e.g. <an bla bla>
      gsub(/<n\(([^>]*?)\)>/, '(\1)').                       # <n(1977)>
      #gsub(/<i\((.*?)\)>/, "<c(Pause)>").                    # <i(Batteriewechsel)>
      # zwar
      #gsub(/\[\.\.\.\]/, "XXX").                             # e.g. <an bla bla>
      #gsub(/\{\[?(.*?)\]?\}/, '[\1]').                       # e.g. {[laughs silently]}
      #gsub("~", "").                                         # e.g. Wo waren Sie ~en este tiempo~?
      ##gsub("...", "_").                                      # e.g. ...
      #gsub(" [---]", "<p>").                                 # e.g. Ich war [---] bei Maria Malta, als das passierte.
      ##gsub(/\((.*?)\?\)/, '<?\1>').                          # e.g. (By now?) it's the next generation
      #gsub("<***>", "<i(Bandende)>").                        # e.g. <***>
      #gsub("(???) ", "<?>").                                 # e.g. Nice grandparents, we played football, (???) it's
      gsub(/\s+/, " ").                                      # cleanup whitespace (more than one)
      gsub(/\s+([\.\,\?\!\:])/, '\1').                       # cleanup whitespace (before .,?!:)
      gsub(/^\s+/, "")                                       # cleanup whitespace (beginning of phrase)
  end

end