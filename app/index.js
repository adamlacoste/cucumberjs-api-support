import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import cucumber_cfg from "./cucumber.json" with { "type": "json" }

let opts = await loadConfiguration({ "provided": cucumber_cfg });
let res  = await runCucumber(opts.runConfiguration);
console.log(res.success);
