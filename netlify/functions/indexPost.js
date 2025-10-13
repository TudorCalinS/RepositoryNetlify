// netlify/functions/indexPost.js

// 📦 Import Algolia (CommonJS — compatibil cu Netlify)
const algoliasearch = require("algoliasearch");

// 🔒 Cheia secretă trebuie să fie aceeași ca în popup-ul extensiei
const SECRET = process.env.SECRET || "111";

// 🔹 Config Algolia — preluate din variabilele de mediu (Netlify → Site Settings → Environment variables)
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
// folosim exact indexul tău
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX || "fb_Chirie_500_posts";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX);

exports.handler = async (event) => {
  try {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-my-secret",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    };

    // ✅ Răspuns rapid pentru preflight (CORS)
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }

    // ✅ GET de test
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: `Funcția indexPost merge corect ✅ — scrie în indexul ${ALGOLIA_INDEX}`,
        }),
      };
    }

    // ✅ POST — primește datele din extensie
    if (event.httpMethod === "POST") {
      const headers = event.headers || {};
      const authHeader =
        headers.authorization ||
        headers.Authorization ||
        headers["x-my-secret"] ||
        "";

      const key = authHeader.replace("Bearer ", "").trim();
      if (key !== SECRET) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Unauthorized: invalid secret key" }),
        };
      }

      // Parsează corpul cererii
      const body = JSON.parse(event.body || "{}");
      console.log("📦 Body primit:", body);

      // ✅ Trimitem postarea în Algolia
      const record = { objectID: body.id, ...body };
      await index.saveObject(record);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: `Post salvat în Algolia (${ALGOLIA_INDEX}) 🚀`,
          data: record,
        }),
      };
    }

    // ❌ Alte metode HTTP nu sunt acceptate
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    console.error("❌ Eroare în funcție:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
};
