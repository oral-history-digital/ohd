# Solr configuration

Solr is OHD's search index. Its schema and text-analysis configuration live in
[`solr/configsets/sunspot/conf/schema.xml`](../../solr/configsets/sunspot/conf/schema.xml).

Development uses this configuration through the local Sunspot setup. A staging
or production Solr service must be configured to use the same configset when it
is deployed or changed.

## Text analysis

The OHD configset extends the base Solr configuration with:

- a character mapping filter using `mapping-ISOLatin1Accent.txt` to fold
  diacritics;
- `GermanMinimalStemFilter` for German word forms;
- `KeywordMarkerFilter` with protected words from `protwords.txt`;
- `StemmerOverrideFilter` with overrides from `stemdict.txt`.

Those three text files are part of the configset and must travel with
`schema.xml`. A schema or analysis change changes how Solr reads indexed data;
deploy the configset to Solr, then [reindex](reindexing.md) affected records.

## Related guides

- [Reindexing](reindexing.md) — choose and run an index rebuild.
- [Docker instance setup](docker_instance_setup.md) — set up the Docker-based
  runtime, including its Solr service.
