// netlify/functions/indexPost.js

// Funcția principală pentru Netlify
exports.handler = async (event, context) => {
  try {
    // Verificăm metoda HTTP
    if (event.httpMethod === "OPTIONS") {
      // CORS preflight
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        },
        body: "OK",
      };
    }

    if (event.httpMethod === "GET") {
      // Test rapid
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Funcția indexPost merge corect ✅" }),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      console.log("📦 Body primit:", body);

      // Poți adăuga aici logica ta — de ex. trimitere date la un API extern
      // const response = await fetch("https://api.exemplu.com/endpoint", { ... });

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          success: true,
          message: "POST primit cu succes 🚀",
          data: body,
        }),
      };
    }

    // Dacă e alt tip de request:
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
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
