// netlify/functions/index.js

import algoliasearch from "algoliasearch";

// 🔐 Setează-ți aici datele tale Algolia
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "TCTLP8TOBS";
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || "c5fff00660eded6e46dbe60d5beffd36";
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || "fb_Chirie_500_posts";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };

  // ✅ Răspunde la preflight OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // ✅ GET de test
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Funcția Algolia merge corect ✅" })
    };
  }

  // ✅ POST — salvare în Algolia
  if (event.httpMethod === "POST") {
    try {
      // 🧩 Siguranță: nu crăpa dacă body e gol
      let body = {};
      try {
        body = JSON.parse(event.body || "{}");
      } catch (e) {
        console.warn("⚠️ Body invalid sau gol");
      }

      if (!body.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Lipsește ID-ul postării" })
        };
      }

      // 🔄 Salvare efectivă în Algolia
      await index.saveObject({
        objectID: body.id,
        title: body.title || body.text || "",
        description: body.description || "",
        url: body.url || "",
        timestamp: new Date().toISOString()
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "✅ Salvat în Algolia cu succes!" })
      };
    } catch (error) {
      console.error("❌ Eroare Algolia:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // ❌ Orice altă metodă
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" })
  };
}
