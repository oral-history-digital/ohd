# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140108185815) do

  create_table "annotation_translations", :force => true do |t|
    t.integer  "annotation_id"
    t.string   "locale"
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "annotation_translations", ["annotation_id"], :name => "index_annotation_translations_on_annotation_id"

  create_table "annotations", :force => true do |t|
    t.integer  "interview_id"
    t.string   "author"
    t.string   "media_id",        :null => false
    t.string   "timecode",        :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_content_id"
    t.integer  "segment_id"
  end

  add_index "annotations", ["interview_id"], :name => "index_annotations_on_interview_id"
  add_index "annotations", ["media_id"], :name => "index_annotations_on_media_id"
  add_index "annotations", ["segment_id"], :name => "index_annotations_on_segment_id"

  create_table "categories", :force => true do |t|
    t.string "category_type"
    t.string "code"
  end

  create_table "categorizations", :force => true do |t|
    t.integer "category_id",   :null => false
    t.integer "interview_id",  :null => false
    t.string  "category_type"
  end

  add_index "categorizations", ["category_type", "interview_id"], :name => "index_categorizations_on_category_type_and_interview_id"

  create_table "category_translations", :force => true do |t|
    t.integer  "category_id"
    t.string   "locale"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "category_translations", ["category_id"], :name => "index_category_translations_on_category_id"

  create_table "collection_translations", :force => true do |t|
    t.integer  "collection_id"
    t.string   "locale"
    t.string   "responsibles"
    t.string   "countries"
    t.text     "notes"
    t.string   "institution"
    t.string   "name"
    t.text     "interviewers"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "collection_translations", ["collection_id"], :name => "index_collection_translations_on_collection_id"

  create_table "collections", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "homepage"
    t.string   "project_id"
  end

  create_table "contributions", :force => true do |t|
    t.integer "interview_id"
    t.integer "contributor_id"
    t.string  "contribution_type"
  end

  add_index "contributions", ["interview_id"], :name => "index_contributions_on_interview_id"

  create_table "contributor_translations", :force => true do |t|
    t.integer  "contributor_id"
    t.string   "locale"
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "contributor_translations", ["contributor_id"], :name => "index_contributor_translations_on_contributor_id"

  create_table "contributors", :force => true do |t|
    t.boolean "interview",     :default => false
    t.boolean "camera",        :default => false
    t.boolean "transcription", :default => false
    t.boolean "translation",   :default => false
    t.boolean "proofreading",  :default => false
    t.boolean "segmentation",  :default => false
    t.boolean "documentation", :default => false
    t.boolean "other",         :default => false
  end

  create_table "home_locations", :force => true do |t|
    t.string "name"
  end

  create_table "imports", :force => true do |t|
    t.integer  "importable_id"
    t.string   "importable_type"
    t.datetime "time"
    t.string   "migration"
    t.string   "content",         :limit => 400
    t.datetime "created_at"
  end

  add_index "imports", ["importable_id", "importable_type"], :name => "index_imports_on_importable_id_and_importable_type"

  create_table "interview_translations", :force => true do |t|
    t.integer  "interview_id"
    t.string   "locale"
    t.string   "details_of_origin"
    t.string   "return_date"
    t.text     "forced_labor_details"
    t.string   "first_name"
    t.string   "name_affix"
    t.string   "other_first_names"
    t.string   "last_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "interviewers"
    t.string   "proofreaders"
    t.string   "segmentators"
    t.string   "transcriptors"
    t.string   "translators"
    t.text     "researchers"
  end

  add_index "interview_translations", ["interview_id"], :name => "index_interview_translations_on_interview_id"

  create_table "interviews", :force => true do |t|
    t.string   "archive_id"
    t.integer  "collection_id"
    t.boolean  "gender"
    t.string   "date_of_birth"
    t.string   "country_of_origin"
    t.boolean  "video"
    t.integer  "duration"
    t.boolean  "translated"
    t.string   "deportation_date"
    t.string   "deportation_location"
    t.string   "punishment"
    t.string   "liberation_date"
    t.integer  "language_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "segmented",                              :default => false
    t.boolean  "researched",                             :default => false
    t.boolean  "proofread",                              :default => false
    t.text     "alias_names"
    t.string   "interview_date"
    t.text     "forced_labor_locations"
    t.string   "birth_location"
    t.text     "return_locations"
    t.string   "still_image_file_name"
    t.string   "still_image_content_type"
    t.integer  "still_image_file_size"
    t.datetime "still_image_updated_at"
    t.boolean  "inferior_quality",                       :default => false
    t.text     "original_citation"
    t.text     "translated_citation"
    t.string   "citation_media_id"
    t.string   "citation_timecode",        :limit => 18
    t.datetime "indexed_at"
  end

  create_table "languages", :force => true do |t|
    t.string "name", :null => false
  end

  create_table "location_references", :force => true do |t|
    t.integer "interview_id"
    t.string  "name"
    t.string  "alias_names"
    t.string  "location_name"
    t.text    "alias_location_names"
    t.string  "longitude"
    t.string  "latitude"
    t.string  "location_type"
    t.string  "description"
    t.string  "reference_type"
    t.boolean "classified",           :default => true
    t.string  "region_name"
    t.string  "region_latitude"
    t.string  "region_longitude"
    t.string  "country_name"
    t.string  "country_latitude"
    t.string  "country_longitude"
    t.integer "hierarchy_level"
    t.boolean "duplicate",            :default => false
    t.string  "place_subtype"
  end

  add_index "location_references", ["interview_id", "name"], :name => "index_location_references_on_interview_id_and_name"
  add_index "location_references", ["interview_id"], :name => "index_location_references_on_interview_id"

  create_table "location_segments", :force => true do |t|
    t.integer "location_reference_id"
    t.integer "segment_id"
    t.integer "interview_id"
  end

  add_index "location_segments", ["location_reference_id"], :name => "index_location_segments_on_location_reference_id"

  create_table "photos", :force => true do |t|
    t.integer  "interview_id"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.text     "caption"
  end

  create_table "segment_translations", :force => true do |t|
    t.integer  "segment_id"
    t.string   "locale"
    t.string   "subheading"
    t.string   "mainheading"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "segment_translations", ["segment_id"], :name => "index_segment_translations_on_segment_id"

  create_table "segments", :force => true do |t|
    t.integer  "tape_id"
    t.string   "media_id"
    t.string   "timecode"
    t.string   "transcript",      :limit => 2000
    t.string   "translation",     :limit => 2000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "duration",                        :precision => 5, :scale => 2
    t.integer  "sequence_number"
    t.integer  "tape_number"
    t.string   "speaker"
    t.boolean  "speaker_change",                                                :default => false
    t.boolean  "chapter_change",                                                :default => false
    t.string   "section"
    t.integer  "interview_id"
  end

  add_index "segments", ["interview_id", "section"], :name => "index_segments_on_interview_id_and_section"
  add_index "segments", ["media_id"], :name => "index_segments_on_media_id"
  add_index "segments", ["tape_id"], :name => "index_segments_on_tape_id"

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type"], :name => "index_taggings_on_taggable_id_and_taggable_type"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "tapes", :force => true do |t|
    t.integer  "interview_id"
    t.string   "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "video"
    t.integer  "duration"
  end

  create_table "text_materials", :force => true do |t|
    t.integer "interview_id"
    t.string  "document_type"
    t.string  "document_file_name"
    t.string  "document_content_type"
    t.integer "document_file_size"
    t.string  "locale",                :limit => 5, :default => "de", :null => false
  end

  add_index "text_materials", ["interview_id", "document_type", "locale"], :name => "index_text_materials_unique_document", :unique => true

  create_table "user_account_ips", :force => true do |t|
    t.integer  "user_account_id"
    t.string   "ip"
    t.datetime "created_at"
  end

  add_index "user_account_ips", ["user_account_id", "ip"], :name => "index_user_account_ips_on_user_account_id_and_ip"

  create_table "user_accounts", :force => true do |t|
    t.string   "email",                               :default => "", :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "", :null => false
    t.string   "password_salt",                       :default => "", :null => false
    t.string   "reset_password_token"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "login"
    t.datetime "deactivated_at"
  end

  add_index "user_accounts", ["confirmation_token"], :name => "index_user_accounts_on_confirmation_token", :unique => true
  add_index "user_accounts", ["login"], :name => "index_user_accounts_on_login", :unique => true
  add_index "user_accounts", ["reset_password_token"], :name => "index_user_accounts_on_reset_password_token", :unique => true

  create_table "user_contents", :force => true do |t|
    t.integer  "user_id"
    t.string   "id_hash"
    t.string   "title"
    t.string   "description",          :limit => 300
    t.string   "interview_references"
    t.string   "properties",           :limit => 500
    t.string   "link_url"
    t.string   "type",                                                       :null => false
    t.boolean  "shared",                              :default => false
    t.boolean  "persistent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "reference_id"
    t.string   "reference_type"
    t.integer  "position",                            :default => 1
    t.string   "workflow_state",                      :default => "private"
    t.datetime "submitted_at"
    t.datetime "published_at"
    t.string   "media_id"
  end

  add_index "user_contents", ["media_id"], :name => "index_user_contents_on_media_id"
  add_index "user_contents", ["type", "id_hash"], :name => "index_user_contents_on_type_and_id_hash"
  add_index "user_contents", ["user_id"], :name => "index_user_contents_on_user_id"

  create_table "user_registrations", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.boolean  "tos_agreement"
    t.text     "application_info"
    t.string   "workflow_state"
    t.datetime "created_at"
    t.datetime "activated_at"
    t.string   "admin_comments"
    t.integer  "user_account_id"
    t.string   "login"
    t.datetime "processed_at"
    t.string   "default_locale"
    t.boolean  "receive_newsletter"
    t.boolean  "newsletter_signup",  :default => false
    t.boolean  "priv_agreement",     :default => false
  end

  add_index "user_registrations", ["email"], :name => "index_user_registrations_on_email"
  add_index "user_registrations", ["workflow_state", "email"], :name => "index_user_registrations_on_workflow_state_and_email"
  add_index "user_registrations", ["workflow_state"], :name => "index_user_registrations_on_workflow_state"

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "appellation"
    t.string   "job_description"
    t.string   "research_intentions"
    t.text     "comments"
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
  end

  add_index "users", ["first_name", "last_name"], :name => "index_users_on_first_name_and_last_name"
  add_index "users", ["status"], :name => "index_users_on_status"
  add_index "users", ["user_account_id"], :name => "index_users_on_user_account_id"

end
