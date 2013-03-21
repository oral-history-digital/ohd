module Admin::UserRegistrationsHelper

  def form_edit_field_for(user_registration, attribute, options={})
    value = user_registration.send(attribute)
    value = '&nbsp;' * 8 if value.blank?
    id = "user_registration_#{user_registration.id}_#{attribute}"
    display_id = id + '_display'
    field_id = id + '_field'
    text_area = options.delete(:text_area)
    select = options.delete(:select)
    html = content_tag(:span, value, options.merge({:id => display_id, :class => "inline-editable", :onclick => "$('#{display_id}').hide(); $('#{field_id}').show(); $('user_registration_data_actions').show(); Event.stop(event);"})) # Event.stop(event)
    html << content_tag((text_area ? :div : :span), options.merge({:id => field_id, :class => 'inline-editor', :style => 'display: none;'})) do
      if text_area
        text_area_tag(user_registration, user_registration.send(attribute.to_sym), :id => id, :name => "user_registration[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)") \
      elsif select
        content_tag(:div, select, :id => field_id)
      else
        text_field_tag(user_registration, user_registration.send(attribute.to_sym), :id => id, :name => "user_registration[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)")
      end
    end
    html
  end

end
