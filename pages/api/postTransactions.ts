export const runtime = 'edge';

export default async function handler(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-luvcj/endpoint/data/v1/action/insertOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.MONGODB_DATA_API_KEY!,
      },
      body: JSON.stringify({
        "collection":"DailyTransaction",
        "database":"budgetDatabase",
        "dataSource":"Cluster0",
        document: body
      })
    });

    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      message: "Transaction added", 
      id: result.insertedId 
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to add transaction",
      details: error 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}