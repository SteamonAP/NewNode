const expect = require("chai").expect;
const User = require("../models/user");
const authController = require("../controllers/auth");
const sinon = require("sinon");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

describe("AuthController test", () => {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://amoghpitale7:Steamonap%40123@cluster0.qhwtc5h.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0"
      )
      .then((res) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Amogh",
          posts: [],
          _id: "68024ba22c6dac5bc21304c4",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  it("should throw error if DB connection failed- code:500", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "Steamonap@123",
      },
    };
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });

  it("should send response with status! for valid user ", (done) => {
    const req = { userId: "68024ba22c6dac5bc21304c4" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        console.log("status set to", code);
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    authController
      .getUserStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("NEW!");
        done();
      });
  });
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
