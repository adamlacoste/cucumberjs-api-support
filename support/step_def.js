import { Given, When, Then } from "@cucumber/cucumber";

Given("some precondition is met", function () {
    console.log("Given step executed.");
});

When("the user takes some action", function () {
    console.log("When step executed.");
});

Then("a certain response is expected", function () {
    console.log("Then step executed.");
});
