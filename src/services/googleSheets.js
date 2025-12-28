// src/services/googleSheets.js - Sans Accessoires

/**
 * Fetch rooms via Netlify Function
 */
export async function fetchRoomsFromSheets() {
  try {
    const response = await fetch('/.netlify/functions/fetchRooms');
    if (!response.ok) {
      console.error('Failed to fetch rooms from server');
      return null;
    }
    const rooms = await response.json();
    console.log('✅ Rooms loaded from server:', rooms);
    return rooms;
  } catch (error) {
    console.error('Error fetching rooms from server:', error);
    return null;
  }
}

/**
 * Fetch special prices via Netlify Function
 */
export async function fetchSpecialPrices() {
  try {
    const response = await fetch('/.netlify/functions/fetchSpecialPrices');
    if (!response.ok) return [];
    const specialPrices = await response.json();
    console.log('✅ Special prices loaded:', specialPrices.length);
    return specialPrices;
  } catch (error) {
    console.error('Error fetching special prices:', error);
    return [];
  }
}

/**
 * Fetch configuration via Netlify Function
 */
export async function fetchConfig() {
  try {
    const response = await fetch('/.netlify/functions/fetchConfig');
    if (!response.ok) return null;
    const config = await response.json();
    console.log('✅ Config loaded:', config);
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
}

/**
 * Fetch availability via Netlify Function
 */
export async function fetchAvailability() {
  try {
    const response = await fetch('/.netlify/functions/fetchAvailability');
    if (!response.ok) return [];
    const availability = await response.json();
    console.log('✅ Availability loaded:', availability.length, 'entries');
    return availability;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
}