import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex("posts");

export async function handler(event) {
  // 🔹 1. Setează CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-my-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // 🔹 2. Dacă e o cerere preflight (OPTIONS), răspunde fără eroare
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const body = JSON.parse(event.body);

    // 🔐 verificare secret opțională
    if (event.headers["x-my-secret"] !== process.env.MY_SECRET_KEY) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: "Acces interzis" }) };
    }

    await index.saveObject({
      objectID: body.id,
      title: body.title,
      description: body.description,
      url: body.url,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "✅ Salvat în Algolia cu succes!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
