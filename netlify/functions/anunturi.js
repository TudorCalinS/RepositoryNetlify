// netlify/functions/anunturi.js
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.TCTLP8TOBS,      // App ID din Algolia
  process.env.c5fff00660eded6e46dbe60d5beffd36 // Admin API Key
);
const index = client.initIndex("anunturi");

export default async function handler(event, context) {
  // ✅ Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-ingest-token"
      }
    });
  }

  // ✅ Acceptăm doar POST
  if (event.httpMethod !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // ✅ Validare token
  const token = event.headers["x-ingest-token"];
  if (!token || token !== process.env.Netzwerk2025) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = JSON.parse(event.body);

    // ✅ Structurăm înregistrarea pentru Algolia
    const record = {
      objectID: body.link, // unic pe baza linkului
      text: body.text,
      link: body.link,
      images: body.images || [],
      collected_at: new Date().toISOString(),
      collected_by: body.collected_by || "moderator"
    };

    await index.saveObject(record);

    return new Response(JSON.stringify({ ok: true, id: record.objectID }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
