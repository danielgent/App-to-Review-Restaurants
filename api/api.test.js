require("dotenv").config();

const request = require("supertest");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

var seedDb = require("./seedDb");
var createApp = require("./api");
const sgMail = require("@sendgrid/mail");

jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe("api tests", () => {
  let db;
  let app;
  let agent;

  let owner1Id;
  let restaurant1Id;
  let restaurant2Id;
  let user3Id;
  let review3Id;
  let adminId;
  let user4Id;

  let owner1Token;
  let user3Token;
  let user4Token;
  let adminToken;

  beforeAll(async () => {
    // TODO - try and split this huge test file up BUT would need one database per route
    var mongoDB = "mongodb://127.0.0.1:27017/testdb";

    mongoose.connect(mongoDB, { useNewUrlParser: true });

    db = mongoose.connection;

    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    app = createApp(db);

    agent = request.agent(app);

    ({
      owner1Id,
      restaurant1Id,
      restaurant2Id,
      user3Id,
      review3Id,
      adminId,
      user4Id,
    } = await seedDb());

    console.log("user3Id ", user3Id);

    owner1Token = jwt.sign(
      { role: "owner", id: owner1Id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    user3Token = jwt.sign(
      { role: "user", id: user3Id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    user4Token = jwt.sign(
      { role: "user", id: user4Id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    adminToken = jwt.sign(
      { role: "admin", id: adminId },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
  });

  beforeEach(async () => {
    await agent.get("/reloadDB");
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
        const res = await agent
          .get("/me")
          .set("Authorization", `Bearer ${user3Token}`);

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual(
          expect.objectContaining({
            id: user3Id,
            role: "user",
            username: "user-no-reviews",
            avatarFilename: "https://bit.ly/prosper-baba",
          })
        );
      });

      it("should not allow bad token", async () => {
        const badToken = jwt.sign({ role: "user", id: user3Id }, "NOT SECRET", {
          expiresIn: "24h",
        });

        const res = await agent
          .get("/me")
          .set("Authorization", `Bearer ${badToken}`);

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

      it("should reject bad password", async () => {
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

      it("should reject unverified account", async () => {
        const res = await agent.post("/login").send({
          username: "user-email-not-verified",
          password: "password",
        });

        expect(res.body.error).toBe(
          "Email not verified. Please check your inbox"
        );

        expect(res.statusCode).toBe(400);
      });

      it("should return role and token when login correct", async () => {
        const res = await agent.post("/login").send({
          username: "b-user",
          password: "password-2",
        });

        expect(res.body.role).toBe("user");
        expect(res.body.id).toBeTruthy();
        expect(res.body.token).toBeTruthy();

        expect(res.body).toEqual(
          expect.objectContaining({
            role: "user",
            avatarFilename: "https://bit.ly/sage-adebayo",
            username: "b-user",
          })
        );

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

        expect(sgMail.send).toHaveBeenCalledTimes(0);
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

        expect(sgMail.send).toHaveBeenCalledTimes(0);
      });
      it("should reject hack to grant admin role", async () => {
        const res = await agent.post("/register").send({
          username: "fooooz",
          email: "foooz@example.com",
          password: "xxxx",
          role: "admin",
        });

        expect(res.body.error).toBe("unauthorized attempt");
        expect(res.statusCode).toBe(403);

        expect(sgMail.send).toHaveBeenCalledTimes(0);
      });
      it("should accept signup", async () => {
        expect(sgMail.send).toHaveBeenCalledTimes(0);

        const res = await agent.post("/register").send({
          username: "fooooz",
          name: "Foooz",
          email: "foooz@example.com",
          password: "xxxx",
          role: "user",
        });

        expect(res.body.message).toBe("Email sent for account verification");
        expect(res.statusCode).toBe(200);

        expect(sgMail.send).toHaveBeenCalledTimes(1);

        expect(sgMail.send).toHaveBeenLastCalledWith(
          expect.objectContaining({
            from: process.env.SENDGRID_FROM_EMAIL,
            to: "foooz@example.com",
            subject: "Please verify your email",
          })
        );

        // Long one-liner for a test
        const verifyCode = sgMail.send.mock.calls[0][0].text
          .split("verify/")
          .slice(-1)[0];

        const res2 = await agent.get(`/verify/${verifyCode}`);

        expect(res2.statusCode).toBe(200);

        // now can login with this account (earlier test shows this failing)
        const res3 = await agent.post("/login").send({
          username: "fooooz",
          password: "xxxx",
        });

        expect(res3.statusCode).toBe(200);
      });
    });

    describe("/verify/", () => {
      it.todo("should reject non-existent code");
      it.todo("should reject account already verified");
      it("should verify new account already verified", async () => {
        const res = await agent.get(`/verify/example-verification-token`);

        expect(res.statusCode).toBe(200);

        // now can login with this account (earlier test shows this failing)
        const res2 = await agent.post("/login").send({
          username: "user-no-reviews",
          password: "password-3",
        });

        expect(res2.statusCode).toBe(200);
      });
    });
  });

  describe("users tests", () => {
    it("/users/profile should take new image file", async () => {
      const res = await agent
        .post(`/users/profile`)
        .attach("avatar", __dirname + "/fixtures/unicorns.jpg")
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(200);

      // TODO
      // - assert that has new profile pic BUT using random multer name. need to add predictable suffix for testing..
    });

    it("/users/unlock/ should unlock user", async () => {
      // user 4 is currently locked
      const blockedRes = await agent.post("/login").send({
        username: "user-locked-out",
        password: "password",
      });

      expect(blockedRes.body.error).toBe(
        "Too many failed login attempts. Account blocked. Please contact admin"
      );

      expect(blockedRes.statusCode).toBe(400);

      // now unlock user as admin
      const unlockRes = await agent
        .post(`/users/unlock/${user4Id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(unlockRes.statusCode).toBe(200);
      expect(unlockRes.body.message).toBe("User unlocked");

      // should now be unlocked
      const loginSuccessRes = await agent.post("/login").send({
        username: "user-locked-out",
        password: "password",
      });

      expect(loginSuccessRes.statusCode).toBe(200);
    });
  });

  describe("restaurant tests", () => {
    it("/restaurants/ should give list of all restaurants enriched", async () => {
      const res = await agent
        .get(`/restaurants`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(200);

      const restaurants = res.body.results;

      expect(restaurants).toHaveLength(19);

      // should return sorted from highest rated to lowest
      expect(restaurants[0].averageRating).toBe(4.6);
      expect(restaurants[restaurants.length - 1].averageRating).toBe(null);

      const ownersDiner = restaurants.find((r) => r.name === "Owner's Diner");

      expect(ownersDiner).toEqual(
        expect.objectContaining({
          name: "Owner's Diner",
          averageRating: 4,
        })
      );

      expect(ownersDiner.highReview).toEqual(
        expect.objectContaining({
          rating: 5,
        })
      );

      expect(ownersDiner.lowReview).toEqual(
        expect.objectContaining({
          rating: 3,
        })
      );

      const steakHouse = restaurants.find((r) => r.name === "Steak House");

      expect(steakHouse.recentReviews).toHaveLength(3);

      expect(steakHouse).toEqual(
        expect.objectContaining({
          name: "Steak House",
          averageRating: 2.6,
        })
      );

      expect(steakHouse.highReview).toEqual(
        expect.objectContaining({
          rating: 4,
        })
      );

      expect(steakHouse.lowReview).toEqual(
        expect.objectContaining({
          rating: 2,
        })
      );

      expect(steakHouse.recentReviews).toHaveLength(3);

      // check reviewers enriched correctly
      expect(steakHouse.highReview.reviewer).toEqual(
        expect.objectContaining({
          avatarFilename: "https://bit.ly/code-beast",
          username: "a",
        })
      );
      expect(steakHouse.lowReview.reviewer).toEqual(
        expect.objectContaining({
          avatarFilename: "https://bit.ly/ryan-florence",
          username: "user-locked-out",
        })
      );

      const pastaPasta = restaurants.find((r) => r.name === "Pasta Pasta");

      // restaurant without ratings
      expect(pastaPasta).toEqual(
        expect.objectContaining({
          name: "Pasta Pasta",
          averageRating: null,
        })
      );
    });

    it("/restaurants/ should filter based on query strings", async () => {
      const res = await agent
        .get(`/restaurants?ratingMin=4`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(200);

      expect(res.body.results).toHaveLength(7);

      const ownersDiner = res.body.results.find(
        ({ name }) => name === "Owner's Diner"
      );

      expect(ownersDiner).toEqual(
        expect.objectContaining({
          name: "Owner's Diner",
          averageRating: 4,
        })
      );

      const res2 = await agent
        .get(`/restaurants?ratingMin=2`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res2.statusCode).toBe(200);

      expect(res2.body.results).toHaveLength(18);

      const res3 = await agent
        .get(`/restaurants?ratingMin=5`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res3.statusCode).toBe(200);

      expect(res3.body.results).toHaveLength(0);
    });

    it("/restaurants/ should paginate", async () => {
      const secondPage = await agent
        .get(`/restaurants?page=1`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(secondPage.statusCode).toBe(200);

      expect(secondPage.body.totalPages).toBe(2);
      // not full second page
      expect(secondPage.body.results).toHaveLength(9);

      const firstPage = await agent
        .get(`/restaurants?page=0`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(firstPage.statusCode).toBe(200);

      expect(firstPage.body.totalPages).toBe(2);
      // full first page
      expect(firstPage.body.results).toHaveLength(10);

      const firstResults = firstPage.body.results;
      const secondResults = secondPage.body.results;

      // still ordering by descending average rating
      expect(
        firstResults[0].averageRating >
          firstResults[firstResults.length - 1].averageRating
      ).toBe(true);
      expect(
        firstResults[0].averageRating > secondResults[0].averageRating
      ).toBe(true);
      expect(
        secondResults[0].averageRating >
          secondResults[secondResults.length - 1].averageRating
      ).toBe(true);
    });

    it("/restaurants/ should reject bad query parameters", async () => {
      const res = await agent
        .get(`/restaurants?ratingMin=7`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(400);
    });

    it("/restaurants/me should give of own restaurants if owner", async () => {
      const res = await agent
        .get(`/restaurants/me`)
        .set("Authorization", `Bearer ${owner1Token}`);

      expect(res.statusCode).toBe(200);

      const restaurants = res.body;

      expect(restaurants).toHaveLength(9);

      expect(restaurants[0].name).toBe("Owner's Diner");
    });

    it("/restaurants/[id] should give restaurant enriched", async () => {
      const res = await agent
        .get(`/restaurants/${restaurant1Id}`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: "Owner's Diner",
          averageRating: 4,
        })
      );

      expect(res.body.highReview).toEqual(
        expect.objectContaining({
          rating: 5,
        })
      );

      expect(res.body.lowReview).toEqual(
        expect.objectContaining({
          rating: 3,
        })
      );

      expect(res.body.recentReviews).toHaveLength(2);
    });

    it("should create new restaurant", async () => {
      const res = await agent
        .post("/restaurants")
        .field("name", "A new restaurant")
        .set("Authorization", `Bearer ${owner1Token}`);

      expect(res.statusCode).toBe(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: "A new restaurant",
          owner: owner1Id,
        })
      );

      const newRestaurantId = res.body._id;

      // now get this restaurant
      const res2 = await agent
        .get(`/restaurants/${newRestaurantId}`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res2.body).toEqual(
        expect.objectContaining({
          name: "A new restaurant",
          averageRating: null,
          owner: owner1Id,
          highReview: null,
          lowReview: null,
          recentReviews: [],
        })
      );
    });
    // TO TEST
    // * when no token that rejects, and also bad token. just do in one test "when credentials are incorrect"
  });

  describe("reviews tests", () => {
    it("/reviews/me/restaurant/[id] should reply true if current user has left a review", async () => {
      const res = await agent
        .get(`/reviews/me/restaurant/${restaurant1Id}`)
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(200);

      // database resetting isn't working. if put this test last then this assertion fails
      expect(res.body).toBe(false);

      const res2 = await agent
        .get(`/reviews/me/restaurant/${restaurant2Id}`)
        .set("Authorization", `Bearer ${user4Token}`);

      expect(res2.statusCode).toBe(200);

      expect(res2.body).toBe(true);
    });

    it("/reviews/ should create new review", async () => {
      const res = await agent
        .post("/reviews")
        .send({
          comment: "lorem lorem lorem",
          restaurant: restaurant1Id,
          rating: 5,
          visitDate: "2020-04-04",
        })
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(200);

      const resUpdatedRestaurant = await agent
        .get(`/restaurants/${restaurant1Id}`)
        .set("Authorization", `Bearer ${user3Token}`);

      // should now be latest review for this restaurant
      expect(resUpdatedRestaurant.body.recentReviews[0]).toEqual(
        expect.objectContaining({
          comment: "lorem lorem lorem",
          restaurant: restaurant1Id,
          rating: 5,
          visitDate: "2020-04-04",
        })
      );

      // TO TEST
      // * is user, hasn't already left review
    });

    it("/reviews/ doesn't allow multiple reviews", async () => {
      await agent
        .post("/reviews")
        .send({
          comment: "lorem lorem lorem",
          restaurant: restaurant1Id,
          rating: 5,
          visitDate: "2020-04-04",
        })
        .set("Authorization", `Bearer ${user3Token}`);

      const res = await agent
        .post("/reviews")
        .send({
          comment: "lorem lorem lorem",
          restaurant: restaurant1Id,
          rating: 5,
          visitDate: "2020-04-04",
        })
        .set("Authorization", `Bearer ${user3Token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("One review per user limit");
    });

    it("/reviews/me/unreplied should give list of all unreplied reviews of owner's restaurants", async () => {
      const res = await agent
        .get(`/reviews/me/unreplied`)
        .set("Authorization", `Bearer ${owner1Token}`);

      expect(res.statusCode).toBe(200);

      const reviews = res.body;

      expect(reviews).toHaveLength(42);

      expect(reviews[0].comment).toBe(
        "I currently don't need any changes, but it's good to know you'll be able to assist, and that later on I'll be able to do it myself."
      );
    });

    it("/review/[id]/reply/ should create owner's reply", async () => {
      const res = await agent
        .post(`/reviews/${review3Id}/reply`)
        .send({
          reply: "some new reply from the owner",
        })
        .set("Authorization", `Bearer ${owner1Token}`);

      expect(res.statusCode).toBe(200);

      const resUpdatedRestaurant = await agent
        .get(`/restaurants/${restaurant1Id}`)
        .set("Authorization", `Bearer ${user3Token}`);

      const recentReviews = resUpdatedRestaurant.body.recentReviews;

      // should now see this updated reply
      expect(recentReviews[recentReviews.length - 1]).toEqual(
        expect.objectContaining({
          reply: "some new reply from the owner",
        })
      );

      // TO TEST
      // * is owner of that restaurant. anything else then can't. also that hasn't replied? (not huge problem just overwrite)
    });
  });
});
