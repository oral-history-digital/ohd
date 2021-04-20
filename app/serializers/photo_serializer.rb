class PhotoSerializer < ApplicationSerializer

  attributes :id, 
             :captions, 
             :src, 
             :thumb_src,
             :text,
             :interview_id,
             :workflow_state,
             :workflow_states

  def captions
    I18n.available_locales.inject({}) do |mem, locale|
      t = object.translations.where(locale: locale).first
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(t && t.caption)
      mem
    end
  end

  def src
    if object.photo.attachment
      object.variant_path('500x500')
    end
  end

  def thumb_src
    if object.photo.attachment
      object.variant_path('100x100')
    end
  end

  # dummy. will be filled in search
  def text
    {}
  end

end
