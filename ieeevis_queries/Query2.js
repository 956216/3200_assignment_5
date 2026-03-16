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
          followers: { $max: "$user.followers_count" },
        },
      },
      { $sort: { followers: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  console.log("Top 10 screen_names by followers:");
  results.forEach((item, i) => {
    console.log(`${i + 1}. ${item._id} - ${item.followers}`);
  });

  await client.close();
}

run();
