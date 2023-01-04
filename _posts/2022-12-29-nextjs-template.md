---
# prettier-ignore
title: "Next.js Template"
excerpt: "A sweet Next.js project template. Integrates Redux Toolkit with with test support for Mocha + Chai + React Testing Library and release publishing via release-it."
header:
  og_image: /assets/images/logo-nextjs.png
  teaser: /assets/images/logo-nextjs.png
categories:
  - Blog
tags:
  - nextjs
  - react
  - template
toc: true
---

<figure class="align-left" style="margin-top: 10px; margin-bottom: 10px; width: 150px;">
    <img src="{{ site.url }}{{ site.baseurl }}/assets/images/logo-nextjs.png">
</figure>

Getting a [Next.js](https://nextjs.org/) application up and running is not a trivial exercise, especially if you want a robust and extensible result that will support a modern development process.

Here's a plug-and-play [Next.js template](https://github.com/karmaniverous/nextjs-template) that offers the following features:

- Tree-shakable support for the latest ES6 goodies with [`eslint`](https://www.npmjs.com/package/eslint) _uber alles_.

- User registration & authentication via [NextAuth.js](https://next-auth.js.org/), by default against an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) supporting native username/password authentication and one federated identity provider (Google).

- Support for public & private API endpoints, both local to NextJS and at any [AWS API Gateway](https://aws.amazon.com/api-gateway/) secured by the same Cognito User Pool.

- Configured to act as a front end & authentication client for my [AWS API Template](https://github.com/karmaniverous/aws-api-template) on the back end.

- Fully integrated application state management with the [Redux Toolkit](https://redux-toolkit.js.org/), including support for difficult-to-serialize types like `Date` & `BigInt`.

- Responsive UX with [Semantic UI React](https://react.semantic-ui.com/) with LESS theme overrides enabled & ready for input!

- A responsive & attractive sample UI that encapsulates a ton of common use cases into an opinionated architecture and a library of utility components.

- Automated [`lodash`](https://www.npmjs.com/package/lodash) cherry-picking with [`babel-plugin-lodash`](https://www.npmjs.com/package/babel-plugin-lodash).

- Front & back-end testing with [`mocha`](https://www.npmjs.com/package/mocha), [`chai`](https://www.npmjs.com/package/chai), and the [React Testing Library](https://www.npmjs.com/package/@testing-library/react). Includes examples and a sweet testing console!

- Code formatting at every save & paste with [`prettier`](https://www.npmjs.com/package/prettier).

- One-button release to GitHub with [`release-it`](https://www.npmjs.com/package/release-it).

{: .text-center}

[See it on GitHub!](https://github.com/karmaniverous/nextjs-template){: .btn .btn--info .btn--large}&nbsp;&nbsp;&nbsp;[Clone the Repo!](https://github.com/karmaniverous/nextjs-template/generate){: .btn .btn--primary .btn--large}

{: .notice--warning}

**This documentation is incomplete!** You'll see TODOs below where I'm still working on it, but since the underlying template is _very_ solid I wanted to get it out there sooner rather than later. I'll get it all done soon. Meanwhile don't hesitate to [raise an issue](https://github.com/karmaniverous/nextjs-template/issues/new) for any questions!

## Why?

Deploying a vanilla Next.js application is easy, but getting it to a point where it can support real-world requirements is a challenge. This template solves a lot of initial problems and gets you to a well-scaffolded, responsive web application with support for all the goodies, built-in navigation, and a powerful toolbox to drive future development.

This template is highly opinionated with respect to toolchain. It is _hard_ to get all of these bits to work together. It is _way_ easier to cut out the bits you don't need than figure out how to slot in the things you do. So that's what we have here.

Because this is a Next.js template, it works perfectly when deployed to [Vercel](https://vercel.com/). I've tried hard to make it host-agnostic, though, and I know for a fact that it works just as well deployed to [AWS Amplify](https://aws.amazon.com/amplify). It should work fine (possibly with some tweaks to the build process) at any host that supports Next.js.

## Setting Up Your Dev Environment

**Use [VS Code](https://code.visualstudio.com/) as your code editor!** Not an absolute requirement, but you'll be glad you did.

1.  [Click here](https://github.com/karmaniverous/nextja-template/generate) to generate a new repository from this template.

1.  Clone the new repository to your local machine.

1.  VS Code will ask to install a bunch of recommended extensions. Accept all of them. If you miss this prompt, follow these steps:

    - Open the VS Code Extensions tab
    - Enter `@recommended` into the search box
    - Click the Download link.

       <figure>
        <a href="/assets/images/npm-package-template-extensions.png">
          <img src="/assets/images/npm-package-template-extensions.png" style="width: 250px;">
        </a>
       </figure>

1.  Zero the package version and install dependencies by running these commands:

    ```bash
    npm version 0.0.0
    npm install
    ```

1.  Run your tests from the command line:

    ```bash
    npm run test

    # STATE
    #   ENTITY
    #     * validations
    #       ✔ * initializes state
    #     add entities
    #       * validations
    #         ✔ * select all entities
    #         ✔ * select one entity
    #         ✔ * select invalid entity
    #       update entities
    #         validations
    #           ✔ * select all entities
    #       remove entity
    #         validations
    #           ✔ * select all entities
    #
    # back-end test
    #   ✔ passes
    #
    # 7 passing (49ms)
    ```

    If you installed the VS Code extensions referenced above, use the `Testing` panel to visualize & run your unit tests.

     <figure>
      <a href="/assets/images/nextjs-template-testing-panel.png">
       <img src="/assets/images/nextjs-template-testing-panel.png">
      </a>
     </figure>

1.  Run your Next.js application locally by running:

    ```bash
    npm run dev
    ```

1.  Explore the sample application at [`http://localhost:3000`](http://localhost:3000).

1.  When you're done, return to your terminal and stop the dev server with `Ctrl-C`.

### Create Local Environment Variable Files

Look for these files in your project directory:

- `.env.local.template`
- `env/.env.dev.local.template`
- `env/.env.test.local.template`
- `env/.env.test.local.template`

Copy each of these files to the same location and remove the `template` extension from the copy.

**Do not simply rename these files!** Anybody who pulls your repo will need these templates to create the same files in his own local environment.

In the future, this will be accomplished with a single CLI command. ([#45](https://github.com/karmaniverous/nextjs-template/issues/45))

### Connect to GitHub

This template supports automated release management with [`release-it`](https://github.com/release-it/release-it).

If you use GitHub, create a [Personal Access Token](https://github.com/settings/tokens/new?scopes=repo&description=release-it)
and add it as the value of `GITHUB_TOKEN` in `.env.local`.

If you use GitLab, follow [these instructions](https://github.com/release-it/release-it#gitlab-releases) and place your token in the same file.

For other release control systems, consult the [`release-it` README](https://github.com/release-it/release-it#readme).

You can now publish a release to GitHub with this command:

```
npm run release
```

## Project Architecture

{: .notice--primary}

**TODO**

### File Structure

{: .notice--primary}

**TODO**

### NPM Scripts

{: .notice--primary}

**TODO**

### Environment Variables

Next.js has a \tortured relationship with environment variables and dotenv files.

Modern software applications are configuration-driven. I ought to be able to deploy the same application into my various testing and production environments, each with a unique set of configurations.

In a rational world, there are four categories of dotenv file:

| Scope       | Secret? | Example           |
| ----------- | :-----: | ----------------- |
| Application |   No    | `.env`            |
| Application |   Yes   | `.env.local`      |
| Environment |   No    | `.env.test`       |
| Environment |   Yes   | `.env.test.local` |

The first two are application-wide, but I should be able to create as many versions of the last two as I have environments and load them appropriately on deployment.

Non-secret files generally get pushed to the code repository, whereas secret files are preserved locally and their contents encoded into each environment's build pipeline.

The issues:

- Next.js only supports _three_ such environments, which _must_ be named `development`, `test`, and `production`.

- Next.js doesn't load these files consistently across environments.

- Next.js has complex rules around which variables are visible where (server side or in the browser).

There is no easy way to get Next.js to load different dotenv files from a different location. See the [Next.js docs](https://nextjs.org/docs/basic-features/environment-variables) for more info.

Meanwhile, deployment environments also get a say.

Next.js can only load the files that are actually available to it. On your ocal development environment, everything will work as expected. [Vercel](https://vercel.com/solutions/nextjs) (the native Next.js platform) and [AWS Amplify](https://docs.amplify.aws/guides/hosting/nextjs/q/platform/js/) (also an excellent choice) expose different sets of files to the Next.js build engine at different points in the process.

Finally, there is a way to load environment variables directly into Next.js, although doing so exposes ALL such variables to the browser, instead of just the ones with the `NEXT_PUBLIC_` prefix.

So it's a rich tapestry.

This template expresses an approach that offers the following features:

- You can define as many environments as you want and name them however you like.

- It works in your local dev environment and works well with both Vercel and AWS Amplify.

- Public variables are consistently visible in the browser when prefixed with `NEXT_PUBLIC_`, and private variables are only visible on the server side.

By way of demonstration, this template's live [`dev`](https://nextjs-template-dev.karmanivero.us/), [`test`](https://nextjs-template-test.karmanivero.us/), and [`prod`](https://nextjs-template.karmanivero.us/) demo environments integrate perfectly with my [AWS API Template](/blog/aws-api-template)'s corresponding demo environments.

There are three components to this approach:

- dotenv files
- Next.js config
- Build config

#### dotenv Files

Application-scoped dotenv files live in the main project directory. There are three of them:

| File                  | Description                                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env`                | Application settings. Syncs with the code repo.                                                                                                                             |
| `.env.local`          | Application secrets. Does _not_ sync with the repo.                                                                                                                         |
| `.env.local.template` | Application secrets template. Syncs with the repo. Copy it the first time you pull the repo to create an application secrets file and populate it to support local testing. |

Environment-scoped dotenv files live in the `env` directory. There is no limit to the number and names of supported environments. Each environment requires three files, e.g. for the `test` environment:

| File                       | Description                                                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env.test`                | Environment settings. Syncs with the code repo.                                                                                                                             |
| `.env.test.local`          | Environment secrets. Does _not_ sync with the repo.                                                                                                                         |
| `.env.test.local.template` | Environment secrets template. Syncs with the repo. Copy it the first time you pull the repo to create an environment secrets file and populate it to support local testing. |

#### Next.js Config

The application-scoped dotenv files have names and locations as expected by Next.js.

When running locally, they will be loaded. When deploying remotely as part of a build process, the application secrets will not be available and must be integrated with the build process as described below.

Environment-scoped dotenv files do NOT have names or locations as expected, and Next.js will NOT pick them up. Accordingly, I've added code to [next.config.mjs](https://github.com/karmaniverous/nextjs-template/blob/322e666ea612acd48e8f8a093172486ed2df111c/next.config.mjs#L17-L20) that loads these files based on an environment token passed on on the `ENV` variable. So to run Next.js locally using the `test` runtime environment, you would run:

```bash
cross-env ENV=test npm run dev
```

Note that this ALSO loads application secrets, thus exposing them to the browser! This is not a problem because these `.local` files are _only_ available locally. Application & environment secrets are loaded differently in the remote build process, and since these files are not present their contents will NOT be exposed to the browser in remote deployments.

#### Build Config

As a general rule, all application and environment secrets must be encoded into any remote build process. Both Vercel and AWS Amplify support build-specific environment variables, so each must be configured accordingly.

For Vercel, this is sufficient.

For Amplify, there is an additional problem: the contents of the `env` directory are not even available to `next.config.mjs`. So I've included an [`amplify.yml`](https://github.com/karmaniverous/nextjs-template/blob/main/amplify.yml) build script that merges all available environment variables, secret and otherwise, into the one `.env` file that Amplify seems to understand.

#### Environment Variable Bottom Line

Follow these rules:

- Use the four types of file as described in [dotenv Files](#dotenv-files) above.

- If you want a variable to be available in the browser, prefix its name with `NEXT_PUBLIC_`.

- Encode all application & environment secrets into your build process.

- Additionally encode an `ENV` variable into your build process that carries your environment token (e.g. `dev`, `test`, or `prod`).

- If you are deployng to AWS Amplify, and need to add more application or environment secrets, use the pattern in the [`amplify.yml`](https://github.com/karmaniverous/nextjs-template/blob/main/amplify.yml) `preBuild` section to integrate your new secrets with the build.

### State Model

This template relies heavily on the [Redux Toolkit](https://redux-toolkit.js.org/) for application state management.

Redux Toolkit is an efficient, highly opinionated wrapper around the very popular [Redux](https://redux.js.org/) library. It's better in every way and is the approach recommended by the Redux team.

Getting Redux Toolkit to play nicely with Next.js is not a trivial exercise and requires making some choices. This template solves those problems in an elegant way.

Redux Toolkit features the [createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter) (CRA), which generates a set of prebuilt reducers and selectors for performing CRUD operations on a normalized state structure containing instances of a particular type of data object. **Think of it as a NoSQL database in your Redux state!**

The front-end application doesn't leverage CRA, but I've included a sample [entity slice](https://github.com/karmaniverous/nextjs-template/tree/main/state/entitySlice.mjs) in my state model and written [some tests](https://github.com/karmaniverous/nextjs-template/tree/main/test/entity.test.jsx) to demonstrate ow it works.

#### Redux Store

{: .notice--primary}

**TODO**

#### Page Slice

{: .notice--primary}

**TODO**

#### Entity Slice

{: .notice--primary}

**TODO**

### User Authentication

User authentication is enabled using [NextAuth.js](https://next-auth.js.org/) against an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html).

For simplicity, we are assuming that the Cognito User Pool has its hosted UI configured. This supports a wide variety of federated login providers, including social logins like Google, Facebook, etc. See my [AWS API Template](https://github.com/karmaniverous/aws-api-template) for an example of how to set this up.

NextAuth can secure front-end routes (i.e. pages) and back-end routes (i.e. API endpoints). You can also pass session credentials to other resources secured by the same authentication provider, for example an AWS API Gateway route. See the [demo site](https://nextjs-template-preview.karmanivero.us/) for an example of this in action.

### Semantic UI

This template uses the [Semantic UI React](https://react.semantic-ui.com/) component set.

Your starting point is a nice reactive layout with a sticky sidebar that collapses down to a hamburger menu at mobile resolutions. There were some difficulties getting this to work properly with the installed version of Semantic UI; I've resolved these and commented those fixes in the code.

The Semantic toolkit is super flexible, so you can easily morph this into whatever layout works for you.

Semantic UI has a fantastic LESS-based theming system. It was a HUGE challenge getting this working properly within the Next.js context. Problem solved, though, so out of the box this template offers full Semantic UI theme support.

All aspects of the site theme can be controlled by modifying the contents of the [`semantic-ui`](https://github.com/karmaniverous/nextjs-template/tree/main/semantic-ui) directory.

Out of the box, this template leverages the Semantic UI `default` theme. Switch themes globally or at a component level by modifying [`theme.config`](https://github.com/karmaniverous/nextjs-template/tree/main/theme.config). Override every conceivable aspect of the current theme, with full access to all related LESS variables, by editing the templates in the `site` directory. To examine existing themes and borrow their settings as overrides, see the contents of `node_modules/semantic-ui-less/themes`.

[Click here](https://semantic-ui.com/usage/theming.html) to learn more about Semantic UI themes.

### Page Model

{: .notice--primary}

**TODO**

### Redirects

{: .notice--primary}

**TODO**

#### Global Redirects

{: .notice--primary}

**TODO**

#### Back-End Redirects

{: .notice--primary}

**TODO**

#### Front-End Redirects

{: .notice--primary}

**TODO**

## Components

{: .notice--primary}

**TODO**

## Configured Pages

{: .notice--primary}

**TODO**

### Public Home Page

{: .notice--primary}

**TODO**

### Private Page

The page at `/private` is only visible to authenticated users. This is accomplished by adding the route pattern to the `config` variable in [`middleware.js`](/middleware.js), like this:

```js
export const config = { matcher: ['/private'] };
```

If an unauthenticated user attempts to access this page, he will be redirected to a login page.

Note that the link to the Private page only appears in the sidebar when the user is authenticated. This is accomplished in [`SidebarItems.jsx`](/components/page/SidebarItems.jsx). Note that `router.push` does not support shallow routing to protected pages!

### Coming Soon Page

If the following environment variable condition is `true`, the application will display a coming soon page:

```js
process.env.NEXT_PUBLIC_COMING_SOON === '1' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview';
```

If it is `false`, then the application will display.

In the development environment, both variables may be set explicitly in `.env.development`. In deployed environments, they are set explicitly in `.env.production` but may be overridden in your deployment pipeline.

If you are hosted at Vercel, the hosting environment will populate the `NEXT_PUBLIC_VERCEL_ENV` environment variable to reflect your deployment type. This value will be `production` on your production branch and `preview` on all other branches.

## Unit Testing

{: .notice--primary}

**TODO**

## Common Tasks

### Add a Page

{: .notice--primary}

**TODO**

### Add an API Route

{: .notice--primary}

**TODO**

### Create & Run a Local Production Build

{: .notice--primary}

**TODO**

### Analyze Your Bundles

{: .notice--primary}

**TODO**

### Create a Release

{: .notice--primary}

**TODO**

### Integrate a Template Update

Follow [these instructions](https://karmanivero.us/blog/installing-github-repo-template-updates/).

## FAQ

### Why are all your tests `.jsx` files?

{: .notice--primary}

**TODO**

## Issues

- Authorization fails in local `prod` (i.e. `npm run build && npm run start` in your dev environment). This behavior arises from [this NextAuth issue](https://github.com/nextauthjs/next-auth/issues/6229). I'm tracking it actively.
