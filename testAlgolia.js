import algoliasearch from "algoliasearch";

const client = algoliasearch("TCTLP8TOBS", "c5fff00660eded6e46dbe60d5beffd36");
const index = client.initIndex("fb_Chirie_500_posts");

(async () => {
  const res = await index.saveObject({
    objectID: "test123",
    title: "test de conexiune",
    description: "salvare manuală",
    timestamp: new Date().toISOString(),
  });
  console.log(res);
})();

