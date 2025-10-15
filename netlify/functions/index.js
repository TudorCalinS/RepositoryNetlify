import algoliasearch from "algoliasearch";

// 🔐 Setări Algolia
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "TCTLP8TOBS";
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || "c5fff00660eded6e46dbe60d5beffd36";
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || "fb_Chirie_500_posts";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-my-secret",
    "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };

  // 🔹 OPTIONS — CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // 🔹 GET — căutare cu filtre (admin.html)
  if (event.httpMethod === "GET") {
    try {
      console.log("📡 Cerere GET primită (admin.html)");

      // Extragem parametrii de căutare
      const params = new URLSearchParams(event.rawQuery || "");
      const q = params.get("q") || "";
      const zona = params.get("zona") || "";
      const telefon = params.get("telefon") || "";
      const pret = params.get("pret") || "";
      const text = params.get("text") || "";
      const limit = parseInt(params.get("limit") || "200", 10);

      // Construim query-ul final
      let query = q || text || "";
      let filters = [];

      if (zona) filters.push(`text:${zona}`);
      if (telefon) filters.push(`text:${telefon}`);
      if (pret) filters.push(`text:${pret}`);

      const searchParams = {
        hitsPerPage: limit,
        filters: filters.join(" AND ") || undefined,
        sortFacetValuesBy: "count",
      };

      console.log("🔍 Căutare Algolia:", { query, filters: filters.join(" AND ") });

      const { hits } = await index.search(query, searchParams);

      // Sortăm descrescător după timestamp
      hits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(hits),
      };
    } catch (err) {
      console.error("❌ Eroare la citire Algolia:", err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  // 🔹 POST — salvare postare nouă
  if (event.httpMethod === "POST") {
    try {
      console.log("📨 Cerere POST primită...");
      const body = JSON.parse(event.body || "{}");

      if (!body.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Lipsește ID-ul postării" }),
        };
      }

      // Prevenim duplicatele — căutăm dacă există deja ID-ul
      const existing = await index.getObject(body.id).catch(() => null);
      if (existing) {
        console.log(`⚠️ Postarea ${body.id} există deja. Se actualizează.`);
      }

      await index.saveObject({
        objectID: body.id,
        text: body.text || "",
        url: body.url || "",
        author: body.author || "",
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Postare ${body.id} salvată/actualizată în Algolia`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Salvat în Algolia cu succes!" }),
      };
    } catch (error) {
      console.error("❌ Eroare Algolia:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  // 🔹 DELETE — ștergere postări duplicate sau selectate
  if (event.httpMethod === "DELETE") {
    try {
      console.log("🗑️ Cerere DELETE primită...");
      const body = JSON.parse(event.body || "{}");
      const ids = body.ids || [];

      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Lipsesc ID-urile pentru ștergere" }),
        };
      }

      await index.deleteObjects(ids);
      console.log(`✅ ${ids.length} obiecte șterse din Algolia`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: `Șterse ${ids.length} obiecte din Algolia` }),
      };
    } catch (err) {
      console.error("❌ Eroare la ștergere:", err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  // ❌ Orice altă metodă
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
}
