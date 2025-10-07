xml.instruct!
xml << '<!DOCTYPE TEI SYSTEM "http://www.tei-c.org/release/xml/tei/custom/schema/dtd/tei_all.dtd">'

xml.TEI xmlns: "http://www.tei-c.org/ns/1.0", "xmlns:xsi": "http://www.tei-c.org/ns/1.0" do

  #xml.idno type: "Interview-ID" do
    #xml.text interview.archive_id
  #end

  #if interview.signature_original.present?
    #xml.idno type: "Originalsignatur" do
      #xml.text interview.signature_original
    #end
  #end

  #xml.idno type: "OAI" do
    #xml.text interview.oai_identifier
  #end

  xml.teiHeader do

    xml.fileDesc do
      xml.titleStmt do
        %w(de en).each do |locale|
          xml.title interview.oai_title(locale), "xml:lang": ISO_639.find(locale).alpha3
        end

        interview.contributions.each do |contribution|
          xml.respStmt do
            %w(de en).each do |locale|
              xml.resp TranslationValue.for("contributions.#{contribution&.contribution_type&.code}", locale).strip, "xml:lang": ISO_639.find(locale).alpha3
            end
            xml.persName ref: "##{contribution.person&.initials}" do
              xml.forename contribution&.person&.first_name(locale)
              if interview.project.fullname_on_landing_page
                xml.surname contribution&.person&.last_name_used(locale)
              else
                xml.surname contribution&.person&.last_name_used(locale).strip[0].upcase + "."
              end
            end
          end
        end

        %w(leader manager cooperation_partner).each do |role|
          if interview.project.send(role).present?
            xml.respStmt do
              %w(de en).each do |locale|
                xml.resp TranslationValue.for("activerecord.attributes.project.#{role}", locale).strip, "xml:lang": ISO_639.find(locale).alpha3
              end
              xml.tag! %w(leader manager).include?(role) ? 'persName' : 'orgName', interview.project.send(role).strip
            end
          end
        end

        interview.project.funder_names.each do |funder|
          xml.funder funder
        end
      end

      xml.extent do
        xml.measure unit: "file", quantity: interview.tapes.count
      end

      xml.publicationStmt do
        xml.publisher do
          interview.oai_contributor(locale).split(/,\s*/).each do |publisher|
            xml.orgName publisher
          end
        end
        xml.distributor do
          xml.orgName "Oral-History.Digital"
          xml.idno "https://portal.oral-history.digital", type: "URL"
          if interview.project.archive_domain.present?
            xml.orgName interview.project.name if interview.project.name.present?
            xml.idno interview.project.archive_domain, type: "URL"
          end
        end
        xml.availability status: interview.workflow_state do
          interview.oai_locales.each do |locale|
            xml.p "xml:lang": ISO_639.find(locale).alpha3 do
              xml.ref "#{TranslationValue.for('conditions', locale)} (#{interview.project.name})".strip,
                target: "#{interview.project.domain_with_optional_identifier}/#{locale}/conditions"
            end
            xml.p "xml:lang": ISO_639.find(locale).alpha3 do
              xml.ref "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)".strip,
                target: "#{OHD_DOMAIN}/#{locale}/conditions"
            end
            xml.p "xml:lang": ISO_639.find(locale).alpha3 do
              xml.ref TranslationValue.for('privacy_protection', locale).strip,
                target: "#{OHD_DOMAIN}/#{locale}/privacy_protection"
            end
          end
        end
        xml.idno interview.oai_url_identifier(locale), type: "URL"
        if interview.oai_publication_date
          xml.date interview.oai_publication_date, when: interview.oai_publication_date
        end
      end

      xml.sourceDesc do
        xml.recordingStmt do
          interview.tapes.each do |tape|
            duration = tape.duration ? Timecode.new(tape.duration).timecode : tape.segments.last&.timecode
            duration_parts = duration ? duration.split(/[\.|\:]/).map(&:to_i) : [0,0,0,0]
            xml.recording type: interview.media_type, dur: "PT#{duration_parts[0]}H#{duration_parts[1]}M#{duration_parts[2]}S" do
              xml.media mimeType: interview.oai_format#, url: tape.media_url(locale)
            end
          end
        end
      end
    end

    xml.encodingDesc do
      interview.oai_locales.each do |locale|
        xml.projectDesc "xml:lang": ISO_639.find(locale).alpha3 do
          ActionView::Base.full_sanitizer.sanitize(interview.project.introduction(locale)).split("\n").each do |line|
            xml.p line.strip unless line.strip.blank?
          end
        end
      end
      xml.classDecl do
        xml.taxonomy "xml:id": "ohd-registry", source: "https://portal.oral-history.digital/de/registry_entries" do
          interview.oai_subject_registry_entries.each do |registry_entry|
            xml.category "xml:id": "re_#{registry_entry.id}" do
              xml.catDesc do
                %w(de en).each do |locale|
                  xml.gloss registry_entry.to_s(locale), "xml:lang": ISO_639.find(locale).alpha3
                end
                registry_entry.norm_data.each do |norm_datum|
                  xml.idno norm_datum.nid, type: norm_datum.norm_data_provider.name.upcase
                end
                xml.idno registry_entry.id.to_s, type: "OHD-ID"
              end
            end
          end
        end
        xml.taxonomy "xml:id": "archive-registry", source: "#{interview.project.domain_with_optional_identifier}/#{locale}/registry_entries" do
          interview.archive_registry_entries.each do |registry_entry|
            xml.category "xml:id": "re_#{registry_entry.id}" do
              xml.catDesc do
                %w(de en).each do |locale|
                  xml.gloss registry_entry.to_s(locale), "xml:lang": ISO_639.find(locale).alpha3
                end
                registry_entry.norm_data.each do |norm_datum|
                  xml.idno norm_datum.nid, type: norm_datum.norm_data_provider.name.upcase
                end
              end
            end
          end
        end
      end
    end

    xml.profileDesc do
      xml.langUsage do
        xml.language ident: interview.alpha3
      end

      interview.oai_locales.each do |locale|
        xml.abstract "xml:lang": ISO_639.find(locale).alpha3 do
          interview.description(locale).split("\n").each do |line|
            xml.p line.strip unless line.strip.blank?
          end
        end
      end

      xml.particDesc do
        project_contribution_types = interview.project.contribution_types.index_by(&:code)
        %w(interviewee interviewer).each do |role|
          project_contribution_types[role].contributions.where(interview_id: interview.id).each do |contribution|
            xml.person "xml:id": "p#{contribution.person_id}", sex: contribution.person&.gender do
              xml.idno contribution.person_id.to_s, type: "OHD-ID"
              xml.persName do
                xml.forename contribution.person&.first_name(locale)
                if interview.project.fullname_on_landing_page
                  xml.surname contribution.person&.last_name(locale)
                end
              end
              interview.oai_locales.each do |locale|
                xml.note TranslationValue.for("contributions.#{role}", locale), type: "role", "xml:lang": ISO_639.find(locale).alpha3
              end

              place_of_birth = contribution.person&.place_of_birth
              date_of_birth = contribution.person&.date_of_birth
              if date_of_birth || place_of_birth
                xml.birth do
                  if place_of_birth
                    xml.location do
                      interview.oai_locales.each do |locale|
                        xml.placeName place_of_birth.descriptor(locale), "xml:lang": ISO_639.find(locale).alpha3, ref: "#r_#{place_of_birth.id}"
                      end
                    end
                  end
                  xml.date contribution.person&.date_of_birth.to_s, when: contribution.person&.date_of_birth
                end
              end
              interview.oai_locales.each do |locale|
                if contribution.person&.has_biography?(locale) && !contribution.person&.biography_public?
                  xml.note type: TranslationValue.for("biography", locale), "xml:lang": ISO_639.find(locale).alpha3 do
                    contribution.person&.biographical_entries.each do |biographical_entry|
                      xml.text! biographical_entry.text(locale)
                    end
                  end
                end
              end
              interview.oai_locales.each do |locale|
                if contribution.person&.description(:locale)
                  text = contribution.person&.description(:locale).sub(/(www|http:|https:+[^\s]+[\w])/, "")
                  link = contribution.person&.description(:locale)[/.*(www|http:|https:+[^\s]+[\w])/, 1]
                  if text.present? || link.present?
                    xml.note n: TranslationValue.for('activerecord.attributes.interview.pseudo_links', locale), "xml:lang": ISO_639.find(locale).alpha3 do
                      xml.p if text.present?
                      xml.ref link, target: link if link.present?
                    end
                  end
                end
              end
              contribution.person&.registry_references.joins(:registry_reference_type).where.not(registry_reference_type: {code: 'birth_place'}).each do |registry_reference|
                interview.oai_locales.each do |locale|
                  xml.note registry_reference.registry_entry.descriptor(locale).strip, type: registry_reference.registry_reference_type&.name(locale), "xml:lang": ISO_639.find(locale).alpha3
                end
              end
            end
          end
        end
      end

      xml.settingDesc do
        interview.oai_locales.each do |locale|
          xml.setting "xml:lang": ISO_639.find(locale).alpha3, n: TranslationValue.for('metadata_labels.observations', locale) do
            interview.observations(locale).split("\n").each do |line|
              xml.p line.strip unless line.strip.blank?
            end
          end
        end
        xml.setting do
          xml.date when: interview.interview_date if interview.interview_date.present?
        end
      end

      xml.textClass do
        xml.keywords scheme: "#ohdTopics" do
          interview.oai_subject_registry_entries.each do |registry_entry|
            interview.oai_locales.each do |locale|
              xml.term registry_entry.to_s(locale).strip, corresp: "re_#{registry_entry.id}", "xml:lang": ISO_639.find(locale).alpha3
            end
          end
        end
      end
    end

  end

  xml.text "xml:lang": interview.alpha3 do
    interview.tapes.each do |tape|
      xml.timeline unit: "s", corresp: "#{interview.media_type}_#{tape.number}" do
        xml.when "xml:id": "T#{tape.number}_START", interval: "0.0", since: "T#{tape.number}_START"

        tape.segments.each do |segment|
          xml.when "xml:id": "T#{tape.number}_S#{segment.id}", interval: segment.time, since: "T#{tape.number}_START"
        end

        xml.when "xml:id": "T#{tape.number}_END", interval: tape.duration, since: "T#{tape.number}_START"
      end
    end

    xml.body do
      interview.tapes.each do |tape|
        tape.segments.each do |segment|

          ordinary_text_parts, comments = Tei.new(segment.text(interview.alpha3)).tokenized_text
          s_start = "T#{tape.number}_S#{segment.id}"
          s_end = segment.next.nil? ? "T#{tape.number}_END" : "T#{segment.next.tape.number}_S#{segment.next.id}" 

          xml.annotationBlock "xml:id": "ab#{segment.id}",
            who: "p#{segment.speaker_id || segment.speaker}",
            start: s_start,
            end: s_end do

            xml.u "xml:id": "u#{segment.id}" do
              xml.seg type: "contribution", "xml:id": "s#{segment.id}", "xml:lang": interview.alpha3 do
                xml.anchor "synch": s_start

                ordinary_text_parts.each do |part|
                  type = part[:type]
                  attributes = (part[:attributes] || {}).merge("xml:id": "s#{segment.id}_#{part[:index]}")

                  if part[:content]&.is_a?(Array)
                    c_type, c_content, c_attributes = part[:content]
                    xml.tag!(type, attributes) do
                      xml.tag!(c_type, c_attributes || {}, c_content)
                    end
                  elsif part[:content]
                    xml.tag!(type, attributes, part[:content])
                  else
                    xml.tag!(type, attributes)
                  end
                end

                xml.anchor "synch": s_end
              end
            end

            comments.each do |comment|
              xml.spanGrp type: comment[:type] do
                xml.span comment[:content],
                  from: "s#{segment.id}_#{comment[:index_from]}",
                  to: "s#{segment.id}_#{comment[:index_to]}"
              end
            end

            xml.spanGrp type: "original" do
              xml.span segment.text("#{interview.alpha3}-public"),
                from: "T#{tape.number}_S#{segment.id}",
                to: s_end
            end

            # translation
            if interview.translation_alpha3
              xml.spanGrp type: interview.translation_alpha3 do
                xml.span segment.text(interview.translation_alpha3),
                  from: "T#{tape.number}_S#{segment.id}",
                  to: s_end
              end
            end

            # registry-references
            if segment.registry_references_count > 0
              xml.spanGrp type: TranslationValue.for('edit_column_header.registry_references', locale) do
                segment.registry_references.each do |registry_reference|
                  xml.span registry_reference.registry_entry.descriptor(locale),
                    from: "T#{tape.number}_S#{segment.id}",
                    to: s_end, ana: "#r_#{registry_reference.registry_entry_id}"
                end
              end
            end

            #annotations
            if segment.annotations_count > 0
              xml.spanGrp type: TranslationValue.for('annotations', locale) do
                segment.annotations.each do |annotation|
                  annotation.translations.each do |translation|
                    unless translation.text.blank?
                      xml.span translation.text,
                        type: translation.locale,
                        from: "T#{tape.number}_S#{segment.id}",
                        to: s_end
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
