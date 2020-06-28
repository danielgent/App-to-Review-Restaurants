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
    it("/me/ should not allow any access no token supplied", async () => {
      const res = await agent.get("/me");

      expect(res.statusCode).toBe(401);
    });

    it("/me/ should return role when token supplied", async () => {
      const token = jwt.sign({ role: "user" }, process.env.TOKEN_SECRET, {
        // TODO - set really low and then test token refresh
        expiresIn: "24h",
      });

      const res = await agent
        .get("/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.role).toBe("user");
    });

    it("/me/ should not allow bad token", async () => {
      const token = jwt.sign({ role: "user" }, "NOT KEY USED BY SERVER", {
        expiresIn: "24h",
      });

      const res = await agent
        .get("/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(401);
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
