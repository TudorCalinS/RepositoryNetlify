import algoliasearch from "algoliasearch";

// 🔐 Setări Algolia
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "TCTLP8TOBS";
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || "c5fff00660eded6e46dbe60d5beffd36";
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || "fb_Chirie_500_posts";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export async function handler(event) {
  // 🔹 1. Setează CORS headers
  const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-my-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};


  // 🔹 2. OPTIONS — răspuns la preflight (browser check)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // 🔹 3. GET — verificare rapidă (ping test)
  if (event.httpMethod === "GET") {
    console.log("📡 Ping GET primit!");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Funcția Algolia merge corect ✅" })
    };
  }

  // 🔹 4. POST — primire date din extensie
  if (event.httpMethod === "POST") {
    try {
      console.log("📨 Cerere POST primită...");

      // Încearcă să parsezi body-ul JSON
      let body = {};
      try {
        body = JSON.parse(event.body || "{}");
      } catch (e) {
        console.warn("⚠️ Body invalid sau gol:", event.body);
      }

      // Log vizibil în consola Netlify
      console.log("🧾 Postare primită:", {
        id: body.id,
        text: body.text?.substring(0, 60) || "",
        author: body.author || "necunoscut",
        url: body.url || "fără link"
      });

      if (!body.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Lipsește ID-ul postării" })
        };
      }

      // 🔄 Salvare în Algolia
      await index.saveObject({
        objectID: body.id,
        title: body.text || "",
        url: body.url || "",
        author: body.author || "",
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Postare ${body.id} salvată în Algolia`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Salvat în Algolia cu succes!" })
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
