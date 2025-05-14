# Cucumber.js API Support Demo

This repo demonstrates some strange behavior from Cucumber when operating within a monorepo structure where supporting
code is spread across multiple package directories.  The intention behind this setup is for a core package (here called
`app`) to be capable of executing Cucumber tests by utilizing step definitions and other support code housed in peer
packages (here called `support`) which a user may opt into; the support packages extend the capabilities of the core
app.

## Setup
1. `git clone git@github.com:adamlacoste/cucumberjs-api-support.git demo`
2. `cd demo`
3. `npm ci`
4. `./demo.sh`

## Structure

### Root
At the top level of this monorepo, the sub-package directories `app` and `support` are installed as file dependencies
to make use of their script commands easier from the project root dir.  An `npm ci` at this level installs all
dependencies for both sub-packages to `./node_modules`.

### Core package (`app`)
This package has a dependency on `@cucumber/cucumber` so that it can execute tests.  Its entrypoint script `index.js`
imports Cucumber's Javascript API from `@cucumber/cucumber/api` and uses that module's export `loadConfiguration` to
process the contents of the config file `cucumber.json`, which contains paths to a Gherkin features directory located
within `app` and support code located in the peer package `support`.

Upon executing tests using `runCucumber`, the following error is produced:

```
Error:
          You're calling functions (e.g. "Given") on an instance of Cucumber that isn't running (status: PENDING).
          This means you may have an invalid installation, potentially due to:
          - Cucumber being installed globally
          - A project structure where your support code is depending on a different instance of Cucumber
          Either way, you'll need to address this in order for Cucumber to work.
          See https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md#invalid-installations
```

### Support package (`support`)
This package contains no declared dependencies.  Its sole module, `step_def.js`, does attempt to import
`@cucumber/cucumber` but I would expect this to fail because the dependency could not be resolved.  (In reality, the
error produced by running `step_def.js` is the invalid installation one shown above, probably due to the dependency
resolving to the root-level installation of `@cucumber/cucumber` which gets installed thanks to the file dependency on
`app`.)  Ideally, these import statements would work as intended when `step_def.js` is loaded by Cucumber in the `app`
logic.
