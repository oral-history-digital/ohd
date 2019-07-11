class ChangeToUtf8mb4 < ActiveRecord::Migration[5.2]
  def change_encoding(encoding,collation)
    connection = ActiveRecord::Base.connection
    tables = connection.tables
    dbname =connection.current_database
    execute <<-SQL
      ALTER DATABASE #{dbname} CHARACTER SET #{encoding} COLLATE #{collation};
    SQL
    tables.each do |tablename|
      begin
        execute <<-SQL
          ALTER TABLE #{dbname}.#{tablename} CONVERT TO CHARACTER SET #{encoding} COLLATE #{collation};
        SQL
      rescue Exception => e
        puts "error on #{tablename}: #{e.message}"
      end
    end
  end

  def change
    reversible do |dir|
      dir.up do
        change_encoding('utf8mb4','utf8mb4_unicode_ci')
      end
      dir.down do
        change_encoding('latin1','latin1_swedish_ci')
      end
    end
  end
end
