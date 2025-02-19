class MarkTextJob < ApplicationJob
  queue_as :default

  def perform(opts)
    locale = opts[:locale]

    opts[:interview].segments.each do |segment|
      text = segment.text(locale) || segment.text("#{locale}-public")
      opts[:texts_to_mark].each do |i, t|
        regexp = Regexp.new(Regexp.quote(t['text_to_mark']))
        if text =~ regexp
          text = text.gsub(regexp, t['replacement'])
          segment.update(text: text, locale: locale)
        end
      end
    end
  end

end
