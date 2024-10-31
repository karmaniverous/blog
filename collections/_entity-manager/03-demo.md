---
title: 'Entity Manager: A Demonstration'
excerpt: Presenting a step-by-step Typescript implementation of a realistic data model against DynamoDB, with the help of Entity Manager.
permalink: /projects/entity-manager/demo/
header:
  og_image: /assets/collections/entity-manager/configuration-banner.jpg
  overlay_image: /assets/collections/entity-manager/configuration-banner-half.jpg
  teaser: /assets/collections/entity-manager/configuration-square.jpg
---

<figure class="align-left drop-image">
    <img src="/assets/collections/entity-manager/configuration-square.jpg">
</figure>

Your project's data needs are complex. **Entity Manager** simplifies the problem by encapsulating a provider-agnostic, highly opinionated approach to the single-table design pattern.

At the end of the day, though, you have to implement a _specific_ data model against a _specific_ database platform. This guide presents a step-by-step Typescript implementation of a realistic data model against [DynamoDB](https://aws.amazon.com/dynamodb/), with the help of **Entity Manager**.

The [`entity-manager-demo`](https://github.com/karmaniverous/entity-manager-demo) repository contains the full implementation documented below.

**Both this article and the accompanying repository are under construction!** It will take a couple of weeks to unpack everything. Meanwhile, please feel free to [reach out](https://github.com/karmaniverous/entity-manager-demo/discussions) with any questions or ideas!
{: .notice--info}

## The Scenario

As the basis of this demonstration we will use the same data model, table design, and index structure we worked up in [Evolving a NoSQL DB Schema](/projects/entity-manager/evolving-a-nosql-db-schema/). If you haven't read this article yet, I recommend you do so before proceeding as it will help you understand _why_ we settled on the design we chose.

If you just want to review the resulting design, see the [Recap](/projects/entity-manager/evolving-a-nosql-db-schema/#recap) section at the end of that article.

{% include figure image_path="/assets/diagrams/entity-manager-evolving-a-nosql-db-schema-data-model.png" caption="_User service data model._" %}

The details of an API implementation are beyond the scope of this demo, but we will develop the handler functions that an API implementing the above data model would call to perform the following operations against DynamoDB:

- Email entity:
  - Create a new email record.
  - Delete an email record.
  - Retrieve a list of email records by `userId`.
- User entity:
  - Create a new user record.
  - Retrieve a user record by `userId`.
  - Update a user record.
  - Delete a user record and associated email records.
  - Retrieve a list of user records by various search criteria, including a multi-index match against both `firstName` and `lastName`.

While all **Entity Manager** entity records are technically sharded, by default each record's shard key is an empty string, resulting in effectively unsharded data. To demonstrate **Entity Manager**'s ability to scale, we will configure a sharding schedule for each entity that will allow us to test both unsharded and sharded scenarios.

We'll write unit tests to exercise these functions against DynamoDB using the [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) emulator. This will allow you to run the demo on your local machine without incurring any AWS costs (though these would be trivial) and without requiring an active connection to AWS.

## An Overview

At a high level, each of the handler functions described above looks like this:

{% include figure image_path="https://raw.githubusercontent.com/karmaniverous/entity-manager-demo/main/assets/handler.png" caption="_CRUD & search handler structure._" %}

- **`entityManager`** is an instance of the [`EntityManager`](https://docs.karmanivero.us/entity-manager/classes/entity_manager.EntityManager.html) class, which is initialized with a configuration reflecting the design summarized [here](/projects/entity-manager/evolving-a-nosql-db-schema/#recap). This object gives our handler the ability to add and remove generated properties from an entity item and to query entities in the database.

- **`UserItem`** is the complete User type stored in the database, including all generated properties specified in the `EntityManager` [configuration](https://docs.karmanivero.us/entity-manager/types/entity_manager.ParsedConfig.html). Depending on handler requirements, `EmailItem` is also available.

- **`entityClient`** is an instance of the DynamoDB-specific [`EntityClient`](https://docs.karmanivero.us/entity-client-dynamodb/classes/index.EntityClient.html) class, initialized to connect with the User Service table. In principle we could accomplish everything in this demo using [`DynamoDBClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/) and [`DynamoDBDocument`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/DynamoDBDocument/) from the native DynamoDB SDK, but the `EntityClient` class simplifies database interactions and eliminates a lot of noise that would otherwise interfere with the clarity of this demo.

- **`shardQueryMapBuilder`** is a [`ShardQueryMapBuilder`](https://docs.karmanivero.us/entity-client-dynamodb/classes/index.ShardQueryMapBuilder.html) instance declared internally by handler functions (like search endpoints) that require the ability to perform database queries. Each instance is handler-specific, so this object is not shared between handlers.

We'll write [`mocha`](https://mochajs.org)/[`chai`](https://www.chaijs.com/) unit tests to exercise each of the handlers described above against against DynamoDB. By default we'll use the [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) emulator, but we'll set the repository up to make it easy to run the same tests against a live table in the AWS cloud.

For convenience, this repository uses my [Typescript NPM Package Template](https://github.com/karmaniverous/npm-package-template-ts), only I've stripped out the CLI & [Rollup](https://rollupjs.org/) build and have disabled NPM publishing. So what remains is a pure, [semantic-versioned](https://semver.org/) Typescript "package" with a bunch of unit tests: perfect for a demo that can evolve over time, useless for anything else.

If I've done my job right (and apparently I have 🤣) you should be abe to pull the repository, install dependencies, and run all unit tests successfully within just a few minutes. So let's get started!

## `EntityManager` Configuration

{% include figure image_path="https://raw.githubusercontent.com/karmaniverous/entity-manager-demo/main/assets/entityManager.png" caption="_`EntityManager` configuration._" %}

**Entity Manager** configuration is a complex topic! Our purpose here is to focus specifically on our demonstration scenario. [Click here](/projects/entity-manager/configuration/) for a deeper dive into all aspects of Entity Manager configuration.

**Entity Manager is a Typescript-first tool!** If you are writing Javascript, you can skip the type-related parts of this guide and your config will still be validated for you at run time. You just won't get the compile-time type checking that Typescript provides.
{: .notice--warning}

The [`EntityManager`](https://docs.karmanivero.us/entity-manager/classes/entity_manager.EntityManager.html) class configuration object is defined in the [`Config`](https://docs.karmanivero.us/entity-manager/types/entity_manager.Config.html) type. This type is _very_ complex, in order to support all kinds of compile-tie validations. Once the config is parsed, though, it takes on the [`ParsedConfig`](https://docs.karmanivero.us/entity-manager/types/entity_manager.ParsedConfig.html) type, which has the same form and is quite a bit easier to read!

Creating an `EntityManager` instance is really about creating a valid `Config` object.

The `Config` type has four type parameters. Only the first one is required, and for this demo we will use defaults for the other three. Here they are:

- `M extends`[`EntityMap`](/projects/entity-manager/configuration/#the-entitymap-type) - This is the most important parameter and will be different in every implementation. We'll address it below.

- `HashKey extends string` - This is the name of the generated hash key property that will be shared across all entities in the configuration. The default value is `'hashKey'`, and we will use that here.

- `RangeKey extends string` - This is the name of the generated range key property that will be shared across all entities in the configuration. The default value is `'rangeKey'`, and we will use that here.

- `T extends`[`TranscodeMap`](/projects/entity-manager/configuration/#the-transcodemap-type) - Relates the name of a [transcode](/projects/entity-manager/configuration/#transcodes) to the type of the value being transcoded. This parameter defaults to an extensible [DefaultTranscodeMap](https://docs.karmanivero.us/entity-tools/interfaces/entity_tools.DefaultTranscodeMap.html) type that will serve our purposes here.

Let's compose our configuration's `EntityMap`.

### `MyEntityMap` Type

An [`EntityMap`](http://localhost:4000/projects/entity-manager/configuration/#the-entitymap-type) is just a map of Typescript interfaces that define the structure of each entity in the configuration. The keys of the map are the entity names, and the values are the entity interfaces.

As a special convention, within each interface we identify _generated properties_ (the ones marked with a ⚙️ in our [table design](/projects/entity-manager/evolving-a-nosql-db-schema/#table-properties)) with a `never` type. This is a signal to the `Config` type that these properties require special support & configuration.

Here is the definition of `MyEntityMap` from [`entityManager.ts`](https://github.com/karmaniverous/entity-manager-demo/blob/main/src/entityManager.ts):

```ts
import type { EntityMap } from '@karmaniverous/entity-manager';
import type { Entity } from '@karmaniverous/entity-tools';

// Email interface. never types indicate generated properties.
interface Email extends Entity {
  created: number;
  email: string;
  userId: string;
  userHashKey: never; // generated
}

// User interface. never types indicate generated properties.
interface User extends Entity {
  beneficiaryId: string;
  created: number;
  firstName: string;
  firstNameCanonical: string;
  firstNameRangeKey: never; // generated
  lastName: string;
  lastNameCanonical: string;
  lastNameRangeKey: never; // generated
  phone?: string;
  updated: number;
  userBeneficiaryHashKey: never; // generated
  userId: string;
  userHashKey: never; // generated
}

// Entity interfaces combined into EntityMap.
interface MyEntityMap extends EntityMap {
  email: Email;
  user: User;
}
```

### `config` Object

The `config` object has a lot of moving parts, so it helps to come at the problem from a specific direction.

The properties of the demo config object defined below are arranged accordingly and explained in the comments. Only the Email entity config is commented, since the User config follows the same pattern.

Here are some important references from the comments:

- The demo [table design](/projects/entity-manager/evolving-a-nosql-db-schema/#table-properties).

- The demo [index design](http://localhost:4000/projects/entity-manager/evolving-a-nosql-db-schema/#indexes).

- [Transcodes](/projects/entity-manager/configuration/#transcodes) perform and reverse the conversion of a value into a string, often at a fixed width, for inclusion in a generated property while preserving its sorting characteristics. The [`defaultTranscodes`](https://github.com/karmaniverous/entity-tools/blob/main/src/defaultTranscodes.ts) object is used here since a `transcodes` object is not defined in the config. Available transcodes are:
  - `bigint20` - Pads a `bigint` to 20 characters.
  - `boolean` - As expected.
  - `fix6` - Pads a number to a fixed width with 6 decimal digits.
  - `int` - Pads a signed integer to a fixed width.
  - `string` - As expected.
  - `timestamp` - Pads a UNIX ms timestamp to a fixed width.

Visit [`entityManager.ts`](https://github.com/karmaniverous/entity-manager-demo/blob/main/src/entityManager.ts) to see this code in context.

```ts
import {
  type Config,
  EntityManager,
} from '@karmaniverous/entity-manager';

// Current timestamp will act as break point for sharding schedule.
const now = Date.now();

// Config object for EntityManager.
// Using default values for HashKey, RangeKey, and TranscodeMap
// type params.
const config: Config<MyEntityMap> = {
  // Common hash & range key properties for all entities. Must
  // exactly match HashKey & RangeKey type params.
  hashKey: 'hashKey',
  rangeKey: 'rangeKey',

  // Entity-specific configs. Keys must exactly match those of
  // MyEntityMap.
  entities: {
    // Email entity config.
    email: {
      // Source property for the Email entity's hash key.
      uniqueProperty: 'email',

      // Source property for timestamp used to calculate Email
      // shard key.
      timestampProperty: 'created',

      // Email entity's shard bump schedule. Records created before
      // now are unsharded (1 possible shard key). Records created
      // after now have a 1-char, 2-bit shard key (4 possible shard
      // keys).
      shardBumps: [{ timestamp: now, charBits: 2, chars: 1 }],

      // Email entity generated properties. These keys must match
      // the ones with never types in the Email interface defined
      // above, and are marked with a ⚙️ in the table design.
      generated: {
        userHashKey: {
          // When true, if any element is undefined or null, the
          // generated property will be undefined. When false,
          // undefined or null elements will be rendered as an
          // empty string.
          atomic: true,

          // Elements of the generated property. These MUST be
          // ungenerated properties (i.e. not marked with never
          // in the Email interface) and MUST be included in the
          // entityTranscodes object below. Elements are applied
          // in order.
          elements: ['userId'],

          // When this value is true, the generated property will
          // be sharded.
          sharded: true,
        },
      },

      // Indexes for the Email entity as specified in the index
      // design.
      indexes: {
        // Index components can be any combination of hashKey,
        // rangeKey, generated properties, and ungenerated
        // properties. Any ungenerated properties MUST be included
        // in the entityTranscodes object below. Property order is
        // not significant.
        created: ['hashKey', 'rangeKey', 'created'],
        userCreated: [
          'hashKey',
          'rangeKey',
          'userHashKey',
          'created',
        ],
      },

      // Transcodes for ungenerated properties used as generated
      // property elements or index components. Transcode values
      // must be valid config transcodes object keys. Since this
      // config does not define a transcodes object it uses
      // defaultTranscodes exported by @karmaniverous/entity-tools.
      elementTranscodes: {
        created: 'timestamp',
        userId: 'string',
      },
    },
    // User entity config.
    user: {
      uniqueProperty: 'userId',
      timestampProperty: 'created',
      shardBumps: [{ timestamp: now, charBits: 2, chars: 1 }],
      generated: {
        firstNameRangeKey: {
          atomic: true,
          elements: [
            'firstNameCanonical',
            'lastNameCanonical',
            'created',
          ],
        },
        lastNameRangeKey: {
          atomic: true,
          elements: [
            'lastNameCanonical',
            'firstNameCanonical',
            'created',
          ],
        },
        userBeneficiaryHashKey: {
          atomic: true,
          elements: ['beneficiaryId'],
          sharded: true,
        },
        userHashKey: {
          atomic: true,
          elements: ['userId'],
          sharded: true,
        },
      },
      indexes: {
        created: ['hashKey', 'rangeKey', 'created'],
        firstName: ['hashKey', 'rangeKey', 'firstNameRangeKey'],
        lastname: ['hashKey', 'rangeKey', 'lastNameRangeKey'],
        phone: ['hashKey', 'rangeKey', 'phone'],
        updated: ['hashKey', 'rangeKey', 'updated'],
        userBeneficiaryCreated: [
          'hashKey',
          'rangeKey',
          'userBeneficiaryHashKey',
          'created',
        ],
        userBeneficiaryFirstName: [
          'hashKey',
          'rangeKey',
          'userBeneficiaryHashKey',
          'firstNameRangeKey',
        ],
        userBeneficiaryLastName: [
          'hashKey',
          'rangeKey',
          'userBeneficiaryHashKey',
          'lastNameRangeKey',
        ],
        userBeneficiaryPhone: [
          'hashKey',
          'rangeKey',
          'userBeneficiaryHashKey',
          'phone',
        ],
        userBeneficiaryUpdated: [
          'hashKey',
          'rangeKey',
          'userBeneficiaryHashKey',
          'updated',
        ],
      },
      elementTranscodes: {
        beneficiaryId: 'string',
        created: 'timestamp',
        firstNameCanonical: 'string',
        lastNameCanonical: 'string',
        phone: 'string',
        updated: 'timestamp',
        userId: 'string',
      },
    },
  },
};

// Configure & export EntityManager instance.
export const entityManager = new EntityManager(config);
```

### Item Types

The `Email` and `User` interfaces defined above are not useful for data operations because...

- they don't include the `hashKey` and `rangeKey` properties that we specified in our **Entity Manager** `config` object, and

- their generated properties all have a `never` type.

The [`ItemMap`](http://localhost:4000/projects/entity-manager/configuration/#the-itemmap-type) type takes our `EntityMap` type as a parameter and returns a map of the correct item types. Let's do this and export the result for use in our endpoint handlers.

Visit [`entityManager.ts`](https://github.com/karmaniverous/entity-manager-demo/blob/main/src/entityManager.ts) to see this code in context.

```ts
import type { ItemMap } from '@karmaniverous/entity-manager';

// Construct ItemMap type from MyEntityMap.
type MyItemMap = ItemMap<MyEntityMap>;

// Export EmailItem & UserItem types for use in other modules.
export type EmailItem = MyItemMap['email'];
export type UserItem = MyItemMap['user'];
```

## DynamoDB Integration

There are a couple of different ways to run DynamoDB locally. See the [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) documentation for details.

We'll focus on executing our tests against a Docker image. A number of different paths will get you to a point where you can execute them. The instructions below document one such path on a Windows machine.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/). It's easy if you have [Chocolatey](https://community.chocolatey.org/) installed: `choco install docker-desktop`.

## `EntityClient` Configuration

{% include figure image_path="https://raw.githubusercontent.com/karmaniverous/entity-manager-demo/main/assets/entityClient.png" caption="_`EntityClient` configuration._" %}

TODO

## Endpoint Handlers

TODO

### Email Entity

TODO

#### Create Email

TODO

#### Read Email

TODO

#### Delete Email

TODO

#### Search Emails

TODO

### User Entity

TODO

#### Create User

TODO

#### Read User

TODO

#### Update User

TODO

#### Delete User

TODO

#### Search Users

TODO
