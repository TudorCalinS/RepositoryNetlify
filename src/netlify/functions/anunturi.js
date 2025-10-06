import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.TCTLP8TOBS,
  process.env.c5fff00660eded6e46dbe60d5beffd36
);
const index = client.initIndex("anunturi");

export default async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validare token
  const token = event.headers["x-ingest-token"];
  if (!token || token !== process.env.Netzwerk2025) {
    return { statusCode: 403, body: "Forbidden" };
  }

  try {
    const body = JSON.parse(event.body);

    const record = {
      objectID: body.link, // unic pe baza linkului
      text: body.text,
      link: body.link,
      images: body.images || [],
      collected_at: new Date().toISOString(),
      collected_by: body.collected_by || "moderator"
    };

    await index.saveObject(record);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: record.objectID })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
