module Admin::UserRegistrationsHelper

  def form_edit_field_for(user, attribute, options={})
    value = user.send(attribute)
    id = "user_#{user.id}_#{attribute}"
    display_id = id + '_display'
    field_id = id + '_field'
    text_area = options.delete(:text_area)
    select = options.delete(:select)
    form_html = \
    if text_area
      text_area_tag(user, user.send(attribute.to_sym), :id => id, :name => "user[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)") \
    elsif select
      content_tag(:div, select, :id => field_id)
    else
      text_field_tag(user, user.send(attribute.to_sym), :id => id, :name => "user[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)")
    end
    html = content_tag(:span, value, options.merge({:id => display_id, :class => "inline-editable", :onclick => "var display = $('#{display_id}'); display.hide(); var field = $('#{field_id}'); var element = field.down('select, input, textarea'); element.disabled = false; element.value = display.innerHTML; field.show(); $('user_registration_data_actions').show(); element.focus(); Event.stop(event);"})) # Event.stop(event)
    html << content_tag((text_area ? :div : :span), options.merge({:id => field_id, :class => 'inline-editor', :style => 'display: none;'})) do
      form_html
    end
    html
  end

  def boolean_field_for(user, method)
    value = user.send(method)
    checked = case value
                when true, false
                  value
                when String
                  value.to_i > 0
                when Numeric
                  value > 0
                else
                  false
              end
    "checked = #{value.inspect}" + check_box_tag("user[#{method}]", 1, checked)
  end

end
