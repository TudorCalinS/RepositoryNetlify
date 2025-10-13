import algoliasearch from 'algoliasearch';

export async function handler(event) {
  // Doar POST acceptat
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Verifică secretul primit din extensie
  const providedSecret = event.headers['x-my-secret'];
  const serverSecret = process.env.MY_SECRET_KEY;
  if (providedSecret !== serverSecret) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized: invalid secret key' }) };
  }

  // Parsează datele primite din extensie
  let post;
  try {
    post = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Inițializează clientul Algolia
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

  // Adaugă / actualizează postarea
  try {
    await index.saveObject({
      objectID: post.id,
      ...post
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (e) {
    console.error('Algolia error:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save to Algolia', details: e.message })
    };
  }
}
