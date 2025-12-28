// src/services/dataManager.js - VERSION SANS ACCESSOIRES
import { roomsDetailed } from '../data/roomsData.js';
import { 
  fetchRoomsFromSheets, 
  fetchSpecialPrices, 
  fetchConfig, 
  fetchAvailability
} from './googleSheets';

// Default configuration (fallback)
const DEFAULT_CONFIG = {
  whatsappNumber: '59170675985',
  currency: 'USD',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  bookingRates: 9.6
};

// Cache
let roomsCache = null;
let specialPricesCache = [];
let configCache = DEFAULT_CONFIG;
let availabilityCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all rooms with fallback to hardcoded data
 */
export async function getRooms() {
  const now = Date.now();
  
  if (roomsCache && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('📦 Using cached rooms');
    return roomsCache;
  }

  try {
    const sheetsRooms = await fetchRoomsFromSheets();
    
    if (sheetsRooms && sheetsRooms.length > 0) {
      console.log('🔄 Merging Sheets data with hardcoded data...');
      
      roomsCache = sheetsRooms.map((sheetRoom) => {
        const hardcodedRoom = roomsDetailed.find(r => r.id === sheetRoom.id);
        
        if (!hardcodedRoom) {
          console.warn(`⚠️ No hardcoded data found for room: ${sheetRoom.id}`);
          return null;
        }

        const mergedRoom = {
          ...hardcodedRoom,
          name: sheetRoom.nom ? {
            en: sheetRoom.nom,
            es: sheetRoom.nom
          } : hardcodedRoom.name,
          price: sheetRoom.prixBase,
          sheetPrice: sheetRoom.prixBase,
          hardcodedPrice: hardcodedRoom.price,
          capaciteMax: sheetRoom.capaciteMax,
          available: sheetRoom.capaciteMax,
        };
        
        return mergedRoom;
      }).filter(Boolean);
      
      lastFetchTime = now;
      console.log('✅ Merged rooms data:', roomsCache.length, 'rooms');
      return roomsCache;
    }
  } catch (error) {
    console.warn('⚠️ Sheets unavailable, using fallback data', error);
  }

  roomsCache = roomsDetailed.map(room => ({
    ...room,
    sheetPrice: null,
    hardcodedPrice: room.price
  }));
  lastFetchTime = now;
  console.log('📦 Using hardcoded fallback data');
  return roomsCache;
}

/**
 * Get special prices - ALWAYS FETCH FRESH DATA
 */
export async function getSpecialPrices() {
  try {
    console.log('🔄 Fetching fresh special prices...');
    const prices = await fetchSpecialPrices();
    if (prices) {
      specialPricesCache = prices;
      console.log('✅ Special prices updated:', prices.length, 'entries');
      return prices;
    }
  } catch (error) {
    console.warn('⚠️ Error fetching special prices, using cache');
  }
  
  return specialPricesCache;
}

/**
 * Get configuration with fallback
 */
export async function getConfig() {
  try {
    const config = await fetchConfig();
    
    console.log('🔧 Config received from Sheets:', config);
    
    if (config && config.whatsappNumber) {
      let bookingRates = DEFAULT_CONFIG.bookingRates;
      
      if (config.bookingRates !== undefined && config.bookingRates !== null) {
        if (typeof config.bookingRates === 'number') {
          bookingRates = config.bookingRates;
        } else if (typeof config.bookingRates === 'string') {
          const str = config.bookingRates;
          if (str.includes('/')) {
            bookingRates = parseFloat(str.split('/')[0]) || DEFAULT_CONFIG.bookingRates;
          } else {
            bookingRates = parseFloat(str) || DEFAULT_CONFIG.bookingRates;
          }
        }
      }
      
      configCache = {
        ...DEFAULT_CONFIG,
        ...config,
        bookingRates: bookingRates
      };
      
      console.log('✅ Config loaded with booking_rates:', bookingRates);
      return configCache;
    }
  } catch (error) {
    console.warn('⚠️ Using default config due to error:', error);
  }
  
  return configCache;
}

/**
 * Get availability data
 */
export async function getAvailability() {
  try {
    const availability = await fetchAvailability();
    if (availability) {
      availabilityCache = availability;
      return availability;
    }
  } catch (error) {
    console.warn('Using cached or empty availability');
  }
  
  return availabilityCache;
}

/**
 * Get the base price for a room with proper fallback hierarchy
 */
function getBasePrice(room) {
  if (room.sheetPrice && room.sheetPrice > 0) {
    return room.sheetPrice;
  }
  
  if (room.hardcodedPrice && room.hardcodedPrice > 0) {
    return room.hardcodedPrice;
  }
  
  return room.price || 0;
}

/**
 * Get the current price for a specific date
 */
export async function getCurrentPrice(roomId, date) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    console.warn(`❌ Room not found: ${roomId}`);
    return 0;
  }

  const basePrice = getBasePrice(room);
  const specialPrices = await getSpecialPrices();
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  console.log(`🔍 Checking price for ${roomId} on ${checkDate.toISOString().split('T')[0]}`);
  console.log(`   Base price: $${basePrice}`);
  
  for (const sp of specialPrices) {
    if (sp.chambreId === roomId) {
      const spStartDate = new Date(sp.dateDebut);
      const spEndDate = new Date(sp.dateFin);
      spStartDate.setHours(0, 0, 0, 0);
      spEndDate.setHours(0, 0, 0, 0);
      
      if (checkDate >= spStartDate && checkDate <= spEndDate) {
        console.log(`   ✅ Special price found: $${sp.prix}`);
        return sp.prix;
      }
    }
  }
  
  console.log(`   ℹ️ No special price found, using base price: $${basePrice}`);
  return basePrice;
}

/**
 * Calculate total price for a date range
 */
export async function calculateTotalPrice(roomId, checkIn, checkOut) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room || !checkIn || !checkOut) {
    return { totalPrice: 0, nightlyPrices: [], basePrice: 0, nights: 0 };
  }

  const basePrice = getBasePrice(room);
  const specialPrices = await getSpecialPrices();
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  if (nights <= 0) {
    return { totalPrice: 0, nightlyPrices: [], basePrice: basePrice, nights: 0 };
  }

  console.log(`\n💰 Calculating price for ${roomId} (${nights} nights)`);
  console.log(`   Base price: $${basePrice}`);

  const nightlyPrices = [];
  let totalPrice = 0;
  
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);
    
    let nightPrice = basePrice;
    let priceType = 'base';
    
    for (const sp of specialPrices) {
      if (sp.chambreId === roomId) {
        const spStartDate = new Date(sp.dateDebut);
        const spEndDate = new Date(sp.dateFin);
        spStartDate.setHours(0, 0, 0, 0);
        spEndDate.setHours(0, 0, 0, 0);
        
        if (currentDate >= spStartDate && currentDate <= spEndDate) {
          nightPrice = sp.prix;
          priceType = 'special';
          console.log(`   ✅ ${currentDate.toISOString().split('T')[0]}: $${nightPrice} (special)`);
          break;
        }
      }
    }
    
    if (priceType === 'base') {
      console.log(`   ℹ️ ${currentDate.toISOString().split('T')[0]}: $${nightPrice} (base)`);
    }
    
    nightlyPrices.push({
      date: new Date(currentDate),
      price: nightPrice,
      type: priceType,
      isDifferentFromBase: nightPrice !== basePrice,
      isHigherThanBase: nightPrice > basePrice,
      isLowerThanBase: nightPrice < basePrice
    });
    
    totalPrice += nightPrice;
  }
  
  console.log(`   📊 Total: $${totalPrice} for ${nights} nights\n`);
  
  return {
    totalPrice,
    nightlyPrices,
    basePrice: basePrice,
    nights
  };
}

/**
 * Calculate available rooms for a specific date range
 */
export async function getAvailableRooms(roomId, checkIn, checkOut = null) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return { available: 0, capaciteMax: 0, isAvailable: false };
  }

  const availability = await getAvailability();
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = checkOut ? new Date(checkOut) : new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);
  
  let unavailableCount = 0;
  
  for (const av of availability) {
    if (av.chambreId === roomId && av.statut === 'Unavailable') {
      const avStartDate = new Date(av.dateDebut);
      const avEndDate = new Date(av.dateFin);
      avStartDate.setHours(0, 0, 0, 0);
      avEndDate.setHours(0, 0, 0, 0);
      
      if (checkInDate <= avEndDate && checkOutDate >= avStartDate) {
        unavailableCount++;
      }
    }
  }
  
  const availableCount = room.capaciteMax - unavailableCount;
  const isAvailable = availableCount > 0;
  
  console.log(`🏨 ${roomId}: ${availableCount}/${room.capaciteMax} available`);
  
  return {
    available: Math.max(0, availableCount),
    capaciteMax: room.capaciteMax,
    isAvailable
  };
}

/**
 * Get enriched room data with current availability and pricing
 */
export async function getEnrichedRoom(roomId, checkIn = new Date(), checkOut = null) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return null;
  }

  const currentPrice = await getCurrentPrice(roomId, checkIn);
  const { available, capaciteMax, isAvailable } = await getAvailableRooms(
    roomId, 
    checkIn, 
    checkOut
  );

  return {
    ...room,
    price: currentPrice,
    basePrice: getBasePrice(room),
    available,
    capaciteMax,
    isAvailable,
  };
}

/**
 * Get all enriched rooms with current availability and pricing
 */
export async function getEnrichedRooms(checkIn = new Date(), checkOut = null) {
  const rooms = await getRooms();
  
  const enrichedRooms = await Promise.all(
    rooms.map(room => getEnrichedRoom(room.id, checkIn, checkOut))
  );
  
  return enrichedRooms.filter(Boolean);
}

/**
 * Clear cache
 */
export function clearCache() {
  roomsCache = null;
  specialPricesCache = [];
  configCache = DEFAULT_CONFIG;
  availabilityCache = [];
  lastFetchTime = 0;
  console.log('🔄 Cache cleared');
}

/**
 * Get data source info
 */
export function getDataSource() {
  if (!roomsCache) return 'unknown';
  const hasSheetPrices = roomsCache.some(room => room.sheetPrice && room.sheetPrice > 0);
  return hasSheetPrices ? 'sheets' : 'fallback';
}