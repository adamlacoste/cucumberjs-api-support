// if we imported Cucumber here, we would get an invalid installation error
// so instead we export a register function which performs the setup with
// a Cucumber instance passed in as a param
export function register(cucumber) {
    cucumber.Given("some precondition is met", function () {
        console.log("Given step executed.");
    });

    cucumber.When("the user takes some action", function () {
        console.log("When step executed.");
    });

    cucumber.Then("a certain response is expected", function () {
        console.log("Then step executed.");
    });
}
