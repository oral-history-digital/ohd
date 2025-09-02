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
        xml.title interview.oai_title(locale)
      end

      xml.publicationStmt do
        xml.publisher interview.oai_publisher(locale)
        xml.date interview.oai_date
        xml.p "This is a TEI document for the interview with ID: #{interview.archive_id}."
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

    xml.profileDesc do
      xml.langUsage do
        xml.language "xml:lang": interview.alpha3 do
          xml.text "This interview is in #{interview.alpha3}."
        end
        interview.alpha3s_with_transcript.each do |alpha3|
          xml.language "xml:lang": alpha3 do
            xml.text "This interview is available in #{alpha3} with a transcript."
          end
        end
      end

      xml.abstract do
      end

      xml.particDesc do
        interview.contributors.each do |contributor|
          xml.person "xml:id": "p#{contributor.id}", sex: contributor.gender do
            xml.persName do
              xml.foreName contributor.first_name(locale)
              if interview.project.fullname_on_landing_page
                xml.surName contributor.last_name(locale)
              end
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
