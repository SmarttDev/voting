// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("Greeter contract", function () {
  let accounts;
  before(async function () {
    accounts = await web3.eth.getAccounts();
  });
  describe("Deployment", function () {
    it("Should deploy with the right greeting", async function () {});
  });
});
