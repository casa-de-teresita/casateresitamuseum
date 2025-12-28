// netlify/functions/fetchRooms.js
exports.handler = async (event, context) => {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!SHEET_ID || !API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' })
      };
    }
    
    const range = 'Rooms!A2:E';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to fetch rooms from Sheets' }) 
      };
    }

    const data = await response.json();
    const rooms = (data.values || []).map((row) => ({
      id: row[0] || '',
      nom: row[1] || '',
      type: row[2] || '',
      prixBase: parseFloat(row[3]) || 0,
      capaciteMax: parseInt(row[4]) || 1,
    }));

    return { 
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(rooms) 
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};