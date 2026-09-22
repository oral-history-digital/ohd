# Metadata fields and search facets

This guide explains how OHD configures metadata and turns configured values into
search filters. It is for developers and administrators who configure projects.
For registry entries, names, authority data, and references, see
[Registry](registry.md).

## Metadata fields are configuration

A `MetadataField` tells OHD where a value comes from and where OHD should use
it: in detail views, result lists, maps, imports, or search. It does not store
the value itself.

For example, this configuration tells OHD to use an existing value:

```text
Metadata field: media_type
Source: Interview
Value: interview.media_type
```

If an interview has `media_type: video`, the metadata field can show or filter
that value. It does not create a separate `media_type` value.

## Metadata sources

Each field has a `source` that identifies the model or data relation OHD reads.

| Source | Reads from | Example |
| --- | --- | --- |
| `Interview` | Existing interview attribute | `media_type` reads `interview.media_type` |
| `Person` | Existing interviewee attribute | `gender` reads `interviewee.gender` |
| `RegistryReferenceType` | Registry references of one type | `birth_location` finds an interviewee's `birth_location` reference |
| `EventType` | Event data | An event type supplies a date-range facet |

Interview and Person fields configure predefined attributes. They cannot create
a new persisted text field or a new database column.

For example, a non-registry text field uses existing interview data:

```text
Metadata field: description
Source: Interview
Value: interview.description
```

The field can display or index the description, but the text remains stored on
the `Interview` record and its translations.

## Registry-backed metadata fields

A registry-backed metadata field connects configuration to a registry
reference. The reference is the stored fact; the metadata field tells OHD how
to expose that fact.

For example:

```text
Stored reference:
Anna Müller ── birth location ──> Berlin

Metadata configuration:
MetadataField `birth_location`
→ RegistryReferenceType `birth_location`
→ ref_object_type: Person
→ use_as_facet: true
```

This configuration can make `birth_location` appear in a person's detail view
and as a search filter. Without the `MetadataField`, the registry reference can
still exist, but OHD has no configuration to expose it in those features.

## Project and umbrella configuration

Metadata fields belong to a project. The project decides whether a field is
shown, imported, mapped, listed, or used as a facet.

A normal project can link one of its metadata fields to a reference type in the
umbrella project. This keeps the configuration local while using shared
vocabulary.

For example:

```text
Normal-project MetadataField: birth_location
        │
        └─ Umbrella RegistryReferenceType: birth_location
               │
               └─ Umbrella RegistryEntry: Berlin
```

The normal project controls whether its `birth_location` field is visible or
searchable. The umbrella tree supplies the shared terms.

## Search facets

A facet is a search filter. A supported field becomes a regular archive-search
facet when `use_as_facet` is enabled. `facet_order` controls its display order.

For a registry-backed `birth_location` facet:

1. An editor creates Anna → `birth_location` → Berlin.
2. OHD indexes Berlin's registry-entry ID in the interview's Solr
   `search_facets` field.
3. Search returns a `birth_location` filter with Berlin and its result count.
4. Selecting Berlin returns interviews whose interviewee has that reference.

Facet choices for a registry reference type are the direct children of the
entry to which that type is attached. If `birth_location` is attached to
`Places`, Berlin and Warsaw can be choices. Values with no matching interviews
are omitted from the facet response.

Non-registry fields can also be facets. For example, `media_type` can filter
interviews by `audio` or `video`. Year and event fields use range facets.

## Search scope and reindexing

At index time, a normal project's interviews include enabled fields from both
that project and the umbrella project. At request time, the normal project's
facet response uses its own configured field names. To show an umbrella-backed
facet in a normal archive, add a metadata field to that archive that links to
the umbrella reference type.

The umbrella portal searches public projects when browsing. A normal project
searches only its own interviews. Shared vocabulary therefore does not merge
project content or project registry trees.

Creating, updating, or deleting a registry reference queues interview
reindexing. Reindex affected interviews after changing an existing metadata
field's facet setting; changing `use_as_facet` does not automatically reindex
existing interviews. See [Reindexing](../operations/reindexing.md) for commands
and verification.

## Relevant code

- `app/models/metadata_field.rb` — metadata-field configuration and validation
- `app/models/project.rb` — project fields, facet definitions, and facet values
- `app/models/interview.rb` — Solr indexing and archive search
- `app/models/registry_reference_type.rb` — registry-backed field relation
- `app/services/project_creator.rb` — default and umbrella-linked field setup
