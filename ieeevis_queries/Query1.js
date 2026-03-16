const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

client
  .connect()
  .then(async () => {
    const db = client.db("ieeevisTweets");
    const tweets = db.collection("tweet");

    const count = await tweets.countDocuments({
      retweeted_status: { $exists: false },
      in_reply_to_status_id: null,
    });

    console.log(count);
    await client.close();
  })
  .catch((err) => {
    console.error(err);
  });
run();
