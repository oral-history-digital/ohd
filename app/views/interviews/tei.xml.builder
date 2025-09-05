xml.instruct!
xml.TEI xmlns: "http://www.tei-c.org/ns/1.0", "xmlns:xsi": "http://www.tei-c.org/ns/1.0" do

  xml.idno type: "Interview-ID" do
    xml.text interview.archive_id
  end

  xml.idno type: "Originalsignatur" do
    xml.text interview.signature_original
  end

  xml.idno type: "OAI" do
    xml.text interview.oai_identifier
  end

  xml.teiHeader do

    xml.fileDesc do
      xml.titleStmt do
        [:de, :en].each do |locale|
          xml.title interview.oai_title(locale)
        end

        interview.contributions.each do |contribution|
          xml.respStmt do
            [:de, :en].each do |locale|
              xml.resp "xml:lang": locale do
                xml.text TranslationValue.for("contributions.#{contribution&.contribution_type&.code}", locale)
              end
            end
            xml.persName "xml:id": "p#{contribution&.person_id}" ref: "##{contribution.contributor&.initials}" do
              xml.forename contribution&.contributor&.first_name(locale)
              if interview.project.fullname_on_landing_page
                xml.surname contribution&.contributor&.last_name_used(locale)
              else
                xml.surname contribution&.contributor&.last_name_used(locale).strip[0].upcase + "."
              end
            end
          end
        end

        %w(leader manager cooperation_partner).each do |role|
          if interview.project.send(role).present?
            xml.respStmt do
              [:de, :en].each do |locale|
                xml.resp "xml:lang": locale do
                  xml.text! TranslationValue.for("activerecord.attributes.project.#{role}", locale)
                end
                xml.orgName do
                  xml.text! interview.project.send(role)
                end
              end
            end
          end
        end

        xml.funders do
          interview.project.funder_names.each do |funder|
            xml.funder do
              xml.text! funder
            end
          end
        end
      end

      xml.extent do
        xml.measure unit: "file", quantity: interview.tapes.count
      end

      xml.publicationStmt do
        xml.publisher do
          interview.oai_publisher(locale).split(/,\s*/).each do |publisher|
            xml.orgName publisher
          end
        end
        xml.distributor do
          xml.orgName "Oral-History.Digital"
          xml.idno type: "URL" do
            xml.text! "https://portal.oral-history.digital"
          end
          if interview.project.archive_domain.present?
            xml.orgName interview.project.name if interview.project.name.present?
            xml.idno type: "URL" do
              xml.text! interview.project.archive_domain
            end
          end
        end
        xml.availability status: interview.workflow_status do
          interview.oai_locales.each do |locale|
            xml.p "xml:lang": locale do
              xml.text! "#{TranslationValue.for('conditions', locale)} (#{interview.project.name})"
              xml.ref target: "#{interview.project.domain_with_optional_identifier}/#{locale}/conditions" do
                xml.text! TranslationValue.for('link', locale)
              end
            end
            xml.p "xml:lang": locale do
              xml.text! "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)"
              xml.ref target: "#{OHD_DOMAIN}/#{locale}/conditions" do
                xml.text! TranslationValue.for('link', locale)
              end
            end
            xml.p "xml:lang": locale do
              xml.text! TranslationValue.for('privacy_protection', locale)
              xml.ref target: "#{OHD_DOMAIN}/#{locale}/privacy_protection" do
                xml.text! TranslationValue.for('link', locale)
              end
            end
          end
        xml.idno type: "URL" do
          xml.text! interview.oai_url_identifier(locale)
        end
        if interview.oai_publication_date
          xml.date when: interview.oai_publication_date do
            xml.text! interview.oai_publication_date
          end
      end

      xml.sourceDesc do
        xml.recordingStmt do
          interview.tapes.each do |tape|
            xml.recording type: interview.media_type, "xml:id": "#{interview.media_type}_#{tape.number}" do
              xml.media type: interview.oai_format#, url: tape.media_url(locale)
              xml.duration tape.duration if tape.duration
            end
          end
        end
      end
    end

    xml.encodingDesc do
      interview.oai_locales.each do |locale|
        xml.projectDesc "xml:lang": locale do
          xml.p do
            xml.text! interview.project.introduction(locale)
          end
        end
      end
      xml.classDecl do
        xml.taxonomy "xml:id": "ohdTopics" do
          oai_subject_registry_entry_ids.each do |registry_entry_id|
            registry_entry = RegistryEntry.find(registry_entry_id)
            xml.category "xml:id": "re_#{registry_entry_id}" do
              xml.catDesc do
                [:de, :en].each do |locale|
                  xml.gloss "xml:lang": locale do
                    xml.text! registry_entry.to_s(locale)
                  end
                end
                registry_entry.norm_data.each do |norm_datum|
                  xml.idno type: norm_datum.norm_data_provider.name.upcase do
                    xml.text! norm_datum.nid
                  end
                end
                xml.idno type: "OHD-ID" do
                  xml.text! registry_entry.id
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
        xml.abstract "xml:lang": locale do
          xml.p interview.description(locale)
        end
      end

      xml.particDesc do
        %w(interviewees interviewers).each do |role|
          interview.send(role).each do |contributor|
            xml.person "xml:id": "p#{contributor.id}", sex: contributor.gender do
              xml.idno type: "OHD-ID" do
                xml.text! contributor.id
              end
              xml.persName do
                xml.foreName contributor.first_name(locale)
                if interview.project.fullname_on_landing_page
                  xml.surName contributor.last_name(locale)
                end
              end
              interview.oai_locales.each do |locale|
                xml.note type: "role", "xml:lang": locale do
                  xml.text! TranslationValue.for("contributions.#{contributor.contribution_type.code}", locale)
                end
              end
            end
          end
        end
      end

      xml.settingDesc "LATER"
    end

    xml.revisionDesc do
      Date.today.strftime("%Y-%m-%d")
    end

  end

  xml.text "xml:lang": locale do
    interview.tapes.each do |tape|
      #<timeline unit="s" corresp="video2>
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
                      xml.tag!(c_type, c_content, c_attributes || {})
                    end
                  elsif part[:content]
                    xml.tag!(type, attributes) do
                      xml.text!(part[:content])
                    end
                  else
                    xml.tag!(type, attributes)
                  end
                end

                xml.anchor "synch": s_end
              end
            end

            comments.each do |comment|
              xml.spanGrp type: comment[:type] do
                xml.span from: "s#{segment.id}_#{comment[:index_from]}", to: "s#{segment.id}_#{comment[:index_to]}" do
                  xml.text! comment[:content]
                end
              end
            end

            xml.spanGrp type: "original" do
              xml.span from: "T#{tape.number}_S#{segment.id}",
                to: s_end do
                  xml.text! segment.text("#{interview.alpha3}-public")
                end
            end

            # translation
            if interview.translation_alpha3
              xml.spanGrp type: interview.translation_alpha3 do
                xml.span from: "T#{tape.number}_S#{segment.id}",
                  to: s_end do
                    xml.text! segment.text(interview.translation_alpha3)
                  end
              end
            end

            # registry-references
            if segment.registry_references_count > 0
              xml.spanGrp type: TranslationValue.for('edit_column_header.registry_references', locale) do
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
              xml.spanGrp type: TranslationValue.for('annotations', locale) do
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
end
