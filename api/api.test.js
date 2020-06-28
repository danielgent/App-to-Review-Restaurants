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

  it("should not allow any access when not logged in", async () => {
    const res = await agent.get("/");

    expect(res.statusCode).toBe(404);
  });

  it("should allow access when logged in", async () => {
    const token = jwt.sign({ role: "user" }, process.env.TOKEN_SECRET, {
      // TODO - set really low and then test token refresh
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
