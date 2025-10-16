// netlify/functions/index.js
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const table = base("Anunturi");

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,x-my-secret",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };

  // Preflight pentru CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // ✅ Validare secret
  const secret = event.headers["x-my-secret"];
  if (secret !== process.env.MY_SECRET) {
    return { statusCode: 403, headers, body: "Secret invalid" };
  }

  // 🔹 RESETARE BAZĂ DE DATE
  if (event.httpMethod === "POST" && event.queryStringParameters?.action === "reset") {
    try {
      const records = await table.select().all();
      if (records.length === 0)
        return { statusCode: 200, headers, body: JSON.stringify({ message: "Baza de date este deja goală." }) };

      await Promise.all(records.map(r => table.destroy(r.id)));
      return { statusCode: 200, headers, body: JSON.stringify({ message: "✅ Baza de date a fost ștearsă complet." }) };
    } catch (e) {
      console.error("Eroare reset:", e);
      return { statusCode: 500, headers, body: "Eroare la resetare DB." };
    }
  }

  // 🔹 SALVARE ANUNȚURI (POST din extensie)
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      if (!data.id || !data.text)
        return { statusCode: 400, headers, body: "Lipsește id sau text" };

      // verificare dubluri
      const existing = await table.select({ filterByFormula: `{id} = "${data.id}"` }).firstPage();
      if (existing.length > 0) {
        return { statusCode: 200, headers, body: JSON.stringify({ duplicated: true }) };
      }

      await table.create([
        {
          fields: {
            id: data.id,
            text: data.text.substring(0, 1000),
            author: data.author || "",
            url: data.url || "",
            timestamp: new Date().toISOString(),
            images: (data.images || []).join(", "),
          },
        },
      ]);

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (err) {
      console.error("Eroare la POST:", err);
      return { statusCode: 500, headers, body: "Eroare la adăugare anunț" };
    }
  }

  // 🔹 CITIRE ANUNȚURI (GET pentru admin)
  if (event.httpMethod === "GET") {
    try {
      const { text, zona, pret, telefon, limit } = event.queryStringParameters || {};
      let filter = [];

      if (text) filter.push(`SEARCH(LOWER("${text}"), LOWER({text}))`);
      if (zona) filter.push(`SEARCH(LOWER("${zona}"), LOWER({text}))`);
      if (pret) filter.push(`SEARCH("${pret}", {text})`);
      if (telefon) filter.push(`SEARCH("${telefon}", {text})`);

      const formula = filter.length ? `AND(${filter.join(",")})` : "";

      const records = await table
        .select({
          filterByFormula: formula || undefined,
          maxRecords: limit ? parseInt(limit) : 50,
          sort: [{ field: "timestamp", direction: "desc" }],
        })
        .all();

      const result = records.map(r => ({
        id: r.get("id"),
        text: r.get("text"),
        author: r.get("author"),
        url: r.get("url"),
        images: r.get("images"),
        timestamp: r.get("timestamp"),
      }));

      return { statusCode: 200, headers, body: JSON.stringify(result) };
    } catch (err) {
      console.error("Eroare la GET:", err);
      return { statusCode: 500, headers, body: "Eroare la citire anunțuri" };
    }
  }

  return { statusCode: 405, headers, body: "Metodă neacceptată" };
}
