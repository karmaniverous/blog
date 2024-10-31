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

The details of an API implementation are beyond the scope of this demo, but we will develop the supporting functions that an API implementing the above data model would call to perform the following operations against DynamoDB:

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

We'll write unit tests to exercise these functions against DynamoDB using the [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) emulator. This will allow you to run the demo on your local machine without incurring any AWS costs (though these would be trivial) and without requiring an active connection to AWS.

## An Overview

TODO
