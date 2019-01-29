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

ActiveRecord::Schema.define(version: 2019_01_25_100041) do

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

  create_table "annotation_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "annotation_section_id", null: false
    t.integer "annotation_id", null: false
    t.string "locale", limit: 128, null: false
    t.text "text", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["annotation_section_id"], name: "annotation_id"
    t.index ["annotation_section_id"], name: "annotation_section_id"
  end

  create_table "annotations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "interview_section_id", null: false
    t.integer "interview_id", null: false
    t.integer "section_id", null: false
    t.string "author", limit: 512, null: false
    t.integer "segment_id", null: false
    t.integer "user_content_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "author_id"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["section_id"], name: "section_id"
  end

  create_table "biographical_entries", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "workflow_state", default: "unshared"
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

  create_table "checklist_items", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "interview_id", null: false
    t.integer "user_id", null: false
    t.string "item_type", null: false
    t.boolean "checked"
    t.datetime "checked_at"
    t.datetime "updated_at"
    t.index ["interview_id", "checked"], name: "index_checklist_items_on_interview_id_and_checked"
    t.index ["interview_id"], name: "index_checklist_items_on_interview_id"
  end

  create_table "collection_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "collection_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "institution"
    t.string "countries"
    t.text "interviewers"
    t.string "responsibles"
    t.text "notes"
    t.index ["collection_id"], name: "index_collection_translations_on_collection_id"
    t.index ["locale"], name: "index_collection_translations_on_locale"
  end

  create_table "collections", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.string "countries"
    t.string "institution"
    t.string "responsibles"
    t.text "notes"
    t.text "interviewers"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "homepage"
    t.string "project_id"
  end

  create_table "contributions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.bigint "interview_section_id", null: false
    t.integer "interview_id", default: 0
    t.string "contribution_type", null: false
    t.string "person_dedalo_id", null: false
    t.string "person_id", default: "0"
    t.index ["contribution_type", "interview_id"], name: "index_contributions_on_contribution_type_and_interview_id"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["person_dedalo_id"], name: "person_dedalo_id", length: 128
    t.index ["person_id"], name: "index_contributions_on_person_id"
  end

  create_table "delayed_jobs", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
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

  create_table "histories", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "section_id", null: false
    t.string "person_dedalo_id", limit: 125
    t.string "person_id", limit: 125
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["person_dedalo_id"], name: "person_dedalo_id"
    t.index ["person_dedalo_id"], name: "person_id"
  end

  create_table "history_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "history_id", null: false
    t.string "person_dedalo_id", limit: 128, null: false
    t.string "person_id", limit: 128
    t.string "locale", limit: 128
    t.text "forced_labor_details", limit: 16777215
    t.string "return_date", limit: 256
    t.string "deportation_date", limit: 256
    t.text "punishment", limit: 255
    t.string "liberation_date", limit: 256
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["person_dedalo_id"], name: "person_dedalo_id"
    t.index ["person_dedalo_id"], name: "person_id"
  end

  create_table "interview_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "locale"
    t.text "observations"
    t.integer "interview_id"
    t.integer "interview_section_id"
  end

  create_table "interviews", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Self-generated table in Dédalo4 for diffusion", force: :cascade do |t|
    t.bigint "section_id", comment: "Campo creado automáticamente para guardar section_id (sin correspondencia en estructura)", unsigned: true
    t.string "lang", limit: 8, comment: "Campo creado automáticamente para guardar el idioma (sin correspondencia en estructura)"
    t.string "archive_id", comment: "Código - oh14"
    t.integer "collection_id", comment: "Proyecto - oh22", unsigned: true
    t.integer "video", limit: 1, comment: "Audiovisual - oh25"
    t.integer "duration", comment: "Audiovisual - oh25", unsigned: true
    t.integer "translated", limit: 1, comment: "Estado - oh28"
    t.datetime "created_at", comment: "ID - oh62"
    t.datetime "updated_at", comment: "ID - oh62"
    t.integer "segmented", limit: 1, comment: "ID - oh62"
    t.integer "researched", limit: 1, comment: "ID - oh62"
    t.integer "proofread", limit: 1, comment: "ID - oh62"
    t.string "interview_date", comment: "Audiovisual - oh25"
    t.string "still_image_file_name", comment: "Imagen identificativa - oh17"
    t.string "still_image_content_type", comment: "Imagen identificativa - oh17"
    t.integer "still_image_file_size", comment: "Imagen identificativa - oh17", unsigned: true
    t.datetime "still_image_updated_at", comment: "Imagen identificativa - oh17"
    t.integer "inferior_quality", limit: 1, comment: "ID - oh62"
    t.text "original_citation", comment: "ID - oh62"
    t.text "translated_citation", comment: "ID - oh62"
    t.string "citation_media_id", comment: "ID - oh62"
    t.string "citation_timecode", limit: 18, comment: "ID - oh62"
    t.datetime "indexed_at", comment: "Audiovisual - oh25"
    t.integer "language_id", comment: "Idioma - oh20", unsigned: true
    t.integer "photos", comment: "image - oh26", unsigned: true
    t.string "workflow_state", default: "unshared"
    t.index ["archive_id"], name: "archive_id"
    t.index ["citation_media_id"], name: "citation_media_id"
    t.index ["citation_timecode"], name: "citation_timecode"
    t.index ["collection_id"], name: "collection_id"
    t.index ["created_at"], name: "created_at"
    t.index ["duration"], name: "duration"
    t.index ["indexed_at"], name: "indexed_at"
    t.index ["inferior_quality"], name: "inferior_quality"
    t.index ["interview_date"], name: "interview_date"
    t.index ["lang"], name: "lang"
    t.index ["language_id"], name: "language_id"
    t.index ["original_citation"], name: "original_citation", type: :fulltext
    t.index ["proofread"], name: "proofread"
    t.index ["researched"], name: "researched"
    t.index ["section_id", "lang"], name: "section_id_lang_constrain", unique: true
    t.index ["section_id"], name: "section_id"
    t.index ["segmented"], name: "segmented"
    t.index ["still_image_content_type"], name: "still_image_content_type"
    t.index ["still_image_file_name"], name: "still_image_file_name"
    t.index ["still_image_file_size"], name: "still_image_file_size"
    t.index ["still_image_updated_at"], name: "still_image_updated_at"
    t.index ["translated"], name: "translated"
    t.index ["translated_citation"], name: "translated_citation", type: :fulltext
    t.index ["updated_at"], name: "updated_at"
    t.index ["video"], name: "video"
  end

  create_table "language_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "language_id", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "abbreviated"
    t.string "name"
    t.index ["language_id"], name: "index_language_translations_on_language_id"
    t.index ["locale"], name: "index_language_translations_on_locale"
  end

  create_table "languages", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
  end

  create_table "people", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually", force: :cascade do |t|
    t.string "person_dedalo_id", limit: 160
    t.string "date_of_birth", limit: 160
    t.string "gender", limit: 160
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "typology", limit: 1024
    t.index ["person_dedalo_id"], name: "person_dedalo_id"
  end

  create_table "permissions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "controller"
    t.string "action"
    t.text "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
  end

  create_table "person_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually", force: :cascade do |t|
    t.string "person_dedalo_id", limit: 160, null: false
    t.bigint "person_id", null: false
    t.string "locale", limit: 160
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "first_name", limit: 600
    t.string "last_name", limit: 600
    t.string "birth_name", limit: 600
    t.string "other_first_names", limit: 600
    t.string "alias_names", limit: 600
    t.index ["person_dedalo_id"], name: "person_dedalo_id"
    t.index ["person_id"], name: "index_person_translations_on_person_id"
  end

  create_table "photo_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "photo_dedalo_id"
    t.integer "photo_id"
    t.string "locale", limit: 128
    t.text "caption"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["photo_dedalo_id"], name: "photo_dedalo_id"
  end

  create_table "photos", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "photo_dedalo_id", null: false
    t.integer "interview_section_id", null: false
    t.integer "interview_id"
    t.string "photo_file_name", limit: 256
    t.string "photo_content_type", limit: 1024
    t.integer "photo_file_size"
    t.datetime "updated_at"
    t.string "workflow_state"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["photo_dedalo_id"], name: "photo_dedalo_id"
  end

  create_table "registry_entries", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "entry_dedalo_code", limit: 256, null: false
    t.string "entry_code", limit: 128
    t.string "entry_desc", limit: 128
    t.string "latitude"
    t.string "longitude"
    t.string "workflow_state", limit: 128, default: "public", null: false
    t.integer "list_priority", limit: 1, default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["entry_code"], name: "entry_code"
    t.index ["entry_dedalo_code"], name: "entry_dedalo_code", length: 255
  end

  create_table "registry_entry_relations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "registry_entry_id"
    t.integer "related_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "registry_hierarchies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "ancestor_dedalo_id", limit: 128, null: false
    t.string "descendant_dedalo_id", limit: 128, null: false
    t.string "ancestor_id", limit: 128
    t.string "descendant_id", limit: 128
    t.integer "direct", limit: 1, default: 0
    t.integer "count", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["ancestor_dedalo_id"], name: "ancestor_dedalo_id"
    t.index ["ancestor_id"], name: "ancestor_id"
  end

  create_table "registry_name_translations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "registry_name_dedalo_id", limit: 128, null: false
    t.string "registry_name_id", limit: 128
    t.string "locale", limit: 128
    t.text "descriptor", limit: 16777215
    t.text "notes", limit: 16777215
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_name_dedalo_id"], name: "registry_name_dedalo_id"
    t.index ["registry_name_id"], name: "registry_name_id"
  end

  create_table "registry_name_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "code", limit: 128
    t.string "name", limit: 256
    t.integer "order_priority"
    t.integer "allows_multiple", limit: 1
    t.integer "mandatory", limit: 1
  end

  create_table "registry_names", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "registry_entry_dedalo_id", limit: 128, null: false
    t.string "registry_name_type_dedalo_id", limit: 128, null: false
    t.string "registry_entry_id", limit: 128
    t.string "registry_name_type_id", limit: 128
    t.integer "name_position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["registry_entry_dedalo_id"], name: "registry_entry_dedalo_id"
    t.index ["registry_entry_id"], name: "registry_entry_id"
  end

  create_table "registry_reference_type_translations", id: false, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "registry_reference_type_id"
    t.string "locale", limit: 20
    t.string "name", limit: 20
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_reference_types", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "registry_entry_id"
    t.string "code", limit: 20
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_references", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "dedalo_rsc167_section_id", null: false
    t.integer "registry_entry_id"
    t.string "registry_entry_dedalo_id", limit: 512
    t.string "ref_object_type", default: "Segment"
    t.integer "ref_object_id"
    t.integer "registry_reference_type_id"
    t.integer "ref_position"
    t.string "original_descriptor", limit: 1000
    t.string "ref_details", limit: 1000
    t.string "ref_comments", limit: 1000
    t.string "ref_info", limit: 1000
    t.string "workflow_state", default: "checked"
    t.integer "interview_section_id"
    t.integer "interview_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["dedalo_rsc167_section_id"], name: "dedalo_rsc167_section_id"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["ref_object_id"], name: "index_registry_references_on_ref_object_id"
    t.index ["ref_object_type", "ref_object_id"], name: "index_registry_references_on_ref_object_type_and_ref_object_id"
    t.index ["ref_object_type"], name: "index_registry_references_on_ref_object_type"
    t.index ["registry_entry_dedalo_id"], name: "registry_entry_dedalo_id", length: 255
    t.index ["registry_entry_id"], name: "index_registry_references_on_registry_entry_id"
  end

  create_table "role_permissions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "role_id"
    t.bigint "permission_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["permission_id"], name: "index_role_permissions_on_permission_id"
    t.index ["role_id"], name: "index_role_permissions_on_role_id"
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "desc"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "segment_translations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "section_id"
    t.integer "segment_id"
    t.string "locale", limit: 128
    t.string "mainheading", limit: 1000
    t.string "subheading", limit: 1000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "text", limit: 4000
    t.index ["section_id"], name: "section_id"
  end

  create_table "segments", id: :bigint, unsigned: true, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "section_id"
    t.integer "tape_id"
    t.string "media_id", limit: 160
    t.string "timecode", limit: 160
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal "duration", precision: 5, scale: 2
    t.integer "sequence_number"
    t.integer "tape_number"
    t.string "speaker", limit: 256
    t.integer "speaker_id"
    t.boolean "speaker_change"
    t.boolean "chapter_change"
    t.integer "note_section_id"
    t.string "section", limit: 160
    t.integer "interview_section_id"
    t.string "term_id", limit: 11264
    t.integer "interview_id"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["section_id"], name: "section_id"
    t.index ["term_id"], name: "term_id", length: 255
  end

  create_table "tapes", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually", force: :cascade do |t|
    t.integer "section_id"
    t.integer "interview_section_id"
    t.string "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "video"
    t.integer "duration"
    t.integer "interview_id"
    t.integer "tape_number"
    t.string "workflow_state", default: "digitized"
    t.string "filename"
    t.index ["interview_section_id"], name: "interview_section_id"
    t.index ["section_id"], name: "section_id"
    t.index ["workflow_state"], name: "index_tapes_on_workflow_state"
  end

  create_table "tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "authorized_type"
    t.string "authorized_id"
    t.text "desc"
    t.string "workflow_state"
    t.bigint "user_id"
    t.bigint "supervisor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["supervisor_id"], name: "index_tasks_on_supervisor_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "usage_reports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "ip"
    t.string "action", null: false
    t.string "resource_id", limit: 20
    t.integer "user_account_id"
    t.string "query", limit: 100
    t.string "facets", limit: 300
    t.datetime "logged_at", null: false
    t.datetime "created_at"
  end

  create_table "user_account_ips", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "user_account_id"
    t.string "ip"
    t.datetime "created_at"
    t.index ["user_account_id", "ip"], name: "index_user_account_ips_on_user_account_id_and_ip"
  end

  create_table "user_accounts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "login", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "password_salt"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "authentication_token"
    t.datetime "deactivated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["login", "deactivated_at"], name: "index_user_accounts_on_login_and_deactivated_at"
    t.index ["login"], name: "index_user_accounts_on_login", unique: true
  end

  create_table "user_contents", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
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
    t.string "media_id"
    t.datetime "submitted_at"
    t.datetime "published_at"
    t.index ["media_id"], name: "index_user_contents_on_media_id"
    t.index ["type", "id_hash"], name: "index_user_contents_on_type_and_id_hash"
    t.index ["user_id"], name: "index_user_contents_on_user_id"
  end

  create_table "user_registrations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.boolean "tos_agreement"
    t.text "application_info"
    t.string "workflow_state"
    t.string "admin_comments"
    t.integer "user_account_id"
    t.string "login"
    t.datetime "processed_at"
    t.string "default_locale"
    t.boolean "receive_newsletter"
    t.boolean "newsletter_signup"
    t.boolean "priv_agreement"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
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

  create_table "workflow_comments", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
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

end
