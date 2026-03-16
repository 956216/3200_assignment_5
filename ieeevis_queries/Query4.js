const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
async function run() {
  await client.connect();
  const db = client.db("ieeevisTweets");
  const tweets = db.collection("tweet");

  const results = await tweets
    .aggregate([
      {
        $match: {
          "user.screen_name": { $ne: null },
          retweeted_status: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$user.screen_name",
          tweetCount: { $sum: 1 },
          avgRetweets: { $avg: "$retweet_count" },
        },
      },
      { $match: { tweetCount: { $gt: 3 } } },
      { $sort: { avgRetweets: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  console.log("Top 10 people by average retweets (more than 3 tweets):");
  results.forEach((item, i) => {
    console.log(
      `${i + 1}. ${item._id} - avg retweets: ${item.avgRetweets}, tweets: ${item.tweetCount}`
    );
  });

  await client.close();
}

run();
