import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import * as cucumber from "@cucumber/cucumber"; // we need this to pass to the plugins' register methods
import cucumber_cfg from "./cucumber.json" with { "type": "json" }; // we need this to execute tests

// for simplicity's sake, the path to the support module entrypoint script is hard-coded here
// in reality, we would be resolving package names listed in a config file
await Promise.all([ "../support/support.js" ].map((plugin) => registerPlugin(plugin, cucumber)));

// now when we run Cucumber, the support code should be all loaded in
let opts = await loadConfiguration({ "provided": cucumber_cfg });
let res  = await runCucumber(opts.runConfiguration);
console.log(res.success);

// each plugin package should be dynamically imported (since the list is configurable)
// then we call the register function for each one to add its support code to Cucumber
async function registerPlugin(name, ...args) {
    const plugin = await import(name);

    plugin.register(...args);
}
