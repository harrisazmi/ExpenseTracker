export const runtime = 'edge';

export default async function handler(request: Request) {
  try {
    const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-luvcj/endpoint/data/v1/action/find', {
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
        filter: {},
        sort: { _id: -1 } // Sort by most recent first
      })
    });

    // Log the raw response status and text
    const responseText = await response.text();
    console.log('Response status:', response.status);

    // Try to parse the response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      return new Response(JSON.stringify({ 
        error: "Failed to parse response",
        rawResponse: responseText
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if the result has documents
    if (!result || !result.documents) {
      return new Response(JSON.stringify({ 
        error: "No documents found",
        fullResponse: result
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(result.documents), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch transactions",
      details: error instanceof Error ? error.message : error
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}