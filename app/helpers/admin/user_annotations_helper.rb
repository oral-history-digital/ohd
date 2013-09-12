module Admin::UserAnnotationsHelper

  def annotation_inline_edit_for(user_annotation, options={})
    id = "user_annotation_#{user_annotation.id}_description"
    form_id = id + '_form'
    actions_id = id + '_actions'
    update_path = admin_user_annotation_path(user_annotation, :method => :put)
    form_options = options.merge({
                                     :id => form_id,
                                     :url => update_path,
                                     :method => :put,
                                     :html => options.merge({:class => 'inline'})
                                 })
    html = content_tag(:div, options.merge({:id => form_id, :class => 'inline-editor'})) do
      form_remote_tag(form_options) do
        form_html = text_area_tag(user_annotation, user_annotation.description, :id => id, :name => "user_annotation[description]", :class => 'editor')
        buttons_html = submit_tag(submit_text = t(:update, :scope => 'user_interface.actions'), :id => "#{id}_update",:title => submit_text,:class => "update", :onclick => "new Effect.Appear('shades', { duration: 0.4, to: 0.6}); $('ajax_spinner').show();")
        buttons_html += "<input type='reset' id='#{id}_reset' name='#{id}_reset' title='#{t(:reset, :scope => 'user_interface.actions')}' onclick=\"$(#{actions_id}).hide();\" class='reset'/>"
        spinner_html = image_tag(image_path('/images/spinner.gif'), :id => "#{id}_spinner", :style => 'display:none;')
        js = javascript_tag "new Form.Element.Observer('#{id}', 0.5, function(){$('#{actions_id}').show();});"
        form_html + content_tag(:span, buttons_html, :id => actions_id, :style => 'display: none;') + spinner_html + js
      end
    end
    html
  end

end