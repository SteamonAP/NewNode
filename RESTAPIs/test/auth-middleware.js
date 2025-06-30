const expect = require("chai").expect;
const authMiddleware = require("../middleware/isAuth");

describe("Auth Middleware", () => {
  it("should throw error if no auth present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated,Header missing"
    );
  });

  it("should throw error if authorization header is a single string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
