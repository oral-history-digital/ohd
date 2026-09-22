# Registry

This guide explains OHD's registry: its entries, names, authority data, and
references. It is for developers and administrators who maintain controlled
vocabulary. For metadata fields and search facets, see
[Metadata, registry, and search facets](metadata-registry-search-facets.md).

## Registry entries and trees

A registry is a structured, controlled list of terms. Each term is a
`RegistryEntry`. Entries are arranged in a tree through `RegistryHierarchy`.

For example, a places tree can look like this:

```text
Places
├─ Germany
│  └─ Berlin
└─ Poland
   └─ Warsaw
```

Using the existing `Berlin` entry prevents separate values such as `Berlin`,
`BERLIN`, and `Berlin, Germany`. The tree also gives the entry context: this
`Berlin` is a place, not a person or subject.

Every project has its own tree, rooted at a `RegistryEntry` with code `root`.
New projects receive `places`, `people`, and `subjects` branches.

For example, a project can maintain archive-specific vocabulary:

```text
Project registry → Places → Local camp → Barrack 3
```

The umbrella project has a separate tree for shared vocabulary:

```text
Umbrella registry → Subjects → Forced labour
```

The configured umbrella project is
`InstanceSetting.current.umbrella_project`; it is not determined by a
shortname. A normal project's tree does not contain umbrella entries. The
global registry-tree endpoint returns the umbrella tree.

## Entry fields

The registry-entry form stores information about one `RegistryEntry`.

| UI field    | Technical field                  | Purpose                    | Example                         |
| ----------- | -------------------------------- | -------------------------- | ------------------------------- |
| Description | Translated `RegistryEntry#notes` | Explains the term          | `Capital of Germany` for Berlin |
| Latitude    | `RegistryEntry#latitude`         | North/south map coordinate | `52.5200`                       |
| Longitude   | `RegistryEntry#longitude`        | East/west map coordinate   | `13.4050`                       |

Coordinates are optional. They are useful for geographic entries and allow OHD
to place referenced entries on maps.

For example, a complete place entry can be:

```text
Entry: Berlin
Description: Capital of Germany
Latitude: 52.5200
Longitude: 13.4050
```

## Index names

The name shown for an entry is a separate `RegistryName` record. This lets one
entry have several labels, alternative spellings, historic names, and
translations without creating duplicate entries.

In the registry-entry UI, an editor selects a **Type of index name** and enters
the name in one or more locales. The selected type is a `RegistryNameType`; the
entered values are translations of the `RegistryName`'s `descriptor`.

For example, these names can all belong to the same `RegistryEntry`:

```text
Registry entry: Munich
Index names:
- Bezeichner: Munich
- Bezeichner: München
- Alias: München (Bayern)
```

Each `RegistryName` has:

- a translated `descriptor`, the displayed text;
- a `RegistryNameType`, selected in the UI;
- a `name_position`, which controls the order of names of the same type.

Name types are project-specific and can be created or edited. The default
project setup creates two types: `Bezeichner` with technical code `spelling`,
and `Alias` with technical code `ancient`. These codes are seeded data, not
fixed types. The UI creates custom types from their labels and does not
automatically assign a technical code.

Alternative names make the same entry easier to find while preserving one
canonical entry and its references. The model does not enforce a single
preferred name.

> **Caution:** Each project must retain a `RegistryNameType` with code
> `spelling`. The registry-name form uses it as the default type, and backend
> code uses it when creating child entries and importing registry entries in
> bulk. This is an implementation limitation, not an editorial requirement.
> This is a TODO: It will be improved in the future

## Authority data

Authority data links an OHD entry to the corresponding record in an external,
maintained vocabulary. In the UI this may be called an authority-file link or
authority data. Technically, each link is a `NormDatum` record with a
`NormDataProvider` and external identifier (`nid`).

For example:

```text
OHD registry entry: Berlin
Authority data:
- GND: 4005728-8
- Wikidata: Q64
- OpenStreetMap: relation/62422
```

This means that OHD's `Berlin` entry refers to the same concept as the external
record. It does not create another OHD entry and does not replace OHD's own
description, names, or position in the tree.

OHD can search supported external providers, including GND, Wikidata, GeoNames,
and OpenStreetMap. Selecting a result can populate the entry's names,
description, coordinates, and authority-data links. Review this data before
saving it: the external record may not match the intended concept exactly.

## Registry references

A `RegistryReference` assigns a registry entry to an interview, person, or
segment. This is the actual descriptive data.

For example:

```text
Anna Müller ── birth location ──> Berlin
```

The `RegistryReferenceType` expresses the meaning of the relationship. It is
attached to a registry entry and defines the intended category and subtree.

For example, a `birth_location` type attached to `Places` is used with place
entries:

```text
Person: Anna Müller
Reference type: birth_location
Registry entry: Berlin
```

The same structure supports other kinds of annotation:

```text
Interview ABC-0001 ── interview location ──> Warsaw
Segment 42         ── subject ──> Forced labour
```

An interview can use both project and umbrella entries. OHD keeps those parts
separate in its interview reference-tree response.

## Relation to metadata fields

Registry references are stored facts. A `MetadataField` is separate,
project-owned configuration that tells OHD where to show, index, import, map,
or filter such facts.

For example:

```text
Stored fact:
Anna Müller ── birth location ──> Berlin

Configuration:
MetadataField `birth_location`
→ RegistryReferenceType `birth_location`
→ show as a Person search facet
```

A reference can exist without a metadata field. Without that configuration,
OHD has no instruction to expose the reference as a form field, result value,
map value, or search facet.

## Relevant code

- `app/models/registry_entry.rb` — entries, hierarchy, coordinates, names, and authority-data associations
- `app/models/registry_name.rb` and `app/models/registry_name_type.rb` — index names and their types
- `app/models/norm_datum.rb` and `app/models/norm_data_provider.rb` — authority-data links
- `app/models/registry_reference.rb` and `app/models/registry_reference_type.rb` — assigned terms and relation types
