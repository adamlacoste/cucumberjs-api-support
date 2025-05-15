# Cucumber.js API Support Demo

This repo has been assembled to demonstrate some strange behavior from Cucumber when operating within a monorepo
structure where Cucumber's support code is spread among several peer sub-package directories.  The intention behind this
organizational structure is to provide a core package (here called `app`) which can run tests using Cucumber and is
enhanced by optional plugin packages (`support`) which contain Cucumber support code such as step definitions and param
types.  If a user configures `app` to include one or more of these `support` plugins, their Cucumber support code
should be registered with the `app` package's Cucumber instance prior to executing tests.

While it would have been ideal for `app` and all `support` packages to each maintain their own Cucumber dependencies,
the stateful nature of Cucumber appears to make this impossible.  Duplicate dependencies always result in this error:

```
Error:
          You're calling functions (e.g. "Given") on an instance of Cucumber that isn't running (status: PENDING).
          This means you may have an invalid installation, potentially due to:
          - Cucumber being installed globally
          - A project structure where your support code is depending on a different instance of Cucumber
          Either way, you'll need to address this in order for Cucumber to work.
          See https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md#invalid-installations
```

Leaving `support` packages with unmet Cucumber dependencies (e.g. by importing the package `@cucumber/cucumber` in
support code modules even though that package is not installed or saved as a package dependency) does not work; when
Cucumber (as executed by `app`) attempts to load these modules, their import statement resolution still attempts to find
the Cucumber dependency in that same `support` package.

The best way to solve this problem would seem to be to construct `support` packages such that they do not immediately
attempt to add their support code to Cucumber (since they cannot have an instance of their own), but instead to export
a function which registers the support code using an instance of Cucumber passed in as a param.  This way, the `app`
package can ensure that its Cucumber instance is the one that all `support` packages are using.  Unfortunately, this
still somehow runs afoul of the invalid installation error.

## Setup
1. `git clone git@github.com:adamlacoste/cucumberjs-api-support.git demo`
2. `cd demo/app`
3. `npm ci`
4. `node .`

## Structure

### Root
At the top level of this monorepo, the sub-package directories `app` and `support` are siblings.  Each has a separate
package.json file, as does the monorepo itself.  The top-level package.json contains no dependencies for the purpose of
keeping this demo simple.

### Core package (`app`)
This package has a dependency on `@cucumber/cucumber` so that it can execute tests.  Its entrypoint script `app.js`
imports both the main Cucumber entrypoint and the Javascript API (`@cucumber/cucumber/api`).  The latter is used to
process the contents of config file `cucumber.json` and execute the test(s), but before that happens, the former has to
be passed into the `register` function exported by the `support` package(s).  (For the purpose of keeping this demo
simple, the path of the `support` module is hard-coded.)  By doing this, we ought to be able to ensure that support
code is registered with the correct, singular instance of Cucumber.

### Support package (`support`)
This package contains no declared dependencies.  Its entrypoint script `support.js` just exports the only other module,
`step_def.js`, which contains a single export of its own: a `register` function which accepts a Cucumber instance as an
input param and uses it to add three step definitions to that instance's support code.  By using the instance passed in
from the calling code in `app`, we should ensure that everything is sharing the one true Cucumber instance.
