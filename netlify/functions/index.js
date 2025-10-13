import algoliasearch from 'algoliasearch';

const client = algoliasearch('APP_ID', 'ADMIN_API_KEY');
const index = client.initIndex('fb_Chirie_500_posts');

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    await index.saveObject({
      objectID: body.id,
      title: body.title,
      description: body.description,
      url: body.url,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Salvat în Algolia cu succes!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
