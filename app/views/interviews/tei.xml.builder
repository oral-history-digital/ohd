xml.instruct!
xml.TEI xmlns: "http://www.tei-c.org/ns/1.0", "xmlns:xsi": "http://www.tei-c.org/ns/1.0" do

  xml.idno type: "RANDOM-ID" do
    interview.archive_id
  end

  xml.teiHeader do

    xml.fileDesc do
    end

    xml.profileDesc do
      xml.particDesc do
        interview.contributors.each do |contributor|
          xml.person "xml:id": "p#{contributor.id}", sex: contributor.gender do
            xml.givenName contributor.first_name(locale)
            if interview.project.fullname_on_landing_page
              xml.familyName contributor.last_name(locale)
            end
          end
        end
      end

      xml.settingDesc "LATER"
    end

    xml.encodingDesc do
    end

    xml.revisionDesc do
      Date.today.strftime("%Y-%m-%d")
    end

  end

  xml.text "xml:lang": locale do
    xml.timeline unit: "s" do
      xml.when "xml:id": "T_START", interval: "0.0", since: "T_START"
      interview.tapes.each do |tape|
        tape.segments.each do |segment|
          xml.when "xml:id": "T#{tape.number}_S#{segment.id}", interval: segment.time, since: "T_START"
        end
      end
      xml.when "xml:id": "T_END", interval: interview.duration, since: "T_START"
    end

    interview.tapes.each do |tape|
      tape.segments.each do |segment|

        ordinary_text_parts, comments = segment.tokenized_text(interview.alpha3)
        s_end = segment.next.nil? ? "T_END" : "T#{segment.next.tape.number}_S#{segment.next.id}" 

        xml.annotationBlock "xml:id": "ab#{segment.id}",
          who: "p#{segment.speaker_id || segment.speaker}",
          start: "T#{tape.number}_S#{segment.id}",
          end: s_end do

          xml.u "xml:id": "u#{segment.id}" do
            xml.seg type: "contribution", "xml:id": "s#{segment.id}" do
              ordinary_text_parts.each do |part|
                xml.tag!("tei:#{part[:type]}", "xmlns:tei":"http://www.tei-c.org/ns/1.0", "xml:id": "s#{segment.id}_#{part[:index]}") do
                  xml.text! part[:content]
                end
              end
            end
          end

          comments.each do |comment|
            xml.spanGr type: "comment" do
              xml.span from: "s#{segment.id}_#{comment[:index]-1}", to: "s#{segment.id}_#{comment[:index]+1}", type: comment[:type] do
                xml.text! comment[:content]
              end
            end
          end

          xml.spanGr type: "original", "xml:id": "so#{segment.id}" do
            xml.text! segment.text(interview.alpha3)
          end

          # translation
          if interview.translation_lang
            xml.spanGr type: interview.translation_lang do
              xml.span from: "T#{tape.number}_S#{segment.id}",
                to: s_end do
                  xml.text! segment.text(interview.translation_lang)
                end
            end
          end

          # registry-references
          if segment.registry_references_count > 0
            xml.spanGr type: TranslationValue.for('edit_column_header.registry_references', locale) do
              segment.registry_references.each do |registry_reference|
                xml.span from: "T#{tape.number}_S#{segment.id}",
                  to: s_end do
                    xml.text! registry_reference.registry_entry.descriptor(locale)
                  end
              end
            end
          end

          #annotations
          if segment.annotations_count > 0
            xml.spanGr type: TranslationValue.for('annotations', locale) do
              segment.annotations.each do |annotation|
                annotation.translations.each do |translation|
                  unless translation.text.blank?
                    xml.span type: translation.locale,
                      from: "T#{tape.number}_S#{segment.id}",
                      to: s_end do
                        xml.text! translation.text
                      end
                  end
                end
              end
            end
          end
        end
      end
    end

  end
end
