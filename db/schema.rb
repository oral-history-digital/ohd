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

ActiveRecord::Schema.define(version: 20170421135917) do

  create_table "annotation_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "annotation_id"
    t.string   "locale"
    t.text     "text",          limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["annotation_id"], name: "index_annotation_translations_on_annotation_id", using: :btree
  end

  create_table "annotations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "interview_id"
    t.string   "author"
    t.string   "media_id",        null: false
    t.string   "timecode",        null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_content_id"
    t.integer  "segment_id"
    t.index ["interview_id"], name: "index_annotations_on_interview_id", using: :btree
    t.index ["media_id"], name: "index_annotations_on_media_id", using: :btree
    t.index ["segment_id"], name: "index_annotations_on_segment_id", using: :btree
  end

  create_table "collection_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "collection_id"
    t.string   "locale"
    t.text     "interviewers",  limit: 65535
    t.string   "countries"
    t.string   "institution"
    t.text     "notes",         limit: 65535
    t.string   "responsibles"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["collection_id"], name: "index_collection_translations_on_collection_id", using: :btree
  end

  create_table "collections", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "homepage"
    t.string   "project_id"
  end

  create_table "contributions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "interview_id"
    t.integer "contributor_id"
    t.string  "contribution_type"
    t.index ["interview_id"], name: "index_contributions_on_interview_id", using: :btree
  end

  create_table "contributor_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "contributor_id"
    t.string   "locale"
    t.string   "last_name"
    t.string   "first_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["contributor_id"], name: "index_contributor_translations_on_contributor_id", using: :btree
  end

  create_table "contributors", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.boolean "interview",     default: false
    t.boolean "camera",        default: false
    t.boolean "transcription", default: false
    t.boolean "translation",   default: false
    t.boolean "proofreading",  default: false
    t.boolean "segmentation",  default: false
    t.boolean "documentation", default: false
    t.boolean "other",         default: false
  end

  create_table "imports", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "importable_id"
    t.string   "importable_type"
    t.datetime "time"
    t.string   "migration"
    t.string   "content",         limit: 400
    t.datetime "created_at"
    t.index ["importable_id", "importable_type"], name: "index_imports_on_importable_id_and_importable_type", using: :btree
  end

  create_table "interview_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "interview_id"
    t.string   "locale"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "other_first_names"
    t.string   "return_date"
    t.string   "birth_name"
    t.text     "forced_labor_details", limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "transcriptors"
    t.string   "translators"
    t.text     "researchers",          limit: 65535
    t.string   "interviewers"
    t.string   "proofreaders"
    t.string   "segmentators"
    t.index ["interview_id"], name: "index_interview_translations_on_interview_id", using: :btree
  end

  create_table "interviews", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "archive_id"
    t.integer  "collection_id"
    t.boolean  "gender"
    t.string   "date_of_birth"
    t.boolean  "video"
    t.integer  "duration"
    t.boolean  "translated"
    t.string   "deportation_date"
    t.string   "punishment"
    t.string   "liberation_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "segmented",                              default: false
    t.boolean  "researched",                             default: false
    t.boolean  "proofread",                              default: false
    t.text     "alias_names",              limit: 65535
    t.string   "interview_date"
    t.string   "still_image_file_name"
    t.string   "still_image_content_type"
    t.integer  "still_image_file_size"
    t.datetime "still_image_updated_at"
    t.boolean  "inferior_quality",                       default: false
    t.text     "original_citation",        limit: 65535
    t.text     "translated_citation",      limit: 65535
    t.string   "citation_media_id"
    t.string   "citation_timecode",        limit: 18
    t.datetime "indexed_at"
    t.integer  "language_id"
  end

  create_table "language_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "language_id"
    t.string   "locale"
    t.string   "abbreviated"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["language_id"], name: "index_language_translations_on_language_id", using: :btree
  end

  create_table "languages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "code"
  end

  create_table "photo_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "photo_id"
    t.string   "locale"
    t.text     "caption",    limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["photo_id"], name: "index_photo_translations_on_photo_id", using: :btree
  end

  create_table "photos", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "interview_id"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
  end

  create_table "registry_entries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "entry_code"
    t.string   "entry_desc"
    t.string   "latitude"
    t.string   "longitude"
    t.string   "workflow_state", null: false
    t.boolean  "list_priority"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_hierarchies", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "ancestor_id",   null: false
    t.integer  "descendant_id", null: false
    t.boolean  "direct",        null: false
    t.integer  "count",         null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["ancestor_id", "descendant_id"], name: "index_registry_hierarchies_on_ancestor_id_and_descendant_id", unique: true, using: :btree
    t.index ["ancestor_id"], name: "index_registry_hierarchies_on_ancestor_id", using: :btree
    t.index ["descendant_id"], name: "index_registry_hierarchies_on_descendant_id", using: :btree
  end

  create_table "registry_name_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin" do |t|
    t.integer  "registry_name_id",               null: false
    t.string   "locale",                         null: false
    t.text     "descriptor",       limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["descriptor"], name: "index_registry_name_translations_on_descriptor", length: { descriptor: 255 }, using: :btree
    t.index ["registry_name_id", "locale"], name: "index_registry_name_translations_on_registry_name_id_and_locale", unique: true, using: :btree
    t.index ["registry_name_id"], name: "index_registry_name_translations_on_registry_name_id", using: :btree
  end

  create_table "registry_name_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string  "code"
    t.string  "name"
    t.integer "order_priority"
    t.boolean "allows_multiple"
    t.boolean "mandatory"
  end

  create_table "registry_names", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "registry_entry_id",     null: false
    t.integer  "registry_name_type_id", null: false
    t.integer  "name_position",         null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_entry_id", "registry_name_type_id", "name_position"], name: "registry_names_unique_types_and_positions", unique: true, using: :btree
  end

  create_table "registry_reference_type_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "registry_reference_type_id"
    t.string   "locale"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_reference_type_id"], name: "index_959822146554d9dfd5d5530d45b5cafb8c7d4067", using: :btree
  end

  create_table "registry_reference_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "registry_entry_id"
    t.string  "code"
  end

  create_table "registry_references", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "registry_entry_id",                       null: false
    t.integer  "ref_object_id",                           null: false
    t.string   "ref_object_type",                         null: false
    t.integer  "registry_reference_type_id"
    t.integer  "ref_position",                            null: false
    t.string   "original_descriptor",        limit: 1000
    t.string   "ref_details",                limit: 1000
    t.string   "ref_comments",               limit: 1000
    t.string   "ref_info",                   limit: 1000
    t.string   "workflow_state",                          null: false
    t.integer  "interview_id",                            null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "segment_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "segment_id"
    t.string   "locale"
    t.string   "mainheading"
    t.string   "subheading"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["segment_id"], name: "index_segment_translations_on_segment_id", using: :btree
  end

  create_table "segments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "tape_id"
    t.string   "media_id"
    t.string   "timecode"
    t.string   "transcript",      limit: 2000
    t.string   "translation",     limit: 2000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "duration",                     precision: 5, scale: 2
    t.integer  "sequence_number"
    t.integer  "tape_number"
    t.string   "speaker"
    t.boolean  "speaker_change",                                       default: false
    t.boolean  "chapter_change",                                       default: false
    t.string   "section"
    t.integer  "interview_id"
    t.index ["interview_id", "section"], name: "index_segments_on_interview_id_and_section", using: :btree
    t.index ["media_id"], name: "index_segments_on_media_id", using: :btree
    t.index ["tape_id"], name: "index_segments_on_tape_id", using: :btree
  end

  create_table "taggings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at"
    t.index ["tag_id"], name: "index_taggings_on_tag_id", using: :btree
    t.index ["taggable_id", "taggable_type"], name: "index_taggings_on_taggable_id_and_taggable_type", using: :btree
  end

  create_table "tags", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
  end

  create_table "tapes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "interview_id"
    t.string   "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "video"
    t.integer  "duration"
  end

  create_table "text_materials", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "interview_id"
    t.string  "document_type"
    t.string  "document_file_name"
    t.string  "document_content_type"
    t.integer "document_file_size"
    t.string  "locale",                limit: 5, default: "de", null: false
    t.index ["interview_id", "document_type", "locale"], name: "index_text_materials_unique_document", unique: true, using: :btree
  end

  create_table "usage_reports", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "ip"
    t.string   "action",                      null: false
    t.string   "resource_id",     limit: 20
    t.integer  "user_account_id"
    t.string   "query",           limit: 100
    t.string   "facets",          limit: 300
    t.datetime "logged_at",                   null: false
    t.datetime "created_at"
  end

  create_table "user_account_ips", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_account_id"
    t.string   "ip"
    t.datetime "created_at"
    t.index ["user_account_id", "ip"], name: "index_user_account_ips_on_user_account_id_and_ip", using: :btree
  end

  create_table "user_accounts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "email",                              default: "", null: false
    t.string   "encrypted_password",     limit: 128, default: "", null: false
    t.string   "password_salt",                      default: "", null: false
    t.string   "reset_password_token"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "login"
    t.datetime "deactivated_at"
    t.datetime "reset_password_sent_at"
    t.index ["confirmation_token"], name: "index_user_accounts_on_confirmation_token", unique: true, using: :btree
    t.index ["login"], name: "index_user_accounts_on_login", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_user_accounts_on_reset_password_token", unique: true, using: :btree
  end

  create_table "user_contents", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.string   "id_hash"
    t.string   "title"
    t.string   "description",          limit: 300
    t.string   "interview_references"
    t.string   "properties",           limit: 500
    t.string   "link_url"
    t.string   "type",                                                 null: false
    t.boolean  "shared",                           default: false
    t.boolean  "persistent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "reference_id"
    t.string   "reference_type"
    t.integer  "position",                         default: 1
    t.datetime "submitted_at"
    t.datetime "published_at"
    t.string   "workflow_state",                   default: "private"
    t.string   "media_id"
    t.index ["media_id"], name: "index_user_contents_on_media_id", using: :btree
    t.index ["type", "id_hash"], name: "index_user_contents_on_type_and_id_hash", using: :btree
    t.index ["user_id"], name: "index_user_contents_on_user_id", using: :btree
  end

  create_table "user_registrations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.boolean  "tos_agreement"
    t.text     "application_info",   limit: 65535
    t.string   "workflow_state"
    t.datetime "created_at"
    t.datetime "activated_at"
    t.string   "admin_comments"
    t.integer  "user_account_id"
    t.string   "login"
    t.datetime "processed_at"
    t.string   "default_locale"
    t.boolean  "receive_newsletter"
    t.boolean  "newsletter_signup",                default: false
    t.boolean  "priv_agreement",                   default: false
    t.index ["email"], name: "index_user_registrations_on_email", using: :btree
    t.index ["workflow_state", "email"], name: "index_user_registrations_on_workflow_state_and_email", using: :btree
    t.index ["workflow_state"], name: "index_user_registrations_on_workflow_state", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "appellation"
    t.string   "job_description"
    t.string   "research_intentions"
    t.text     "comments",             limit: 65535
    t.string   "admin_comments"
    t.string   "organization"
    t.string   "homepage"
    t.string   "street"
    t.string   "zipcode"
    t.string   "city"
    t.string   "state"
    t.string   "country"
    t.datetime "tos_agreed_at"
    t.string   "status"
    t.datetime "processed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin"
    t.integer  "user_account_id"
    t.integer  "user_registration_id"
    t.datetime "data_changed_at"
    t.index ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name", using: :btree
    t.index ["status"], name: "index_users_on_status", using: :btree
    t.index ["user_account_id"], name: "index_users_on_user_account_id", using: :btree
  end

end
