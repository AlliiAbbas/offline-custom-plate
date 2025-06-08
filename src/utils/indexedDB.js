const DB_NAME = 'customsPlateDB';
const STORE_NAME = 'calculations';
const DB_VERSION = 1;

let dbInstance = null;

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