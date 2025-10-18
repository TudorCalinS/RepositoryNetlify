import { handler } from './netlify/functions/index.js';

const event = {
  httpMethod: "POST",
  headers: {
    "x-my-secret": "valoarea-ta-secretă" // pune exact ce ai în process.env.MY_SECRET
  },
  body: JSON.stringify({ id: "1", text: "Salut" }),
  queryStringParameters: { action: "reset" } // sau alte query-uri dacă vrei
};

handler(event).then(res => console.log(res)).catch(err => console.error(err));
