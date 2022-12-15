# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_12_14_173022) do

  create_table "active_storage_attachments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.string "record_type", limit: 255, null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true, length: { record_type: 191, name: 191 }
  end

  create_table "active_storage_blobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "key", limit: 255, null: false
    t.string "filename", limit: 255, null: false
    t.string "content_type", limit: 255
    t.text "metadata", limit: 4294967295
    t.bigint "byte_size", null: false
    t.string "checksum", limit: 255, null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true, length: 191
  end

  create_table "annotation_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "annotation_id"
    t.string "locale", limit: 255
    t.text "text", limit: 4294967295
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["annotation_id"], name: "index_annotation_translations_on_annotation_id"
  end

  create_table "annotations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id"
    t.string "author", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_content_id"
    t.integer "segment_id"
    t.integer "author_id"
    t.string "workflow_state", default: "public"
    t.index ["interview_id"], name: "index_annotations_on_interview_id"
    t.index ["segment_id"], name: "index_annotations_on_segment_id"
  end

  create_table "archiving_batches", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "number", null: false
    t.bigint "project_id", null: false
    t.index ["project_id"], name: "index_archiving_batches_on_project_id"
  end

  create_table "archiving_batches_interviews", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "interview_id", null: false
    t.bigint "archiving_batch_id", null: false
    t.index ["archiving_batch_id"], name: "index_archiving_batches_interviews_on_archiving_batch_id"
  end

  create_table "biographical_entries", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "workflow_state", limit: 255, default: "unshared"
  end

  create_table "biographical_entry_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "biographical_entry_id", null: false
    t.string "locale", limit: 255, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "text", limit: 4294967295
    t.string "start_date", limit: 255
    t.string "end_date", limit: 255
    t.index ["biographical_entry_id"], name: "index_biographical_entry_translations_on_biographical_entry_id"
    t.index ["locale"], name: "index_biographical_entry_translations_on_locale", length: 191
  end

  create_table "checklist_items", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id", null: false
    t.integer "user_id", null: false
    t.string "item_type", limit: 255, null: false
    t.boolean "checked"
    t.datetime "checked_at"
    t.datetime "updated_at"
    t.integer "user_account_id"
    t.index ["interview_id", "checked"], name: "index_checklist_items_on_interview_id_and_checked"
    t.index ["interview_id"], name: "index_checklist_items_on_interview_id"
  end

  create_table "collection_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "collection_id"
    t.string "locale", limit: 255
    t.string "countries", limit: 255
    t.string "responsibles", limit: 255
    t.text "interviewers", limit: 4294967295
    t.string "name", limit: 255
    t.text "notes", limit: 4294967295
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "homepage"
    t.index ["collection_id"], name: "index_collection_translations_on_collection_id"
  end

  create_table "collections", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "project_id"
    t.integer "institution_id"
  end

  create_table "comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "author_id"
    t.integer "receiver_id"
    t.integer "ref_id"
    t.string "ref_type"
    t.text "text", limit: 16777215
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contribution_type_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "contribution_type_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "label"
    t.index ["contribution_type_id"], name: "index_contribution_type_translations_on_contribution_type_id"
    t.index ["locale"], name: "index_contribution_type_translations_on_locale"
  end

  create_table "contribution_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "code"
    t.boolean "use_in_details_view"
    t.integer "order"
    t.boolean "use_in_export", default: false
  end

  create_table "contributions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id"
    t.string "contribution_type", limit: 255
    t.integer "person_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "workflow_state", default: "unshared"
    t.string "speaker_designation"
    t.integer "contribution_type_id"
    t.index ["interview_id"], name: "index_contributions_on_interview_id"
  end

  create_table "delayed_jobs", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", limit: 4294967295, null: false
    t.text "last_error", limit: 4294967295
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by", limit: 255
    t.string "queue", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "external_link_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "external_link_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "url"
    t.string "name"
    t.index ["external_link_id"], name: "index_external_link_translations_on_external_link_id"
    t.index ["locale"], name: "index_external_link_translations_on_locale"
  end

  create_table "external_links", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "internal_name"
  end

  create_table "help_text_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "help_text_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "text"
    t.string "url"
    t.index ["help_text_id"], name: "index_help_text_translations_on_help_text_id"
    t.index ["locale"], name: "index_help_text_translations_on_locale"
  end

  create_table "help_texts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "code", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "histories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_histories_on_person_id"
  end

  create_table "history_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "history_id", null: false
    t.string "locale", limit: 255, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "forced_labor_details", limit: 4294967295
    t.string "return_date", limit: 255
    t.string "deportation_date", limit: 255
    t.string "punishment", limit: 255
    t.string "liberation_date", limit: 255
    t.index ["history_id"], name: "index_history_translations_on_history_id"
    t.index ["locale"], name: "index_history_translations_on_locale", length: 191
  end

  create_table "imports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "importable_id"
    t.string "importable_type", limit: 255
    t.datetime "time"
    t.string "migration", limit: 255
    t.string "content", limit: 400
    t.datetime "created_at"
    t.index ["importable_id", "importable_type"], name: "index_imports_on_importable_id_and_importable_type", length: { importable_type: 191 }
  end

  create_table "institution_projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "institution_id"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "institution_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "institution_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.text "description"
    t.index ["institution_id"], name: "index_institution_translations_on_institution_id"
    t.index ["locale"], name: "index_institution_translations_on_locale"
  end

  create_table "institutions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "shortname"
    t.string "street"
    t.string "zip"
    t.string "city"
    t.string "country"
    t.float "latitude"
    t.float "longitude"
    t.string "isil"
    t.string "gnd"
    t.string "website"
    t.integer "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "interview_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "locale", limit: 255
    t.text "observations", limit: 4294967295
    t.integer "interview_id"
    t.text "description"
  end

  create_table "interviews", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "archive_id", limit: 255
    t.integer "collection_id"
    t.integer "duration"
    t.boolean "translated"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "segmented", default: false
    t.boolean "researched", default: false
    t.boolean "proofread", default: false
    t.string "interview_date", limit: 255
    t.string "still_image_file_name", limit: 255
    t.string "still_image_content_type", limit: 255
    t.integer "still_image_file_size"
    t.datetime "still_image_updated_at"
    t.boolean "inferior_quality", default: false
    t.text "original_citation", limit: 4294967295
    t.text "translated_citation", limit: 4294967295
    t.string "citation_media_id", limit: 255
    t.string "citation_timecode", limit: 18
    t.datetime "indexed_at"
    t.integer "language_id"
    t.string "workflow_state", limit: 255, default: "unshared"
    t.string "doi_status", limit: 255
    t.text "properties", limit: 16777215
    t.string "media_type"
    t.integer "project_id"
    t.string "signature_original"
    t.integer "registry_references_count", default: 0
    t.string "original_content_type"
    t.integer "startpage_position"
    t.integer "translation_language_id"
    t.index ["startpage_position"], name: "index_interviews_on_startpage_position"
  end

  create_table "language_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "language_id"
    t.string "locale", limit: 255
    t.string "abbreviated", limit: 255
    t.string "name", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["language_id"], name: "index_language_translations_on_language_id"
  end

  create_table "languages", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "code", limit: 255
    t.datetime "updated_at"
  end

  create_table "map_section_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "map_section_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "label"
    t.index ["locale"], name: "index_map_section_translations_on_locale"
    t.index ["map_section_id"], name: "index_map_section_translations_on_map_section_id"
  end

  create_table "map_sections", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.decimal "corner1_lat", precision: 10, scale: 6, null: false
    t.decimal "corner1_lon", precision: 10, scale: 6, null: false
    t.decimal "corner2_lat", precision: 10, scale: 6, null: false
    t.decimal "corner2_lon", precision: 10, scale: 6, null: false
    t.integer "order", default: 0, null: false
    t.bigint "project_id", null: false
    t.index ["project_id"], name: "index_map_sections_on_project_id"
  end

  create_table "media_streams", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "project_id"
    t.string "resolution"
    t.string "path"
    t.string "media_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "metadata_field_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "metadata_field_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "label"
    t.index ["locale"], name: "index_metadata_field_translations_on_locale"
    t.index ["metadata_field_id"], name: "index_metadata_field_translations_on_metadata_field_id"
  end

  create_table "metadata_fields", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "project_id"
    t.string "name"
    t.boolean "use_as_facet"
    t.boolean "use_in_results_table"
    t.boolean "use_in_details_view"
    t.boolean "display_on_landing_page"
    t.string "ref_object_type"
    t.string "source"
    t.string "label"
    t.string "values"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "registry_reference_type_id"
    t.float "list_columns_order", default: 1.0
    t.float "facet_order", default: 1.0
    t.boolean "use_in_map_search"
    t.boolean "use_in_results_list"
    t.string "map_color", default: "#1c2d8f"
    t.boolean "use_in_metadata_import", default: false
  end

  create_table "norm_data", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "nid"
    t.integer "registry_entry_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "norm_data_provider_id"
  end

  create_table "norm_data_providers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "api_name"
    t.string "url_without_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "oauth_access_grants", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id"
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri"
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "people", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "date_of_birth", limit: 255
    t.string "gender", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "typology", limit: 255
    t.string "properties"
    t.integer "project_id"
    t.integer "registry_references_count", default: 0
    t.integer "title"
  end

  create_table "permissions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "klass", limit: 255
    t.string "action_name", limit: 255
    t.text "desc", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", limit: 255
  end

  create_table "person_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "person_id", null: false
    t.string "locale", limit: 255, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name", limit: 255
    t.string "last_name", limit: 255
    t.string "birth_name", limit: 255
    t.string "other_first_names", limit: 255
    t.string "alias_names", limit: 255
    t.text "description"
    t.index ["locale"], name: "index_person_translations_on_locale", length: 191
    t.index ["person_id"], name: "index_person_translations_on_person_id"
  end

  create_table "photo_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "photo_id"
    t.string "locale", limit: 255
    t.text "caption", limit: 4294967295
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "date"
    t.string "place"
    t.string "photographer"
    t.string "license"
    t.index ["photo_id"], name: "index_photo_translations_on_photo_id"
  end

  create_table "photos", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id"
    t.string "photo_file_name", limit: 255
    t.string "photo_content_type", limit: 255
    t.integer "photo_file_size"
    t.datetime "updated_at"
    t.string "workflow_state", limit: 255
    t.string "public_id"
  end

  create_table "project_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "project_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.text "introduction", limit: 16777215
    t.text "more_text", limit: 16777215
    t.text "landing_page_text", limit: 16777215
    t.string "display_name"
    t.index ["locale"], name: "index_project_translations_on_locale"
    t.index ["project_id"], name: "index_project_translations_on_project_id"
  end

  create_table "projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "available_locales"
    t.string "default_locale"
    t.string "view_modes"
    t.string "upload_types"
    t.string "shortname"
    t.string "domain"
    t.string "archive_domain"
    t.string "doi"
    t.string "cooperation_partner"
    t.string "leader"
    t.string "manager"
    t.string "funder_names"
    t.string "contact_email"
    t.string "smtp_server"
    t.boolean "has_newsletter"
    t.boolean "is_catalog"
    t.string "hidden_registry_entry_ids"
    t.string "pdf_registry_entry_ids"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "fullname_on_landing_page"
    t.string "cache_key_prefix", default: "cdoh"
    t.string "primary_color"
    t.string "secondary_color"
    t.string "editorial_color"
    t.boolean "has_map"
    t.integer "aspect_x", default: 16
    t.integer "aspect_y", default: 9
    t.integer "archive_id_number_length"
    t.string "hidden_transcript_registry_entry_ids"
    t.boolean "display_ohd_link", default: false
    t.integer "default_search_order", default: 0, null: false
    t.string "logged_out_visible_registry_entry_ids"
    t.string "workflow_state", default: "public", null: false
    t.boolean "show_preview_img", default: false
    t.index ["workflow_state"], name: "index_projects_on_workflow_state"
  end

  create_table "registry_entries", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "code", limit: 255
    t.string "desc", limit: 255
    t.string "latitude", limit: 255
    t.string "longitude", limit: 255
    t.string "workflow_state", limit: 255, null: false
    t.boolean "list_priority"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "registry_references_count", default: 0
    t.integer "children_count", default: 0
    t.integer "parents_count", default: 0
    t.integer "project_id"
    t.index ["code"], name: "index_registry_entries_on_code", length: 50
  end

  create_table "registry_entry_relations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_entry_id"
    t.integer "related_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "registry_entry_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "registry_entry_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.index ["locale"], name: "index_registry_entry_translations_on_locale"
    t.index ["registry_entry_id"], name: "index_registry_entry_translations_on_registry_entry_id"
  end

  create_table "registry_hierarchies", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "ancestor_id", null: false
    t.integer "descendant_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["ancestor_id", "descendant_id"], name: "index_registry_hierarchies_on_ancestor_id_and_descendant_id", unique: true
    t.index ["ancestor_id"], name: "index_registry_hierarchies_on_ancestor_id"
    t.index ["descendant_id"], name: "index_registry_hierarchies_on_descendant_id"
  end

  create_table "registry_name_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_name_id", null: false
    t.string "locale", limit: 255, null: false
    t.text "descriptor", limit: 4294967295
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["descriptor"], name: "index_registry_name_translations_on_descriptor", length: 191
    t.index ["registry_name_id", "locale"], name: "index_registry_name_translations_on_registry_name_id_and_locale", unique: true, length: { locale: 191 }
    t.index ["registry_name_id"], name: "index_registry_name_translations_on_registry_name_id"
  end

  create_table "registry_name_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "code", limit: 255
    t.string "name", limit: 255
    t.integer "order_priority"
    t.boolean "allows_multiple"
    t.boolean "mandatory"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.integer "project_id"
  end

  create_table "registry_names", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_entry_id", null: false
    t.integer "registry_name_type_id", null: false
    t.integer "name_position", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_entry_id"], name: "index_registry_names_on_registry_entry_id"
  end

  create_table "registry_reference_type_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_reference_type_id"
    t.string "locale", limit: 255
    t.string "name", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_reference_type_id"], name: "index_959822146554d9dfd5d5530d45b5cafb8c7d4067"
  end

  create_table "registry_reference_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_entry_id"
    t.string "code", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "children_only", default: false
    t.boolean "use_in_transcript", default: false
    t.integer "project_id"
    t.index ["code"], name: "index_registry_reference_types_on_code", length: 50
  end

  create_table "registry_references", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "registry_entry_id", null: false
    t.integer "ref_object_id", null: false
    t.string "ref_object_type", limit: 255, null: false
    t.integer "registry_reference_type_id"
    t.integer "ref_position", null: false
    t.string "original_descriptor", limit: 1000
    t.string "ref_details", limit: 1000
    t.string "ref_comments", limit: 1000
    t.string "ref_info", limit: 1000
    t.string "workflow_state", limit: 255, null: false
    t.integer "interview_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "archive_id"
  end

  create_table "role_permissions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "role_id"
    t.bigint "permission_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["permission_id"], name: "index_role_permissions_on_permission_id"
    t.index ["role_id"], name: "index_role_permissions_on_role_id"
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.text "desc", limit: 4294967295
    t.string "name", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
  end

  create_table "segment_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "segment_id"
    t.string "locale", limit: 255
    t.string "subheading", limit: 255
    t.string "mainheading", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "text", limit: 16777215
    t.index ["segment_id"], name: "index_segment_translations_on_segment_id"
  end

  create_table "segments", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "tape_id"
    t.string "media_id", limit: 255
    t.string "timecode", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal "duration", precision: 5, scale: 2
    t.integer "sequence_number"
    t.integer "tape_number"
    t.string "speaker", limit: 255
    t.boolean "speaker_change", default: false
    t.boolean "chapter_change", default: false
    t.string "section", limit: 255
    t.integer "interview_id"
    t.integer "speaker_id"
    t.integer "registry_references_count", default: 0
    t.integer "annotations_count", default: 0
    t.boolean "has_heading", default: false
    t.index ["interview_id"], name: "index_segments_on_interview_id"
    t.index ["media_id"], name: "index_segments_on_media_id", length: 191
  end

  create_table "taggings", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "tag_id"
    t.integer "taggable_id"
    t.string "taggable_type", limit: 255
    t.datetime "created_at"
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type"], name: "index_taggings_on_taggable_id_and_taggable_type", length: { taggable_type: 191 }
  end

  create_table "tags", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", limit: 255
  end

  create_table "tapes", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id"
    t.string "media_id", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "video"
    t.integer "duration"
    t.string "workflow_state", limit: 255, default: "digitized"
    t.string "filename", limit: 255
    t.integer "time_shift", default: 0
    t.integer "number", default: 1
    t.index ["workflow_state"], name: "index_tapes_on_workflow_state", length: 191
  end

  create_table "task_type_permissions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "task_type_id"
    t.bigint "permission_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["permission_id"], name: "index_task_type_permissions_on_permission_id"
    t.index ["task_type_id"], name: "index_task_type_permissions_on_task_type_id"
  end

  create_table "task_type_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "task_type_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "label"
    t.index ["locale"], name: "index_task_type_translations_on_locale"
    t.index ["task_type_id"], name: "index_task_type_translations_on_task_type_id"
  end

  create_table "task_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "key"
    t.string "abbreviation"
    t.boolean "use"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.text "desc", limit: 4294967295
    t.string "workflow_state", limit: 255
    t.bigint "user_id"
    t.bigint "supervisor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", limit: 255
    t.integer "user_account_id"
    t.integer "task_type_id"
    t.integer "interview_id"
    t.datetime "assigned_to_user_account_at"
    t.datetime "assigned_to_supervisor_at"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.datetime "cleared_at"
    t.datetime "restarted_at"
    t.index ["supervisor_id"], name: "index_tasks_on_supervisor_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "text_materials", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id"
    t.string "document_type", limit: 255
    t.string "document_file_name", limit: 255
    t.string "document_content_type", limit: 255
    t.integer "document_file_size"
    t.string "locale", limit: 5, default: "de", null: false
    t.index ["interview_id", "document_type", "locale"], name: "index_text_materials_unique_document", unique: true, length: { document_type: 191 }
  end

  create_table "text_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "text_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "text", limit: 16777215
    t.index ["locale"], name: "index_text_translations_on_locale"
    t.index ["text_id"], name: "index_text_translations_on_text_id"
  end

  create_table "texts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "uploaded_files", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "locale"
    t.string "type"
    t.string "ref_type"
    t.integer "ref_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "href"
    t.string "title"
  end

  create_table "usage_reports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "ip", limit: 255
    t.string "action", limit: 255, null: false
    t.string "resource_id", limit: 20
    t.integer "user_account_id"
    t.string "query", limit: 100
    t.string "facets", limit: 300
    t.datetime "logged_at", null: false
    t.datetime "created_at"
  end

  create_table "user_account_ips", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "user_account_id"
    t.string "ip", limit: 255
    t.datetime "created_at"
    t.index ["user_account_id", "ip"], name: "index_user_account_ips_on_user_account_id_and_ip", length: { ip: 191 }
  end

  create_table "user_accounts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 128, default: "", null: false
    t.string "password_salt", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.string "confirmation_token", limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip", limit: 255
    t.string "last_sign_in_ip", limit: 255
    t.string "login", limit: 255
    t.datetime "deactivated_at"
    t.datetime "reset_password_sent_at"
    t.string "unconfirmed_email", limit: 255
    t.boolean "admin"
    t.string "first_name"
    t.string "last_name"
    t.string "appellation"
    t.string "job_description"
    t.string "research_intentions"
    t.text "comments", limit: 16777215
    t.string "organization"
    t.string "homepage"
    t.string "street"
    t.string "zipcode"
    t.string "city"
    t.string "state"
    t.string "country"
    t.datetime "tos_agreed_at"
    t.string "gender"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "priv_agreement"
    t.boolean "tos_agreement"
    t.boolean "receive_newsletter"
    t.string "default_locale"
    t.text "admin_comments", limit: 16777215
    t.datetime "processed_at"
    t.datetime "activated_at"
    t.boolean "anonymized", default: false
    t.index ["confirmation_token"], name: "index_user_accounts_on_confirmation_token", unique: true, length: 191
    t.index ["reset_password_token"], name: "index_user_accounts_on_reset_password_token", unique: true, length: 191
  end

  create_table "user_contents", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "id_hash", limit: 255
    t.string "title", limit: 255
    t.string "description", limit: 300
    t.string "interview_references", limit: 255
    t.string "properties", limit: 500
    t.string "link_url", limit: 255
    t.string "type", limit: 255, null: false
    t.boolean "shared", default: false
    t.boolean "persistent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "reference_id"
    t.string "reference_type", limit: 255
    t.integer "position", default: 1
    t.string "workflow_state", limit: 255, default: "private"
    t.datetime "submitted_at"
    t.datetime "published_at"
    t.string "media_id", limit: 255
    t.integer "user_account_id"
    t.integer "project_id"
    t.index ["media_id"], name: "index_user_contents_on_media_id", length: 191
    t.index ["type", "id_hash"], name: "index_user_contents_on_type_and_id_hash", length: 191
    t.index ["user_account_id"], name: "index_user_contents_on_user_account_id"
    t.index ["user_id"], name: "index_user_contents_on_user_id"
  end

  create_table "user_registration_projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "project_id"
    t.integer "user_registration_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_account_id"
    t.datetime "activated_at"
    t.string "workflow_state"
    t.string "admin_comments"
  end

  create_table "user_registrations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "first_name", limit: 255
    t.string "last_name", limit: 255
    t.string "email", limit: 255
    t.boolean "tos_agreement"
    t.text "application_info", limit: 4294967295
    t.datetime "created_at"
    t.datetime "activated_at"
    t.integer "user_account_id"
    t.datetime "processed_at"
    t.string "default_locale", limit: 255
    t.boolean "receive_newsletter"
    t.boolean "priv_agreement", default: false
    t.datetime "updated_at"
    t.index ["email"], name: "index_user_registrations_on_workflow_state_and_email", length: 191
  end

  create_table "user_roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.integer "user_account_id"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "first_name", limit: 255
    t.string "last_name", limit: 255
    t.string "appellation", limit: 255
    t.string "job_description", limit: 255
    t.string "research_intentions", limit: 255
    t.text "comments", limit: 4294967295
    t.string "organization", limit: 255
    t.string "homepage", limit: 255
    t.string "street", limit: 255
    t.string "zipcode", limit: 255
    t.string "city", limit: 255
    t.string "state", limit: 255
    t.string "country", limit: 255
    t.datetime "tos_agreed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "admin"
    t.integer "user_account_id"
    t.integer "user_registration_id"
    t.string "gender", default: ""
    t.index ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name", length: 191
    t.index ["user_account_id"], name: "index_users_on_user_account_id"
  end

  create_table "workflow_comments", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "interview_id", null: false
    t.integer "user_id", null: false
    t.integer "parent_id"
    t.string "workflow_type", limit: 255, null: false
    t.boolean "public", default: true
    t.text "comment", limit: 4294967295
    t.string "user_initials", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_account_id"
    t.index ["interview_id", "parent_id"], name: "index_workflow_comments_on_interview_id_and_parent_id"
    t.index ["interview_id", "public"], name: "index_workflow_comments_on_interview_id_and_public"
    t.index ["interview_id"], name: "index_workflow_comments_on_interview_id"
  end

  add_foreign_key "archiving_batches", "projects"
  add_foreign_key "histories", "people"
  add_foreign_key "map_sections", "projects"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
end
