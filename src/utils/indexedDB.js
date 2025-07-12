import { encryptObjectFields, decryptObjectFields, getEncryptedFields } from './encryption.js';

const DB_NAME = 'customsPlateDB';
const STORE_NAME = 'calculations';
const DB_VERSION = 1;

const CUSTOM_PLATE_DB = 'customPlateDB';
const CUSTOM_PLATE_STORE = 'customPlate';
const CUSTOM_PLATE_VERSION = 1;

const USER_CODE_DB = 'userCodeDB';
const USER_CODE_STORE = 'userCode';
const USER_CODE_VERSION = 1;

const USER_DB = 'userDB';
const USER_STORE = 'user';
const USER_VERSION = 1;

const CODE_DB = 'codeDB';
const CODE_STORE = 'lastCode';
const CODE_VERSION = 1;

let dbInstance = null;
let customPlateDbInstance = null;
let userCodeDbInstance = null;
let userDbInstance = null;
let codeDbInstance = null;

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

export const initUserCodeDB = () => {
  return new Promise((resolve, reject) => {
    if (userCodeDbInstance) {
      console.log('Using existing user code database connection');
      return resolve(userCodeDbInstance);
    }

    console.log('Opening User Code IndexedDB connection...');
    const request = indexedDB.open(USER_CODE_DB, USER_CODE_VERSION);

    request.onerror = (event) => {
      console.error('Error opening user code database:', event.target.error);
      reject('Error opening user code database: ' + event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('User code database opened successfully');
      userCodeDbInstance = event.target.result;
      resolve(userCodeDbInstance);
    };

    request.onupgradeneeded = (event) => {
      console.log('User code database upgrade needed');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(USER_CODE_STORE)) {
        console.log('Creating user code object store:', USER_CODE_STORE);
        db.createObjectStore(USER_CODE_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const initUserDB = () => {
  return new Promise((resolve, reject) => {
    if (userDbInstance) {
      console.log('Using existing user database connection');
      return resolve(userDbInstance);
    }

    console.log('Opening User IndexedDB connection...');
    const request = indexedDB.open(USER_DB, USER_VERSION);

    request.onerror = (event) => {
      console.error('Error opening user database:', event.target.error);
      reject('Error opening user database: ' + event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('User database opened successfully');
      userDbInstance = event.target.result;
      resolve(userDbInstance);
    };

    request.onupgradeneeded = (event) => {
      console.log('User database upgrade needed');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(USER_STORE)) {
        console.log('Creating user object store:', USER_STORE);
        db.createObjectStore(USER_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const initCodeDB = () => {
  return new Promise((resolve, reject) => {
    if (codeDbInstance) {
      console.log('Using existing code database connection');
      return resolve(codeDbInstance);
    }

    console.log('Opening Code IndexedDB connection...');
    const request = indexedDB.open(CODE_DB, CODE_VERSION);

    request.onerror = (event) => {
      console.error('Error opening code database:', event.target.error);
      reject('Error opening code database: ' + event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('Code database opened successfully');
      codeDbInstance = event.target.result;
      resolve(codeDbInstance);
    };

    request.onupgradeneeded = (event) => {
      console.log('Code database upgrade needed');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CODE_STORE)) {
        console.log('Creating code object store:', CODE_STORE);
        db.createObjectStore(CODE_STORE, { keyPath: 'id' });
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
    
    // Encrypt sensitive data before saving
    let dataToSave = { ...data };
    if (data.data) {
      const encryptedFields = getEncryptedFields();
      dataToSave.data = await encryptObjectFields(data.data, encryptedFields);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      console.log('Adding encrypted data to store:', dataToSave);
      const request = store.put(dataToSave);

      request.onsuccess = (event) => {
        console.log('Encrypted data saved successfully with ID:', event.target.result);
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving encrypted data:', event.target.error);
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

// دالة جديدة لتحديث عنصر موجود
export const updateData = async (id, updatedData) => {
  try {
    console.log('Starting updateData operation for ID:', id);
    const db = await initDB();
    
    // Encrypt sensitive data before updating
    let dataToUpdate = { ...updatedData };
    if (updatedData.data) {
      const encryptedFields = getEncryptedFields();
      dataToUpdate.data = await encryptObjectFields(updatedData.data, encryptedFields);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // الحصول على العنصر الموجود أولاً
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const existingItem = getRequest.result;
        if (existingItem) {
          // دمج البيانات المحدثة مع البيانات الموجودة
          const mergedData = {
            ...existingItem,
            ...dataToUpdate,
            id: id // الحفاظ على الـ ID الأصلي
          };
          
          console.log('Updating existing item:', mergedData);
          const updateRequest = store.put(mergedData);
          
          updateRequest.onsuccess = () => {
            console.log('Data updated successfully');
            resolve(id);
          };
          
          updateRequest.onerror = (event) => {
            console.error('Error updating data:', event.target.error);
            reject(event.target.error);
          };
        } else {
          reject(new Error('Item not found with ID: ' + id));
        }
      };
      
      getRequest.onerror = (event) => {
        console.error('Error getting existing item:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in updateData:', error);
    throw error;
  }
};

export const getAllData = async () => {
  try {
    console.log('getAllData: Starting...');
    const db = await initDB();
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = async () => {
        try {
          const encryptedData = request.result;
          console.log('getAllData: Raw encrypted data from IndexedDB:', encryptedData);
          const decryptedData = [];
          
          for (const item of encryptedData) {
            console.log('getAllData: Processing item:', item);
            if (item.data) {
              console.log('getAllData: Item has data property, decrypting...');
              const encryptedFields = getEncryptedFields();
              const decryptedItem = {
                ...item,
                data: await decryptObjectFields(item.data, encryptedFields)
              };
              console.log('getAllData: Decrypted item:', decryptedItem);
              decryptedData.push(decryptedItem);
            } else {
              console.log('getAllData: Item has no data property, adding as is:', item);
              decryptedData.push(item);
            }
          }
          
          console.log('getAllData: Final decrypted data:', decryptedData);
          resolve(decryptedData);
        } catch (decryptError) {
          console.error('Error decrypting data:', decryptError);
          reject(decryptError);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getAllData:', error);
    throw error;
  }
};

// Helper function to get decrypted data for table display
export const getDecryptedDataForTable = async () => {
  try {
    console.log('getDecryptedDataForTable: Starting...');
    const allData = await getAllData();
    console.log('getDecryptedDataForTable: All data from IndexedDB:', allData);
    
    const tableData = allData.map(item => {
      console.log('getDecryptedDataForTable: Processing item:', item);
      
      // If item has data property (encrypted structure), return the decrypted data
      if (item.data) {
        console.log('getDecryptedDataForTable: Using item.data:', item.data);
        return item.data;
      }
      // If item itself is the data (already decrypted), return as is
      console.log('getDecryptedDataForTable: Using item directly:', item);
      return item;
    }).filter(item => {
      const isValid = item && Object.keys(item).length > 0;
      console.log('getDecryptedDataForTable: Filtering item:', item, 'isValid:', isValid);
      return isValid;
    });
    
    console.log('getDecryptedDataForTable: Final table data:', tableData);
    return tableData;
  } catch (error) {
    console.error('Error getting decrypted data for table:', error);
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
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = async () => {
        try {
          const encryptedItem = request.result;
          if (encryptedItem && encryptedItem.data) {
            const encryptedFields = getEncryptedFields();
            const decryptedItem = {
              ...encryptedItem,
              data: await decryptObjectFields(encryptedItem.data, encryptedFields)
            };
            resolve(decryptedItem);
          } else {
            resolve(encryptedItem);
          }
        } catch (decryptError) {
          console.error('Error decrypting data by ID:', decryptError);
          reject(decryptError);
        }
      };
      
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

export const saveUserCode = async (data) => {
  try {
    console.log('Starting saveUserCode operation...');
    const db = await initUserCodeDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_CODE_STORE], 'readwrite');
      const store = transaction.objectStore(USER_CODE_STORE);
      
      console.log('Adding user code data to store:', data);
      const request = store.put(data);

      request.onsuccess = (event) => {
        console.log('User code data saved successfully');
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving user code data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveUserCode:', error);
    throw error;
  }
};

export const getUserCode = async (userId) => {
  try {
    const db = await initUserCodeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_CODE_STORE], 'readonly');
      const store = transaction.objectStore(USER_CODE_STORE);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getUserCode:', error);
    throw error;
  }
};

export const getAllUserCodes = async () => {
  try {
    const db = await initUserCodeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_CODE_STORE], 'readonly');
      const store = transaction.objectStore(USER_CODE_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getAllUserCodes:', error);
    throw error;
  }
};

export const saveUser = async (data) => {
  try {
    console.log('Starting saveUser operation...');
    const db = await initUserDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readwrite');
      const store = transaction.objectStore(USER_STORE);
      
      console.log('Adding user data to store:', data);
      const request = store.put(data);

      request.onsuccess = (event) => {
        console.log('User data saved successfully');
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveUser:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const db = await initUserDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readonly');
      const store = transaction.objectStore(USER_STORE);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

export const clearUserData = async () => {
  try {
    console.log('Clearing user data...');
    const db = await initUserDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readwrite');
      const store = transaction.objectStore(USER_STORE);
      
      const request = store.clear();

      request.onsuccess = () => {
        console.log('User data cleared successfully');
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error clearing user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in clearUserData:', error);
    throw error;
  }
};

export const clearTable = async () => {
  try {
    console.log('Clearing user data...');
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
        reject(event.target.error);
      };

      const request = store.clear();

      request.onsuccess = () => {
        console.log('User data cleared successfully');
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error clearing user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in clearUserData:', error);
    throw error;
  }
};

export const clearAllDataAndRegenerateKey = async () => {
  try {
    console.log('Clearing all data and regenerating encryption key...');
    
    // Clear all IndexedDB data
    await clearTable();
    
    // Clear encryption key from localStorage to force regeneration
    localStorage.removeItem('encryptionKey');
    
    console.log('All data cleared and encryption key regenerated');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

export const saveLastCode = async (code) => {
  try {
    console.log('Starting saveLastCode operation...');
    const db = await initCodeDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CODE_STORE], 'readwrite');
      const store = transaction.objectStore(CODE_STORE);
      
      const data = {
        id: 'lastCode',
        code: code
      };
      
      console.log('Saving last code:', data);
      const request = store.put(data);

      request.onsuccess = (event) => {
        console.log('Last code saved successfully');
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error saving last code:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveLastCode:', error);
    throw error;
  }
};

export const getLastCode = async () => {
  try {
    const db = await initCodeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CODE_STORE], 'readonly');
      const store = transaction.objectStore(CODE_STORE);
      const request = store.get('lastCode');

      request.onsuccess = () => resolve(request.result?.code);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error in getLastCode:', error);
    throw error;
  }
}; 