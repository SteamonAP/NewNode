const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/isAuth");
const sinon = require("sinon");

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

  it("should throw if token not verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should have userId afer decoding token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer zuabufuebfubfudf";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: 'acb'});
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(jwt.verify.called).to.be.true
    jwt.verify.restore();
  });
});
