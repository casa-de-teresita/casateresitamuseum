// netlify/functions/fetchConfig.js
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
    
    const range = 'Configuration!A2:B';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to fetch config from Sheets' }) 
      };
    }

    const data = await response.json();
    const config = {};
    
    console.log('📋 Raw config data from Sheets:', data.values);
    
    (data.values || []).forEach((row) => {
      const key = row[0];
      const value = row[1];
      
      console.log(`   Processing: ${key} = ${value}`);
      
      if (key === 'whatsapp_number') {
        config.whatsappNumber = value;
      } else if (key === 'currency') {
        config.currency = value;
      } else if (key === 'check_in_time') {
        config.checkInTime = value;
      } else if (key === 'check_out_time') {
        config.checkOutTime = value;
      } else if (key === 'booking_rates') {
        // Parse the value properly - it might be "9.6" or "9.6/10"
        let parsedValue = value;
        
        // If it contains "/", take only the first part
        if (typeof value === 'string' && value.includes('/')) {
          parsedValue = value.split('/')[0];
        }
        
        // Convert to float
        const numValue = parseFloat(parsedValue);
        config.bookingRates = isNaN(numValue) ? 9.6 : numValue;
        
        console.log(`   ✅ booking_rates parsed: "${value}" -> ${config.bookingRates}`);
      }
    });

    console.log('✅ Final config object:', config);

    return { 
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(config) 
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};