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

ActiveRecord::Schema.define(version: 2018_10_12_143618) do

  create_table "active_storage_attachments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "annotation_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "annotation_id"
    t.string "locale"
    t.text "text"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["annotation_id"], name: "index_annotation_translations_on_annotation_id"
  end

  create_table "annotations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id"
    t.string "author"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_content_id"
    t.integer "segment_id"
    t.integer "author_id"
    t.index ["interview_id"], name: "index_annotations_on_interview_id"
    t.index ["segment_id"], name: "index_annotations_on_segment_id"
  end

  create_table "biographical_entries", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "biographical_entry_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "biographical_entry_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "text"
    t.string "start_date"
    t.string "end_date"
    t.index ["biographical_entry_id"], name: "index_biographical_entry_translations_on_biographical_entry_id"
    t.index ["locale"], name: "index_biographical_entry_translations_on_locale"
  end

  create_table "checklist_items", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id", null: false
    t.integer "user_id", null: false
    t.string "item_type", null: false
    t.boolean "checked"
    t.datetime "checked_at"
    t.datetime "updated_at"
    t.index ["interview_id", "checked"], name: "index_checklist_items_on_interview_id_and_checked"
    t.index ["interview_id"], name: "index_checklist_items_on_interview_id"
  end

  create_table "collection_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "collection_id"
    t.string "locale"
    t.string "countries"
    t.string "institution"
    t.string "responsibles"
    t.text "interviewers"
    t.string "name"
    t.text "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["collection_id"], name: "index_collection_translations_on_collection_id"
  end

  create_table "collections", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "homepage"
    t.string "project_id"
  end

  create_table "contributions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id"
    t.string "contribution_type"
    t.integer "person_id"
    t.index ["interview_id"], name: "index_contributions_on_interview_id"
  end

  create_table "delayed_jobs", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "histories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_histories_on_person_id"
  end

  create_table "history_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "history_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "forced_labor_details"
    t.string "return_date"
    t.string "deportation_date"
    t.string "punishment"
    t.string "liberation_date"
    t.index ["history_id"], name: "index_history_translations_on_history_id"
    t.index ["locale"], name: "index_history_translations_on_locale"
  end

  create_table "imports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "importable_id"
    t.string "importable_type"
    t.datetime "time"
    t.string "migration"
    t.string "content", limit: 400
    t.datetime "created_at"
    t.index ["importable_id", "importable_type"], name: "index_imports_on_importable_id_and_importable_type"
  end

  create_table "interview_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "locale"
    t.text "observations"
    t.integer "interview_id"
  end

  create_table "interviews", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "archive_id"
    t.integer "collection_id"
    t.boolean "video"
    t.integer "duration"
    t.boolean "translated"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "segmented", default: false
    t.boolean "researched", default: false
    t.boolean "proofread", default: false
    t.string "interview_date"
    t.string "still_image_file_name"
    t.string "still_image_content_type"
    t.integer "still_image_file_size"
    t.datetime "still_image_updated_at"
    t.boolean "inferior_quality", default: false
    t.text "original_citation"
    t.text "translated_citation"
    t.string "citation_media_id"
    t.string "citation_timecode", limit: 18
    t.datetime "indexed_at"
    t.integer "language_id"
    t.string "workflow_state", default: "unshared"
  end

  create_table "language_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "language_id"
    t.string "locale"
    t.string "abbreviated"
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["language_id"], name: "index_language_translations_on_language_id"
  end

  create_table "languages", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "code"
  end

  create_table "people", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "date_of_birth"
    t.string "gender"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "typology"
  end

  create_table "person_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "person_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "birth_name"
    t.string "other_first_names"
    t.string "alias_names"
    t.index ["locale"], name: "index_person_translations_on_locale"
    t.index ["person_id"], name: "index_person_translations_on_person_id"
  end

  create_table "photo_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "photo_id"
    t.string "locale"
    t.text "caption"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["photo_id"], name: "index_photo_translations_on_photo_id"
  end

  create_table "photos", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id"
    t.string "photo_file_name"
    t.string "photo_content_type"
    t.integer "photo_file_size"
    t.datetime "photo_updated_at"
  end

  create_table "registry_entries", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "entry_code"
    t.string "entry_desc"
    t.string "latitude"
    t.string "longitude"
    t.string "workflow_state", null: false
    t.boolean "list_priority"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_hierarchies", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "ancestor_id", null: false
    t.integer "descendant_id", null: false
    t.boolean "direct", null: false
    t.integer "count", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["ancestor_id", "descendant_id"], name: "index_registry_hierarchies_on_ancestor_id_and_descendant_id", unique: true
    t.index ["ancestor_id"], name: "index_registry_hierarchies_on_ancestor_id"
    t.index ["descendant_id"], name: "index_registry_hierarchies_on_descendant_id"
  end

  create_table "registry_name_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin", force: :cascade do |t|
    t.integer "registry_name_id", null: false
    t.string "locale", null: false
    t.text "descriptor"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "notes"
    t.index ["descriptor"], name: "index_registry_name_translations_on_descriptor", length: 255
    t.index ["registry_name_id", "locale"], name: "index_registry_name_translations_on_registry_name_id_and_locale", unique: true
    t.index ["registry_name_id"], name: "index_registry_name_translations_on_registry_name_id"
  end

  create_table "registry_name_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "code"
    t.string "name"
    t.integer "order_priority"
    t.boolean "allows_multiple"
    t.boolean "mandatory"
  end

  create_table "registry_names", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "registry_entry_id", null: false
    t.integer "registry_name_type_id", null: false
    t.integer "name_position", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_entry_id", "registry_name_type_id", "name_position"], name: "registry_names_unique_types_and_positions", unique: true
  end

  create_table "registry_reference_type_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "registry_reference_type_id"
    t.string "locale"
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_reference_type_id"], name: "index_959822146554d9dfd5d5530d45b5cafb8c7d4067"
  end

  create_table "registry_reference_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "registry_entry_id"
    t.string "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_references", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "registry_entry_id", null: false
    t.integer "ref_object_id", null: false
    t.string "ref_object_type", null: false
    t.integer "registry_reference_type_id"
    t.integer "ref_position", null: false
    t.string "original_descriptor", limit: 1000
    t.string "ref_details", limit: 1000
    t.string "ref_comments", limit: 1000
    t.string "ref_info", limit: 1000
    t.string "workflow_state", null: false
    t.integer "interview_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "segment_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "segment_id"
    t.string "locale"
    t.string "subheading"
    t.string "mainheading"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "text"
    t.index ["segment_id"], name: "index_segment_translations_on_segment_id"
  end

  create_table "segments", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "tape_id"
    t.string "media_id"
    t.string "timecode"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal "duration", precision: 5, scale: 2
    t.integer "sequence_number"
    t.integer "tape_number"
    t.string "speaker"
    t.boolean "speaker_change", default: false
    t.boolean "chapter_change", default: false
    t.string "section"
    t.integer "interview_id"
    t.integer "speaker_id"
    t.index ["interview_id"], name: "index_segments_on_interview_id"
    t.index ["media_id"], name: "index_segments_on_media_id"
  end

  create_table "taggings", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "tag_id"
    t.integer "taggable_id"
    t.string "taggable_type"
    t.datetime "created_at"
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type"], name: "index_taggings_on_taggable_id_and_taggable_type"
  end

  create_table "tags", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
  end

  create_table "tapes", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id"
    t.string "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "video"
    t.integer "duration"
    t.string "workflow_state", default: "digitized"
    t.string "filename"
    t.index ["workflow_state"], name: "index_tapes_on_workflow_state"
  end

  create_table "text_materials", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id"
    t.string "document_type"
    t.string "document_file_name"
    t.string "document_content_type"
    t.integer "document_file_size"
    t.string "locale", limit: 5, default: "de", null: false
    t.index ["interview_id", "document_type", "locale"], name: "index_text_materials_unique_document", unique: true
  end

  create_table "usage_reports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "ip"
    t.string "action", null: false
    t.string "resource_id", limit: 20
    t.integer "user_account_id"
    t.string "query", limit: 100
    t.string "facets", limit: 300
    t.datetime "logged_at", null: false
    t.datetime "created_at"
  end

  create_table "user_account_ips", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "user_account_id"
    t.string "ip"
    t.datetime "created_at"
    t.index ["user_account_id", "ip"], name: "index_user_account_ips_on_user_account_id_and_ip"
  end

  create_table "user_accounts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", limit: 128, default: "", null: false
    t.string "password_salt", default: "", null: false
    t.string "reset_password_token"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "remember_token"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "login"
    t.datetime "deactivated_at"
    t.datetime "reset_password_sent_at"
    t.index ["confirmation_token"], name: "index_user_accounts_on_confirmation_token", unique: true
    t.index ["login"], name: "index_user_accounts_on_login", unique: true
    t.index ["reset_password_token"], name: "index_user_accounts_on_reset_password_token", unique: true
  end

  create_table "user_contents", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "user_id"
    t.string "id_hash"
    t.string "title"
    t.string "description", limit: 300
    t.string "interview_references"
    t.string "properties", limit: 500
    t.string "link_url"
    t.string "type", null: false
    t.boolean "shared", default: false
    t.boolean "persistent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "reference_id"
    t.string "reference_type"
    t.integer "position", default: 1
    t.string "workflow_state", default: "private"
    t.datetime "submitted_at"
    t.datetime "published_at"
    t.string "media_id"
    t.index ["media_id"], name: "index_user_contents_on_media_id"
    t.index ["type", "id_hash"], name: "index_user_contents_on_type_and_id_hash"
    t.index ["user_id"], name: "index_user_contents_on_user_id"
  end

  create_table "user_registrations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.boolean "tos_agreement"
    t.text "application_info"
    t.string "workflow_state"
    t.datetime "created_at"
    t.datetime "activated_at"
    t.string "admin_comments"
    t.integer "user_account_id"
    t.string "login"
    t.datetime "processed_at"
    t.string "default_locale"
    t.boolean "receive_newsletter"
    t.boolean "newsletter_signup", default: false
    t.boolean "priv_agreement", default: false
    t.index ["email"], name: "index_user_registrations_on_email"
    t.index ["workflow_state", "email"], name: "index_user_registrations_on_workflow_state_and_email"
    t.index ["workflow_state"], name: "index_user_registrations_on_workflow_state"
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "appellation"
    t.string "job_description"
    t.string "research_intentions"
    t.text "comments"
    t.string "admin_comments"
    t.string "organization"
    t.string "homepage"
    t.string "street"
    t.string "zipcode"
    t.string "city"
    t.string "state"
    t.string "country"
    t.datetime "tos_agreed_at"
    t.string "status"
    t.datetime "processed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "admin"
    t.integer "user_account_id"
    t.integer "user_registration_id"
    t.datetime "data_changed_at"
    t.index ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name"
    t.index ["status"], name: "index_users_on_status"
    t.index ["user_account_id"], name: "index_users_on_user_account_id"
  end

  create_table "workflow_comments", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "interview_id", null: false
    t.integer "user_id", null: false
    t.integer "parent_id"
    t.string "workflow_type", null: false
    t.boolean "public", default: true
    t.text "comment"
    t.string "user_initials", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["interview_id", "parent_id"], name: "index_workflow_comments_on_interview_id_and_parent_id"
    t.index ["interview_id", "public"], name: "index_workflow_comments_on_interview_id_and_public"
    t.index ["interview_id"], name: "index_workflow_comments_on_interview_id"
  end

  add_foreign_key "histories", "people"
end
