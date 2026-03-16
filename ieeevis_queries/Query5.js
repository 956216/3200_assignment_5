const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

async function run() {
  await client.connect();
  const db = client.db("ieeevisTweets");
  const tweets = db.collection("tweet");

  await tweets.aggregate([
    { $group: { _id: "$user.id", user: { $first: "$user" } } },
    { $replaceRoot: { newRoot: "$user" } },
    { $out: "users" },
  ]).toArray();

  await tweets.aggregate([
    { $project: {
      user_id: "$user.id",
      text: 1,
      created_at: 1,
      retweet_count: 1,
      favorite_count: 1,
      in_reply_to_status_id: 1,
    } },
    { $out: "tweets_only" },
  ]).toArray();

  await client.close();
}

run();
