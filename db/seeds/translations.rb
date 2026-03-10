# Ensure DB-backed translation values are populated on fresh seeded instances.
Rake::Task['translations:bootstrap'].reenable
Rake::Task['translations:bootstrap'].invoke
