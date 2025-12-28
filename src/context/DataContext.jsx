// src/context/DataContext.jsx - OPTIMISÉ POUR PERFORMANCES
import { createContext, useContext, useState, useEffect } from 'react';
import { roomsDetailed } from '../data/roomsData';
import { 
  getRooms,
  getEnrichedRooms,
  getConfig,
  clearCache 
} from '../services/dataManager';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  // Données immédiates (hardcoded fallback) - PAS de loading
  const [rooms, setRooms] = useState(roomsDetailed);
  const [config, setConfig] = useState({
    whatsappNumber: '59170675985',
    currency: 'USD',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    bookingRates: 9.6
  });
  
  // Loading states - uniquement pour updates
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [dataSource, setDataSource] = useState('fallback');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // ✅ OPTIMISATION: Chargement ASYNCHRONE avec requestIdleCallback
  const loadData = async (checkIn = new Date(), checkOut = null, silent = false) => {
    if (!silent) {
      console.log('📊 Loading data progressively...');
    }
    
    try {
      // ✅ Charger en parallèle mais ne pas bloquer le rendu
      const loadPromise = Promise.all([
        getRooms(),
        getConfig()
      ]);

      // ✅ Utiliser requestIdleCallback pour ne pas bloquer
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          const [roomsData, configData] = await loadPromise;
          updateState(roomsData, configData, checkIn, checkOut);
        });
      } else {
        // Fallback: setTimeout
        setTimeout(async () => {
          const [roomsData, configData] = await loadPromise;
          updateState(roomsData, configData, checkIn, checkOut);
        }, 0);
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setDataSource('fallback');
      setIsInitialLoad(false);
    }
  };

  // ✅ Fonction helper pour mettre à jour le state
  const updateState = async (roomsData, configData, checkIn, checkOut) => {
    try {
      // Update rooms si disponibles
      if (roomsData && roomsData.length > 0) {
        // ✅ Enrichir avec availability EN ARRIÈRE-PLAN
        const enrichedRooms = await getEnrichedRooms(checkIn, checkOut);
        setRooms(enrichedRooms);
        setDataSource('sheets');
        console.log('✅ Rooms updated with Sheets data');
      } else {
        setDataSource('fallback');
        console.log('📦 Using hardcoded fallback');
      }

      // Update config si disponible
      if (configData && configData.whatsappNumber) {
        setConfig(configData);
        console.log('✅ Config updated');
      }

      setLastUpdateTime(new Date());
    } finally {
      setIsInitialLoad(false);
    }
  };

  const refreshData = async (checkIn = new Date(), checkOut = null) => {
    clearCache();
    await loadData(checkIn, checkOut);
  };

  useEffect(() => {
    // ✅ Initial load ASYNCHRONE (ne bloque pas le premier rendu)
    loadData(new Date(), null, true);

    // ✅ Auto-refresh toutes les 5 minutes (silent)
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh (silent)...');
      loadData(new Date(), null, true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider
      value={{
        rooms,
        config,
        isLoading: false, // ✅ Toujours false pour éviter les bloqueurs
        isInitialLoad,
        dataSource,
        lastUpdateTime,
        refreshData,
        loadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}