# Transfer

- Auf da01: Export dump:
    ```sh
    mysqldump -uzwar_archiv -p zwar_archiv_production user_account_ips user_accounts user_contents user_registrations users > dump20181211-selective.sql
    ```
- SCP da01 > local
    ```sh
    scp da01:~/dump20181211-selective.sql usertransfer/
    ```
- Insert > Replace

    in `dump20181211-selective.sql` ersetze INSERT durch REPLACE

- Import DB
    ```bash
    mysql -uroot -proot zwar_archive_development < usertransfer/dump20181211-selective.sql
    ```
- Migration der Datenbank:
    ```bash
    bundle exec rails c
    ```
    ```ruby
    require "/home/rico/proj/zwar-archive/db/migrate/20170421135917_add_devise_columns_to_user_account.rb"
    AddDeviseColumnsToUserAccount.new.change
    ```
