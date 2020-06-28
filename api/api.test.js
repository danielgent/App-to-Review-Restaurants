require("dotenv").config();

const request = require("supertest");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

var seedDb = require("./seedDb");
var createApp = require("./api");

describe("api tests", () => {
  let db;
  let app;
  let agent;

  beforeAll(async () => {
    // TODO - try and split this up BUT would need one database per route
    var mongoDB = "mongodb://127.0.0.1:27017/testdb";

    mongoose.connect(mongoDB, { useNewUrlParser: true });

    db = mongoose.connection;

    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    app = createApp(db);

    agent = request.agent(app);

    await seedDb();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
  });

  describe("auth tests", () => {
    describe("/me/", () => {
      it("should not allow any access no token supplied", async () => {
        const res = await agent.get("/me");

        expect(res.statusCode).toBe(401);
      });

      it("should return user info when token supplied", async () => {
        const token = jwt.sign(
          { role: "user", id: "foo-bar" },
          process.env.TOKEN_SECRET,
          {
            // TODO - set really low and then test token refresh
            expiresIn: "24h",
          }
        );

        const res = await agent
          .get("/me")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.role).toBe("user");
        // returns back same id that we send
        expect(res.body.id).toBe("foo-bar");
      });

      it("should not allow bad token", async () => {
        const token = jwt.sign({ role: "user" }, "NOT KEY USED BY SERVER", {
          expiresIn: "24h",
        });

        const res = await agent
          .get("/me")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(401);
      });
    });
    describe("/login/", () => {
      it("should reject wrong username", async () => {
        const res = await agent.post("/login").send({
          username: "not a user",
          password: "xxxx",
        });

        expect(res.body.error).toBe("The username does not exist");

        expect(res.statusCode).toBe(400);
      });

      it("should reject bad password and block user after three attempts", async () => {
        const res = await agent.post("/login").send({
          username: "b-user",
          password: "xxxx",
        });

        expect(res.body.error).toBe("The password is invalid");

        expect(res.statusCode).toBe(400);
      });

      it("should blockreject bad password", async () => {
        const res = await agent.post("/login").send({
          username: "another-owner",
          password: "xxxx",
        });

        expect(res.body.error).toBe("The password is invalid");

        expect(res.statusCode).toBe(400);

        await agent.post("/login").send({
          username: "another-owner",
          password: "xxxx",
        });

        await agent.post("/login").send({
          username: "another-owner",
          password: "xxxx",
        });

        const blockedRes = await agent.post("/login").send({
          username: "another-owner",
          password: "xxxx",
        });

        expect(blockedRes.body.error).toBe(
          "Too many failed login attempts. Account blocked. Please contact admin"
        );

        expect(blockedRes.statusCode).toBe(400);
      });

      it("should return role and token when login correct", async () => {
        const res = await agent.post("/login").send({
          username: "b-user",
          password: "password-2",
        });

        expect(res.body.role).toBe("user");
        expect(res.body.id).toBeTruthy();
        expect(res.body.token).toBeTruthy();

        expect(res.statusCode).toBe(200);
      });
    });

    describe("/register/", () => {
      it("should reject duplicate username", async () => {
        const res = await agent.post("/register").send({
          username: "b-user",
          email: "foo@foo.com",
          password: "xxxx",
          role: "user",
        });

        expect(res.body.error).toBe(
          "This username is already in use. Please select another"
        );
        expect(res.statusCode).toBe(409);
      });
      it("should reject duplicate email", async () => {
        const res = await agent.post("/register").send({
          username: "fooooz",
          email: "another-owner@example.com",
          password: "xxxx",
          role: "user",
        });

        expect(res.body.error).toBe("This email address is already in use");
        expect(res.statusCode).toBe(409);
      });
      it("should reject hack to grant admin role", async () => {
        const res = await agent.post("/register").send({
          username: "fooooz",
          email: "foooz@example.com",
          password: "xxxx",
          role: "admin",
        });

        expect(res.body.error).toBe("unauthorized attempt");
        expect(res.statusCode).toBe(401);
      });
      it("should accept signup", async () => {
        const res = await agent.post("/register").send({
          username: "fooooz",
          email: "foooz@example.com",
          password: "xxxx",
          role: "user",
        });

        expect(res.body.message).toBe("Sign up done");
        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe("restaurant tests", () => {
    it("should allow access when token provided", async () => {
      const token = jwt.sign({ role: "user" }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });

      const res = await agent
        .get("/restaurants")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const restaurants = res.body;

      expect(restaurants).toHaveLength(2);

      expect(restaurants[0]).toEqual(
        expect.objectContaining({
          name: "Owner's Diner",
          averageRating: 4,
        })
      );

      expect(restaurants[0].highReview).toEqual(
        expect.objectContaining({
          rating: 5,
        })
      );

      expect(restaurants[0].lowReview).toEqual(
        expect.objectContaining({
          rating: 3,
        })
      );

      expect(restaurants[1].recentReviews).toHaveLength(2);

      expect(restaurants[1]).toEqual(
        expect.objectContaining({
          name: "Steak House",
          averageRating: 3,
        })
      );

      expect(restaurants[1].highReview).toEqual(
        expect.objectContaining({
          rating: 4,
        })
      );

      expect(restaurants[1].lowReview).toEqual(
        expect.objectContaining({
          rating: 2,
        })
      );

      expect(restaurants[1].recentReviews).toHaveLength(2);
    });
  });
});
