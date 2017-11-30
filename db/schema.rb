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

ActiveRecord::Schema.define(version: 20171129100716) do

  create_table "annotation_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "annotation_section_id",               null: false
    t.integer  "annotation_id",                       null: false
    t.string   "locale",                limit: 128,   null: false
    t.text     "text",                  limit: 65535, null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["annotation_section_id"], name: "annotation_id", using: :btree
    t.index ["annotation_section_id"], name: "annotation_section_id", using: :btree
  end

  create_table "annotations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "interview_section_id",             null: false
    t.integer  "interview_id",                     null: false
    t.integer  "section_id",                       null: false
    t.string   "author",               limit: 512, null: false
    t.string   "media_id",             limit: 512, null: false
    t.string   "timecode",             limit: 512, null: false
    t.integer  "segment_id",                       null: false
    t.integer  "user_content_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["section_id"], name: "section_id", using: :btree
  end

  create_table "collection_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "collection_id",               null: false
    t.string   "locale",                      null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "name"
    t.string   "institution"
    t.string   "countries"
    t.text     "interviewers",  limit: 65535
    t.string   "responsibles"
    t.text     "notes",         limit: 65535
    t.index ["collection_id"], name: "index_collection_translations_on_collection_id", using: :btree
    t.index ["locale"], name: "index_collection_translations_on_locale", using: :btree
  end

  create_table "collections", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name"
    t.string   "countries"
    t.string   "institution"
    t.string   "responsibles"
    t.text     "notes",        limit: 65535
    t.text     "interviewers", limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "homepage"
    t.string   "project_id"
  end

  create_table "contributions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.bigint  "interview_section_id",               null: false
    t.integer "interview_id",         default: 0
    t.string  "contribution_type",                  null: false
    t.string  "person_dedalo_id",                   null: false
    t.string  "person_id",            default: "0"
    t.index ["contribution_type", "interview_id"], name: "index_contributions_on_contribution_type_and_interview_id", using: :btree
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["person_dedalo_id"], name: "person_dedalo_id", length: { person_dedalo_id: 128 }, using: :btree
    t.index ["person_id"], name: "index_contributions_on_person_id", using: :btree
  end

  create_table "histories", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "section_id",                   null: false
    t.string   "person_dedalo_id", limit: 125
    t.string   "person_id",        limit: 125
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["person_dedalo_id"], name: "person_dedalo_id", using: :btree
    t.index ["person_dedalo_id"], name: "person_id", using: :btree
  end

  create_table "history_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "history_id",                            null: false
    t.string   "person_dedalo_id",     limit: 128,      null: false
    t.string   "person_id",            limit: 128
    t.string   "locale",               limit: 128
    t.text     "forced_labor_details", limit: 16777215
    t.string   "return_date",          limit: 256
    t.string   "deportation_date",     limit: 256
    t.text     "punishment",           limit: 255
    t.string   "liberation_date",      limit: 256
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["person_dedalo_id"], name: "person_dedalo_id", using: :btree
    t.index ["person_dedalo_id"], name: "person_id", using: :btree
  end

  create_table "interview_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string  "locale"
    t.string  "observations"
    t.integer "interview_id"
    t.integer "interview_section_id"
  end

  create_table "interviews", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Self-generated table in Dédalo4 for diffusion" do |t|
    t.bigint   "section_id",                             comment: "Campo creado automáticamente para guardar section_id (sin correspondencia en estructura)", unsigned: true
    t.string   "lang",                     limit: 8,     comment: "Campo creado automáticamente para guardar el idioma (sin correspondencia en estructura)"
    t.string   "archive_id",                             comment: "Código - oh14"
    t.integer  "collection_id",                          comment: "Proyecto - oh22",                                                                          unsigned: true
    t.integer  "video",                    limit: 1,     comment: "Audiovisual - oh25"
    t.integer  "duration",                               comment: "Audiovisual - oh25",                                                                       unsigned: true
    t.integer  "translated",               limit: 1,     comment: "Estado - oh28"
    t.datetime "created_at",                             comment: "ID - oh62"
    t.datetime "updated_at",                             comment: "ID - oh62"
    t.integer  "segmented",                limit: 1,     comment: "ID - oh62"
    t.integer  "researched",               limit: 1,     comment: "ID - oh62"
    t.integer  "proofread",                limit: 1,     comment: "ID - oh62"
    t.string   "interview_date",                         comment: "Audiovisual - oh25"
    t.string   "still_image_file_name",                  comment: "Imagen identificativa - oh17"
    t.string   "still_image_content_type",               comment: "Imagen identificativa - oh17"
    t.integer  "still_image_file_size",                  comment: "Imagen identificativa - oh17",                                                             unsigned: true
    t.datetime "still_image_updated_at",                 comment: "Imagen identificativa - oh17"
    t.integer  "inferior_quality",         limit: 1,     comment: "ID - oh62"
    t.text     "original_citation",        limit: 65535, comment: "ID - oh62"
    t.text     "translated_citation",      limit: 65535, comment: "ID - oh62"
    t.string   "citation_media_id",                      comment: "ID - oh62"
    t.string   "citation_timecode",        limit: 18,    comment: "ID - oh62"
    t.datetime "indexed_at",                             comment: "Audiovisual - oh25"
    t.integer  "language_id",                            comment: "Idioma - oh20",                                                                            unsigned: true
    t.integer  "photos",                                 comment: "image - oh26",                                                                             unsigned: true
    t.index ["archive_id"], name: "archive_id", using: :btree
    t.index ["citation_media_id"], name: "citation_media_id", using: :btree
    t.index ["citation_timecode"], name: "citation_timecode", using: :btree
    t.index ["collection_id"], name: "collection_id", using: :btree
    t.index ["created_at"], name: "created_at", using: :btree
    t.index ["duration"], name: "duration", using: :btree
    t.index ["indexed_at"], name: "indexed_at", using: :btree
    t.index ["inferior_quality"], name: "inferior_quality", using: :btree
    t.index ["interview_date"], name: "interview_date", using: :btree
    t.index ["lang"], name: "lang", using: :btree
    t.index ["language_id"], name: "language_id", using: :btree
    t.index ["original_citation"], name: "original_citation", type: :fulltext
    t.index ["proofread"], name: "proofread", using: :btree
    t.index ["researched"], name: "researched", using: :btree
    t.index ["section_id", "lang"], name: "section_id_lang_constrain", unique: true, using: :btree
    t.index ["section_id"], name: "section_id", using: :btree
    t.index ["segmented"], name: "segmented", using: :btree
    t.index ["still_image_content_type"], name: "still_image_content_type", using: :btree
    t.index ["still_image_file_name"], name: "still_image_file_name", using: :btree
    t.index ["still_image_file_size"], name: "still_image_file_size", using: :btree
    t.index ["still_image_updated_at"], name: "still_image_updated_at", using: :btree
    t.index ["translated"], name: "translated", using: :btree
    t.index ["translated_citation"], name: "translated_citation", type: :fulltext
    t.index ["updated_at"], name: "updated_at", using: :btree
    t.index ["video"], name: "video", using: :btree
  end

  create_table "language_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "language_id", null: false
    t.string   "locale",      null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "abbreviated"
    t.string   "name"
    t.index ["language_id"], name: "index_language_translations_on_language_id", using: :btree
    t.index ["locale"], name: "index_language_translations_on_locale", using: :btree
  end

  create_table "languages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string "code", null: false
    t.string "name", null: false
  end

  create_table "people", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually" do |t|
    t.string   "person_dedalo_id", limit: 160
    t.string   "date_of_birth",    limit: 160
    t.string   "gender",           limit: 160
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["person_dedalo_id"], name: "person_dedalo_id", using: :btree
  end

  create_table "person_translations", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually" do |t|
    t.string   "person_dedalo_id",  limit: 160, null: false
    t.bigint   "person_id",                     null: false
    t.string   "locale",            limit: 160
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name",        limit: 600
    t.string   "last_name",         limit: 600
    t.string   "birth_name",        limit: 600
    t.string   "other_first_names", limit: 600
    t.string   "alias_names",       limit: 600
    t.string   "typology"
    t.index ["person_dedalo_id"], name: "person_dedalo_id", using: :btree
    t.index ["person_id"], name: "index_person_translations_on_person_id", using: :btree
  end

  create_table "photo_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "photo_dedalo_id"
    t.integer  "photo_id"
    t.string   "locale",          limit: 128
    t.text     "caption",         limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["photo_dedalo_id"], name: "photo_dedalo_id", using: :btree
  end

  create_table "photos", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "photo_dedalo_id",                   null: false
    t.integer  "interview_section_id",              null: false
    t.integer  "interview_id"
    t.string   "photo_file_name",      limit: 256
    t.string   "photo_content_type",   limit: 1024
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["photo_dedalo_id"], name: "photo_dedalo_id", using: :btree
  end

  create_table "registry_entries", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "entry_dedalo_code", limit: 256,                    null: false
    t.string   "entry_code",        limit: 128
    t.string   "entry_desc",        limit: 128
    t.string   "latitude"
    t.string   "longitude"
    t.string   "workflow_state",    limit: 128, default: "public", null: false
    t.integer  "list_priority",     limit: 1,   default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["entry_code"], name: "entry_code", using: :btree
    t.index ["entry_dedalo_code"], name: "entry_dedalo_code", length: { entry_dedalo_code: 255 }, using: :btree
  end

  create_table "registry_hierarchies", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "ancestor_dedalo_id",   limit: 128,             null: false
    t.string   "descendant_dedalo_id", limit: 128,             null: false
    t.string   "ancestor_id",          limit: 128
    t.string   "descendant_id",        limit: 128
    t.integer  "direct",               limit: 1,   default: 0
    t.integer  "count",                            default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["ancestor_dedalo_id"], name: "ancestor_dedalo_id", using: :btree
    t.index ["ancestor_id"], name: "ancestor_id", using: :btree
  end

  create_table "registry_name_translations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "registry_name_dedalo_id", limit: 128,      null: false
    t.string   "registry_name_id",        limit: 128
    t.string   "locale",                  limit: 128
    t.text     "descriptor",              limit: 16777215
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["registry_name_dedalo_id"], name: "registry_name_dedalo_id", using: :btree
    t.index ["registry_name_id"], name: "registry_name_id", using: :btree
  end

  create_table "registry_name_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string  "code",            limit: 128
    t.string  "name",            limit: 256
    t.integer "order_priority"
    t.integer "allows_multiple", limit: 1
    t.integer "mandatory",       limit: 1
  end

  create_table "registry_names", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "registry_entry_dedalo_id",     limit: 128, null: false
    t.string   "registry_name_type_dedalo_id", limit: 128, null: false
    t.string   "registry_entry_id",            limit: 128
    t.string   "registry_name_type_id",        limit: 128
    t.integer  "name_position"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.index ["registry_entry_dedalo_id"], name: "registry_entry_dedalo_id", using: :btree
    t.index ["registry_entry_id"], name: "registry_entry_id", using: :btree
  end

  create_table "registry_reference_type_translations", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "registry_reference_type_id"
    t.string   "locale",                     limit: 20
    t.string   "name",                       limit: 20
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "registry_reference_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer "registry_entry_id"
    t.string  "code",              limit: 20
  end

  create_table "registry_references", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "dedalo_rsc167_section_id",                                    null: false
    t.integer  "registry_entry_id",                                           null: false
    t.string   "registry_entry_dedalo_id",   limit: 512,                      null: false
    t.string   "ref_object_type",                         default: "Segment"
    t.integer  "ref_object_id"
    t.integer  "registry_reference_type_id"
    t.integer  "ref_position"
    t.string   "original_descriptor",        limit: 1000
    t.string   "ref_details",                limit: 1000
    t.string   "ref_comments",               limit: 1000
    t.string   "ref_info",                   limit: 1000
    t.string   "workflow_state",                          default: "checked"
    t.integer  "interview_section_id"
    t.integer  "interview_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["dedalo_rsc167_section_id"], name: "dedalo_rsc167_section_id", using: :btree
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["ref_object_id"], name: "index_registry_references_on_ref_object_id", using: :btree
    t.index ["ref_object_type", "ref_object_id"], name: "index_registry_references_on_ref_object_type_and_ref_object_id", using: :btree
    t.index ["ref_object_type"], name: "index_registry_references_on_ref_object_type", using: :btree
    t.index ["registry_entry_dedalo_id"], name: "registry_entry_dedalo_id", length: { registry_entry_dedalo_id: 255 }, using: :btree
    t.index ["registry_entry_id"], name: "index_registry_references_on_registry_entry_id", using: :btree
  end

  create_table "segment_translations", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "section_id"
    t.integer  "segment_id"
    t.string   "locale",      limit: 128
    t.string   "mainheading", limit: 1000
    t.string   "subheading",  limit: 1000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["section_id"], name: "section_id", using: :btree
  end

  create_table "segments", id: :bigint, unsigned: true, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "section_id"
    t.integer  "tape_id"
    t.string   "media_id",             limit: 160
    t.string   "timecode",             limit: 160
    t.string   "transcript",           limit: 2000
    t.string   "translation",          limit: 2000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "duration",                           precision: 5, scale: 2
    t.integer  "sequence_number"
    t.integer  "tape_number"
    t.string   "speaker",              limit: 256
    t.integer  "speaker_id"
    t.boolean  "speaker_change"
    t.boolean  "chapter_change"
    t.integer  "notes"
    t.string   "section",              limit: 160
    t.integer  "interview_section_id"
    t.string   "term_id",              limit: 11264
    t.integer  "interview_id"
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["section_id"], name: "section_id", using: :btree
    t.index ["term_id"], name: "term_id", length: { term_id: 255 }, using: :btree
  end

  create_table "tapes", id: :bigint, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", comment: "Table builded manually" do |t|
    t.integer  "section_id"
    t.integer  "interview_section_id"
    t.string   "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "video"
    t.integer  "duration"
    t.integer  "interview_id"
    t.integer  "tape_number"
    t.index ["interview_section_id"], name: "interview_section_id", using: :btree
    t.index ["section_id"], name: "section_id", using: :btree
  end

  create_table "usage_reports", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "ip"
    t.string   "action",                      null: false
    t.string   "resource_id",     limit: 20
    t.integer  "user_account_id"
    t.string   "query",           limit: 100
    t.string   "facets",          limit: 300
    t.datetime "logged_at",                   null: false
    t.datetime "created_at"
  end

  create_table "user_account_ips", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "user_account_id"
    t.string   "ip"
    t.datetime "created_at"
    t.index ["user_account_id", "ip"], name: "index_user_account_ips_on_user_account_id_and_ip", using: :btree
  end

  create_table "user_accounts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "login",                  default: "", null: false
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "password_salt"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "authentication_token"
    t.datetime "deactivated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["login", "deactivated_at"], name: "index_user_accounts_on_login_and_deactivated_at", using: :btree
    t.index ["login"], name: "index_user_accounts_on_login", unique: true, using: :btree
  end

  create_table "user_contents", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
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
    t.string   "workflow_state",                   default: "private"
    t.string   "media_id"
    t.index ["media_id"], name: "index_user_contents_on_media_id", using: :btree
    t.index ["type", "id_hash"], name: "index_user_contents_on_type_and_id_hash", using: :btree
    t.index ["user_id"], name: "index_user_contents_on_user_id", using: :btree
  end

  create_table "user_registrations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.boolean  "tos_agreement"
    t.text     "application_info",   limit: 65535
    t.string   "workflow_state"
    t.string   "admin_comments"
    t.integer  "user_account_id"
    t.string   "login"
    t.datetime "processed_at"
    t.string   "default_locale"
    t.boolean  "receive_newsletter"
    t.boolean  "newsletter_signup"
    t.boolean  "priv_agreement"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
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
