module Admin::UserAnnotationsHelper

  def annotation_inline_edit_for(user_annotation, options={})
    id = "user_annotation_#{user_annotation.id}_description"
    form_id = id + '_form'
    actions_id = id + '_actions'
    update_path = admin_user_annotation_path(user_annotation)
    form_options = options.merge({
                                     id: form_id,
                                     method: :put,
                                     remote: true,
                                     class: 'inline'
                                 })
    html = content_tag(:div, options.merge({:id => form_id, :class => 'inline-editor'})) do
      form_tag(update_path, form_options) do
        form_html = text_area_tag(user_annotation, user_annotation.description, :id => id, :name => "user_annotation[description]", :class => 'editor')
        buttons_html = submit_tag("", :id => "#{id}_update", :class => "update", data: {title: t(:update, :scope => 'user_interface.actions')})
        buttons_html += "<input type='reset' id='#{id}_reset' name='#{id}_reset' title='#{t(:reset, :scope => 'user_interface.actions')}' class='reset' />".html_safe
        spinner_html = image_tag(image_path('/images/spinner.gif'), :id => "#{id}_spinner", :style => 'display:none;')
        form_html + content_tag(:span, buttons_html, :id => actions_id, :style => 'display: none;') + spinner_html
      end
    end
    html
  end

end
