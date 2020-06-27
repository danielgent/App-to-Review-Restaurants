const restaurants = [
  {
    id: "1",
    name: "Steak House",
    // part of this project might be graded on how these are calculated. Shouldn't really be an FE concern ever right
    averageRating: 4.8,
    // question here about what to return. FE does filtering or BE provides enriched data OR individual queries for reviews?
    // FE filter: CRUD just get everything.
    // BE enriched: would just require BE to do the filtering. Same implementation but at least can optimise on BE quicker
    // BE individual: would only be like 8 requests but still...
    highReview: "1",
    lowReview: "3",
  },
  {
    id: "2",
    name: "Jack's Diner",
    averageRating: 4.2,
    highReview: "4",
    lowReview: "2",
  },
];

export default restaurants;

// Future code if use these fixtures for tests
// const restaurant = restaurants.find((r) => r.id === id);

// const highReview = reviews.find((r) => r.id === restaurant.highReview);
// const lowReview = reviews.find((r) => r.id === restaurant.lowReview);

// const recentReviews = reviews.filter((r) => r.restaurant === id);

// ------------------------------------------------------------------
