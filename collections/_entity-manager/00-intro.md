---
title: Meet Entity Manager!
excerpt: NoSQL shifts the burden of complexity from the database platform to the developer. **Entity Manager** sweeps it under the rug!
permalink: /projects/entity-manager/intro/
redirect_from:
  - /projects/entity-manager/
---

<figure class="align-left drop-image">
    <img src="/assets/collections/entity-manager/entity-manager-square.jpg">
</figure>

The **Entity Manager** package implements rational indexing & cross-shard querying at scale in your NoSQL database so you can focus on your application logic.

Traditional [relational database](https://en.wikipedia.org/wiki/Relational_database) systems like [MySQL](https://www.mysql.com/) implement indexing & scaling strategies at a platform level based on schemas defined at design time.

[NoSQL](https://en.wikipedia.org/wiki/NoSQL) platforms like [DynamoDB](https://aws.amazon.com/dynamodb/) offer far better performance at scale, but structured index & shard keys must be defined as data elements and exploited by application logic in data retrieval & cross-shard queries.

> NoSQL shifts the burden of complexity from the database platform to the developer. **Entity Manager** sweeps it under the rug.

## What is Entity Manager?

**Entity Manager** encapsulates a **provider-agnostic, highly opinionated approach** to the [single-table design pattern](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/).

With **Entity Manager**, you can:

- **Define related data entities & structured keys** wth a simple, declarative configuration format.

- **Specify a partition sharding strategy** that maximizes query performance while permitting planned, staged scaling over time.

- **Add or remove structured index keys** from entity data objects with a single method call.

- **Perform paged, cross-shard, multi-index queries** with a single method call.

## About This Guide

Here's a breakdown of the other sections in this guide:

- [**SQL vs NoSQL**](/projects/entity-manager/sql-vs-nosql/) – A comparison of the two database paradigms and how **Entity Manager** bridges the gap.

- [**Evolving a NoSQL Database Schema**](/projects/entity-manager/evolving-a-nosql-db-schema/) – A deep dive into what a NoSQL database schema actually looks like and how **Entity Manager** interprets it.
