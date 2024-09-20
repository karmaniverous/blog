---
title: Evolving a NoSQL Database Schema
excerpt: Some words about evolving a NoSQL database schema.
permalink: /projects/entity-manager/evolving-a-nosql-db-schema/
---

<figure class="align-left drop-image">
    <img src="/assets/collections/entity-manager/entity-manager-square.jpg">
</figure>

**Entity Manager** works by interpreting your configured database schema in a very particular, very opinionated way.

By way of example, this section will start with a simple data model, evolve a database schema, and show you what **Entity Manager** would do with it.

[NoSQL](https://en.wikipedia.org/wiki/NoSQL) databases do not offer the [schema & query abstractions](/projects/entity-manager/sql-vs-nosql) enjoyed by [RDBMS](https://en.wikipedia.org/wiki/Relational_database) developers, so any NoSQL database schema will be intrinsically platform-specific. **This example will evolve a database schema for the [DynamoDB](https://aws.amazon.com/dynamodb/) platform**, but the presented design _process_ should work equally well against any NoSQL database platform.
{: .notice--info}

## A Microservices Application

Imagine an application that tracks the credit card transactions of its users.

When a **User** performs a **Credit Card** or online shopping cart **Transaction**, the application rounds the Transaction amount to the nearest dollar and credits that amount to a **Beneficiary** chosen by the User. Online shopping cart Transactions can be related to the User by Credit Card and **Email**, so each User can have more than one Email, which must be unique in the system. Users also sign up with an Email, so there's a particularly close relationship between Users and Emails.

FYI this example is actually a small slice of the real [VeteranCrowd](https://veterancrowd.com) application, which uses **Entity Manager** in production!
{: .notice--info}

Here's a breakdown of the entities & relationships in the system. We're building a microservices back end, so each entity will live on a specific service as indicated:

{% include figure image_path="/assets/diagrams/entity-manager-evolving-a-nosql-db-schema-services.png" caption="_Entity & service relationships._" %}

For this example, we're going to focus on the requirements of the User service.

## User Service Data Model

Let's focus narrowly on the User service data model. We need to account for:

- the User and Email entities and their properties, and
- cases when either entity is the _many_ side of a one-to-many relationship.

Every entity has to have a unique identifier that doesn't change. If there isn't a natural fit with an existing entity property, we'll use a [nanoid](https://github.com/ai/nanoid).

Here's the resulting data model (see the entity notes below for more info):

{% include figure image_path="/assets/diagrams/entity-manager-evolving-a-nosql-db-schema-data-model.png" caption="_User service data model._" %}

### User Entity

| Property             | Type     | Description                                                                                      |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `beneficiaryId`      | `string` | The unique id of the Beneficiary related to the User. _This value is required but might change._ |
| `created`            | `number` | Timestamp of record creation. _This value never changes!_                                        |
| `firstName`          | `string` | User first name.                                                                                 |
| `firstNameCanonical` | `string` | User first name canonicalized for search.                                                        |
| `lastName`           | `string` | User last name.                                                                                  |
| `lastNameCanonical`  | `string` | User last name canonicalized for search.                                                         |
| `[phone]`            | `string` | Internationalized User phone.                                                                    |
| `userId`             | `string` | Unique id of User. _This value never changes!_                                                   |
| `updated`            | `number` | Timestamp of last record update.                                                                 |

`firstNameCanonical` and `lastNameCanonical` are provided to support searching for Users by name. Canonicalizing a name converts it to a consisten case and removes diacritics and non-word characters. So _Gómez-Juárez-Álvarez_ becomes _gomezjuarezalvarez_.

**_Why doesn't Entity Manager perform canonicalization internally?_** All **Entity Manager** data transformations are _reversible_ to support safe data migration. Canonicalization throws away data, so your application should perform any canonicalization _before_ sending data to **Entity Manager**.
{: .notice--info}

### Email Entity

| Property  | Type     | Description                                                                                                  |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `created` | `number` | Timestamp of record creation.                                                                                |
| `email`   | `string` | Email address. _Unique by definition and never changes, so we can use this value as the record's unique id._ |
| `userId`  | `string` | Unique id of related User.                                                                                   |

An Email record has no `updated` property becuase no property on the Email record is subject to change.

## Single Table Design

The primary job of a table in a relational database is to support [schema & query abstraction](/projects/entity-manager/sql-vs-nosql). Tables are intended to map cleanly to data entities, and **it is the database engine's job to organize the physical distribution of data** to support efficient query operations.

> Highly available data is in one physical location.

In a DynamoDB database (as with any NoSQL database) there is no such abstraction layer. Consequently, **it is the developer's job to organize the physical distribution of data** to support efficient query operations.

In order to be physicaly "close" to one another in any meaningful sense, related DynamoDB data entities _must_ be stored in the same table. This is the origin of the [single-table design pattern](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/).

Entity Manager takes a highly opinionated approach to this pattern. If we start from the assumption that all User and Email entities MUST live on the same table, the following sections will explain the design constraints at work in DynamoDB and how to implement a table design that Entity Manager can support.

### Keys & Queries

A data object in a DynamoDB table is uniquely identified by its _primary key_. This can take one of two forms, chosen at design time:

- a _simple primary key_ is a single property that uniquely identifies the object. In DynamoDB-land, this is called the _partition key_. In more general NoSQL terms, this is a _hash key_.

- a _composite primary key_ is a combination of two properties that uniquely identify the object. In DynamoDB-land, these are the _partition key_ and the _sort key_. In more general NoSQL terms, this is a _hash key_ and a _range key_.

For reasons that will become clear, Entity Manager requires a composite primary key for all data entities. And to keep this discussion as general as possible, we'll refer to its components as the _hash key_ and _range key_.

All high-performance NoSQL databases (including DynamoDB) makes a clear distinction between two very different kinds of data retrieval operations:

- **Scan** operations read _every_ record in a table. At scale, finding an individual record with a scan is _very_ slow and _very_ expensive. Scans are to be avoided whenever possible.

- **Query** operations read _an ordered subset_ of records in a table. At scale, finding an individual record with a query is _very_ fast and _very_ cheap. Queries are the preferred way to access data in a NoSQL database.

In DynamoDB and other NoSQL databases, whatever else may be true, queries obey one hard rule: **a query can only be performed on records with the same hash key!**

Query operations can perform all kinds of comparison operations on a record's range key, like:

- equal to a certain value,
- greater or less than than a certain value,
- between two values, or
- begins with a particular string value.

... but the hash key is _fixed_ for any query operation!

In our example, we have decided that User and Email entities will share space on the User service table. This means that both kinds of records will share the same hash key and the same range key.

Let's say we want to write a query that returns all the Users created since yesterday. Both kinds of records have a `created` property we can use as the range key, but we'll have to use the hash key to distinguish between User and Email records. There is no such property, so we'll have to create it.

Leaving out other properties, here's what two such records might look like:

| Property  | User Record  | Email Record |
| --------- | ------------ | ------------ |
| `created` | `1726824079` | `1726824178` |
| `hashKey` | `user`       | `email`      |

While this strategy does support the query, it fails to support an even more fundamental data operation: retrieving an individual record by its unique identifier.

If we have reserved the hash key to differentiate between User and Email records, and we want to retrieve either one by its unique identifier, then we have no other choice: the range key _must_ contain the record's unique identifier! But there's a problem: whereas both the User and Email records had a `created` property, they use _different_ properties for their unique identifiers.

The range key must be the same property on every record, so we'll have to create another new property:

| Property   | User Record                    | Email Record              |
| ---------- | ------------------------------ | ------------------------- |
| `created`  | `1726824079`                   | `1726824178`              |
| `email`    |                                | `me@karmanivero.us`       |
| `hashKey`  | `user`                         | `email`                   |
| `rangeKey` | `userId#wf5yU_5f63gqauSOLpP5O` | `email#me@karmanivero.us` |
| `userId`   | `wf5yU_5f63gqauSOLpP5O`        | `wf5yU_5f63gqauSOLpP5O`   |

Note that the generated `rangeKey` property value contains the unique property _name_ as well as its value! This is an important Entity Manager feature that enables the safe construction of composite keys and super-efficient query at scale. More on this to come!
{: .notice--info}

### Secondary Indexes

### Partitions & Shard Keys

### User Service Table Design
