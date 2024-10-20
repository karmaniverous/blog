---
# prettier-ignore
title: "Intermediate Design"
excerpt: ""
header:
  og_image: /assets/images/architecture-banner.jpg
  teaser: /assets/images/architecture-square.jpg
categories:
  - Blog
tags:
  - architecture
  - design
  - project-governance
---

A client of mine is building a web application that features a complex data model, supported by a collection of APIs. My client has asked me to review their design & development processes and help them achieve a better outcome for the project.

As part of the discovery process, I asked the tech lead to show me a design artifact describing one of their APIs.

For the uninitiated: an [Application Programming Interface](https://en.wikipedia.org/wiki/API) (API) is a set of rules and protocols that allow one component of a software application to interact with other internal components or with another application. In the hierarchy of abstractions leading from an application's business requirements to its implementation in code, an API design sits right in the middle:

{% include figure image_path="/assets/diagrams/intermediate-design-abstraction-hierarchy-api.png" caption="_API designs in a typical application design hierarchy._" popup=true %}

It took a couple of minutes to clarify what I was after. But after some internal discussion, one of his developers shared his screen and brought up the [OpenAPI specification](https://swagger.io/specification/) for the API in question.

If you've never seen an OpenAPI (a.k.a. Swagger) spec, here's an example:

```json
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "description": "A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification",
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
      "name": "Swagger API Team"
    },
    "license": {
      "name": "MIT"
    }
  },
  "host": "petstore.swagger.io",
  "basePath": "/api",
  "schemes": [
    "http"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/pets": {
      "get": {
        "description": "Returns all pets from the system that the user has access to",
        "operationId": "findPets",
        "produces": [
          "application/json",
          "application/xml",
          "text/xml",
          "text/html"
        ],
        ...
      },
      ...
    },
    ...
  },
  ...
}
```

... only theirs went on vertically for **about a thousand lines**.

> A thousand-line JSON Swagger specification is not an API design artifact!

In this article, we will discuss:

- exactly _why_ a thousand-line JSON Swagger specification is not an API design artifact, and

- what design artifacts describing APIs and other technical abstractions actually _should_ look like (at least if you want to get any use out of them), and

- how to produce, maintain, and use these low-level design artifacts efficiently to achieve a better outcome for your project.
