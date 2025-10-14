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
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Credentials": "true",

  };

  // 🔹 2. OPTIONS — răspuns la preflight (browser check)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // 🔹 3. GET — preluare din Algolia pentru admin.html
  if (event.httpMethod === "GET") {
    try {
      console.log("📡 Cerere GET primită (admin.html)");

      const { hits } = await index.search("", { hitsPerPage: 50 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(hits)
      };
    } catch (err) {
      console.error("❌ Eroare la citire Algolia:", err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  // 🔹 4. POST — primire date din extensie
  if (event.httpMethod === "POST") {
    try {
      console.log("📨 Cerere POST primită...");
      const body = JSON.parse(event.body || "{}");

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

      await index.saveObject({
        objectID: body.id,
text: body.text || "",
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
  // 🔹 5. DELETE — ștergere postări duplicate din Algolia
  if (event.httpMethod === "DELETE") {
    try {
      console.log("🗑️ Cerere DELETE primită...");
      const body = JSON.parse(event.body || "{}");
      const ids = body.ids || [];

      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Lipsesc ID-urile pentru ștergere" })
        };
      }

      await index.deleteObjects(ids);
      console.log(`✅ ${ids.length} obiecte șterse din Algolia`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: `Șterse ${ids.length} obiecte din Algolia` })
      };
    } catch (err) {
      console.error("❌ Eroare la ștergere:", err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message })
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
