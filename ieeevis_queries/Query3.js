const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
async function run() {
  await client.connect();
  const db = client.db("ieeevisTweets");
  const tweets = db.collection("tweet");

  const results = await tweets
    .aggregate([
      { $match: { "user.screen_name": { $ne: null } } },
      {
        $group: {
          _id: "$user.screen_name",
          tweetCount: { $sum: 1 },
        },
      },
      { $sort: { tweetCount: -1 } },
      { $limit: 1 },
    ])
    .toArray();

  console.log("Person with most tweets:");
  console.log(`${results[0]._id} - ${results[0].tweetCount}`);

  await client.close();
}

run();
