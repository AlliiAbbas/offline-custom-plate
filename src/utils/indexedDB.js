const DB_NAME = 'customsPlateDB';
const STORE_NAME = 'calculations';
const DB_VERSION = 1;

const CUSTOM_PLATE_DB = 'customPlateDB';
const CUSTOM_PLATE_STORE = 'customPlate';
const CUSTOM_PLATE_VERSION = 1;

let dbInstance = null;
let customPlateDbInstance = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      console.log('Using existing database connection');
      return resolve(dbInstance);
    }

    console.log('Opening IndexedDB connection...');
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject('Error opening database: ' + event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('Database opened successfully');
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      console.log('Database upgrade needed');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('Creating object store:', STORE_NAME);
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const initCustomPlateDB = () => {
  return new Promise((resolve, reject) => {
    if (customPlateDbInstance) {
      console.log('Using existing custom plate database connection');
      return resolve(customPlateDbInstance);
    }

    console.log('Opening Custom Plate IndexedDB connection...');
    const request = indexedDB.open(CUSTOM_PLATE_DB, CUSTOM_PLATE_VERSION);

    request.onerror = (event) => {
      console.error('Error opening custom plate database:', event.target.error);
      reject('Error opening custom plate database: ' + event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('Custom plate database opened successfully');
      customPlateDbInstance = event.target.result;
      resolve(customPlateDbInstance);
    };

    request.onupgradeneeded = (event) => {
      console.log('Custom plate database upgrade needed');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CUSTOM_PLATE_STORE)) {
        console.log('Creating custom plate object store:', CUSTOM_PLATE_STORE);
        db.createObjectStore(CUSTOM_PLATE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const clearCustomPlateData = async () => {
  try {
    console.log('Clearing custom plate data...');
    const db = await initCustomPlateDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CUSTOM_PLATE_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOM_PLATE_STORE);
      
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Custom plate data cleared successfully');
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error clearing custom plate data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in clearCustomPlateData:', error);
    throw error;
  }
};

export const saveCustomPlateData = async (data) => {
  try {
    console.log('Starting saveCustomPlateData operation...');
    const db = await initCustomPlateDB();
    
    // Clear existing data before saving new data
    await clearCustomPlateData();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CUSTOM_PLATE_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOM_PLATE_STORE);
      
      console.log('Adding custom plate data to store:', data);
      const request = store.add(data);

      request.onsuccess = (event) => {
        console.log('Custom plate data saved successfully with ID:', event.target.result);
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving custom plate data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveCustomPlateData:', error);
    throw error;
  }
};

export const saveData = async (data) => {
  try {
    console.log('Starting saveData operation...');
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      console.log('Adding data to store:', data);
      const request = store.add(data);

      request.onsuccess = (event) => {
        console.log('Data saved successfully with ID:', event.target.result);
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving data:', event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        console.log('Transaction completed successfully');
      };

      transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveData:', error);
    throw error;
  }
};

export const getAllData = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getAllData:', error);
    throw error;
  }
};

export const getAllCustomPlateData = async () => {
  try {
    const db = await initCustomPlateDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CUSTOM_PLATE_STORE], 'readonly');
      const store = transaction.objectStore(CUSTOM_PLATE_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getAllCustomPlateData:', error);
    throw error;
  }
};

export const getDataById = async (id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getDataById:', error);
    throw error;
  }
};

export const getCustomPlateDataById = async (id) => {
  try {
    const db = await initCustomPlateDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CUSTOM_PLATE_STORE], 'readonly');
      const store = transaction.objectStore(CUSTOM_PLATE_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getCustomPlateDataById:', error);
    throw error;
  }
}; 