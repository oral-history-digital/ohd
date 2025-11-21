module SegmentsHelper
  def is_rtl_language?(alpha3)
    rtl_languages = %w[ara fas heb ur]
    rtl_languages.include?(alpha3)
  end

  def segment_popup_link(segment, association, alpha3)
    has_associations = segment.send("#{association}_count") > 0
    title = has_associations ?
      tv("edit.segment.#{association}.edit") :
      tv("edit.segment.#{association}.new")
    icon = association == 'annotations' ? 'sticky-note' : 'tag'

    if has_associations || is_editor?
      link_to(
        send("#{association}_segment_path", segment, alpha3: alpha3),
        class: "Button Button--transparent Button--icon",
        data: {
          turbo_frame: "segment_#{segment.id}_#{association}"
        },
        title: title
      ) do
        fa_icon icon,
          class: "Icon Icon--#{has_associations ? 'primary' : 'editorial'}"
      end
    end
  end
end

