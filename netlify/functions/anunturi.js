import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.TCTLP8TOBS, // App ID din Algolia
  process.env.c5fff00660eded6e46dbe60d5beffd36 // Admin API Key
);

const index = client.initIndex("anunturi");

export default async function handler(event, context) {
  // ✅ Gestionare cereri OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-ingest-token"
      },
      body: ""
    };
  }

  // ✅ Permite CORS pentru toate răspunsurile
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-ingest-token"
  };

  // ✅ Permitem doar POST pentru inserare date
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  // ✅ Validare token securizat
  const token = event.headers["x-ingest-token"];
  if (!token || token !== process.env.Netzwerk2025) {
    return { statusCode: 403, headers, body: "Forbidden" };
  }

  try {
    const body = JSON.parse(event.body);

    // ✅ Structurare înregistrare pentru Algolia
    const record = {
      objectID: body.link, // unic pe baza linkului
      text: body.text,
      link: body.link,
      images: body.images || [],
      collected_at: new Date().toISOString(),
      collected_by: body.collected_by || "moderator"
    };

    // ✅ Salvăm în Algolia
    await index.saveObject(record);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, id: record.objectID })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}
