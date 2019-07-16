class HomeController < ApplicationController

  layout 'responsive'

  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def map_tutorial
    render layout: false
  end

  def archive
    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do
        locales = current_project.available_locales.reject{|i| i == 'alias'}
        json = Rails.cache.fetch("#{current_project.cache_key_prefix}-static-content") do 
          {
            external_links: current_project.external_links,
            translations: translations,
            country_keys: locales.inject({}) do |mem, locale|
              mem[locale] = ISO3166::Country.translations(locale).sort_by{|key, value| value}.to_h.keys
              mem
            end,
            collections: Collection.all.map{|c| {value: c.id, name: c.localized_hash}}, 
            contribution_types: current_project.contribution_types,
            registry_entry_search_facets: current_project.registry_entry_search_facets.map{|facet| {id: RegistryEntry.find_by_code(facet.name).id, display_on_landing_page: facet.display_on_landing_page}},
            registry_reference_type_metadata_fields: current_project.registry_reference_type_metadata_fields.inject({}){|mem, facet| mem[facet.name] = RegistryReferenceTypeSerializer.new(RegistryReferenceType.find_by_code(facet.name)).as_json; mem},
            languages: Language.all.map{|c| {value: c.id.to_s, name: c.localized_hash, locale: ISO_639.find(c.code.split(/[\/-]/)[0]).alpha2}}, 
            upload_types: current_project.upload_types,
            project: current_project.name.to_s,
            project_name: current_project.name,
            project_domain: current_project.domain,
            project_doi: current_project.doi,
            archive_domain: current_project.archive_domain,
            locales: current_project.available_locales,
            view_modes: current_project.view_modes,
            view_mode: current_project.view_modes[0],
            list_columns: current_project.list_columns,
            media_streams: Project.media_streams,
            hidden_registry_entry_ids: current_project.hidden_registry_entry_ids,
          }
        end
        home_content = {}
        locales.each do |i|
          I18n.locale = i
          template = "/home/home.#{i}.html+#{current_project.name == 'empty' ? 'zwar' : current_project.name}"
          home_content[i] = render_to_string(template: template, layout: false)
        end
        json[:home_content] = home_content
        render plain: json.to_json
      end
    end
  end

  def faq_archive_contents
  end

  def faq_index
  end

  def faq_searching
  end

  def faq_technical
  end

  def map_tutorial
  end

  private

  def translations
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = instance_variable_get("@#{locale}") || 
        instance_variable_set("@#{locale}", 
                              YAML.load_file(File.join(Rails.root, "config/locales/#{locale}.yml"))[locale.to_s].deep_merge(
                                YAML.load_file(File.join(Rails.root, "config/locales/devise.#{locale}.yml"))[locale.to_s]).merge(
                                  countries: ISO3166::Country.translations(locale)
                                )
                             )
      mem
    end
  end

end
