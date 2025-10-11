// netlify/functions/indexPost.js

// Definim cheia secretă (aceeași pe care o pui în popup)
const SECRET = process.env.SECRET || "111"; // poți schimba "test123" cu ce vrei

exports.handler = async (event, context) => {
  try {
    // CORS pentru toate răspunsurile
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    };

    // ✅ Preflight OPTIONS
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }

    // ✅ GET simplu de test
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Funcția indexPost merge corect ✅" }),
      };
    }

    // ✅ POST — aici verificăm secretul
    if (event.httpMethod === "POST") {
      const authHeader = event.headers.authorization || "";
      const key = authHeader.replace("Bearer ", "").trim();

      if (key !== SECRET) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Unauthorized: invalid secret key" }),
        };
      }

      // Dacă secretul e valid, procesăm payloadul
      const body = JSON.parse(event.body || "{}");
      console.log("📦 Body primit:", body);

      // Aici poți adăuga logica ta custom (ex: trimitere spre Algolia)
      // await fetch("https://algolia.net/api", { ... })

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: "POST primit cu succes 🚀",
          data: body,
        }),
      };
    }

    // ❌ Dacă nu e GET/POST/OPTIONS
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
