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

ActiveRecord::Schema.define(:version => 20091014085012) do

  create_table "collections", :force => true do |t|
    t.string   "name"
    t.string   "countries"
    t.string   "institution"
    t.string   "responsibles"
    t.string   "notes"
    t.string   "interviewers"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "forced_labor_fields", :force => true do |t|
    t.string "name"
  end

  create_table "forced_labor_groups", :force => true do |t|
    t.string "name"
  end

  create_table "forced_labor_habitations", :force => true do |t|
    t.string "name"
  end

  create_table "home_locations", :force => true do |t|
    t.string "name"
  end

  create_table "interview_forced_labor_fields", :force => true do |t|
    t.integer "interview_id",          :null => false
    t.integer "forced_labor_field_id", :null => false
  end

  create_table "interview_forced_labor_groups", :force => true do |t|
    t.integer "interview_id",          :null => false
    t.integer "forced_labor_group_id", :null => false
  end

  create_table "interview_forced_labor_habitations", :force => true do |t|
    t.integer "interview_id",               :null => false
    t.integer "forced_labor_habitation_id", :null => false
  end

  create_table "interviews", :force => true do |t|
    t.string   "archive_id"
    t.integer  "collection_id"
    t.string   "full_title"
    t.boolean  "gender"
    t.string   "date_of_birth"
    t.string   "country_of_origin"
    t.boolean  "video"
    t.integer  "duration"
    t.boolean  "translated"
    t.string   "forced_labor_location"
    t.string   "details_of_origin"
    t.string   "deportation_date"
    t.string   "deportation_location"
    t.string   "forced_labor_details"
    t.string   "punishment"
    t.string   "liberation_date"
    t.integer  "language_id"
    t.integer  "home_location_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "languages", :force => true do |t|
    t.string "name"
  end

end
