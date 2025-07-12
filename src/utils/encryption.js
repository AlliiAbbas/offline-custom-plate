// AES-GCM Encryption Utility
// This module provides encryption and decryption functions for sensitive data

// Generate a secure encryption key
const generateEncryptionKey = async () => {
  try {
    // Check if we already have a key stored
    const storedKey = localStorage.getItem('encryptionKey');
    if (storedKey) {
      const keyArray = JSON.parse(storedKey);
      // AES-GCM requires 128 or 256 bit key (16 or 32 bytes)
      if (keyArray.length === 16 || keyArray.length === 32) {
        return await crypto.subtle.importKey(
          'raw',
          new Uint8Array(keyArray),
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // Invalid key length, remove and regenerate
        localStorage.removeItem('encryptionKey');
      }
    }

    // Create a fixed key for testing (this should match the key used to encrypt the data)
    // This is a 32-byte key (256 bits) - you should replace this with the actual key used
    const fixedKeyArray = new Uint8Array([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
      0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
      0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
    ]);

    // Import the fixed key
    const key = await crypto.subtle.importKey(
      'raw',
      fixedKeyArray,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    // Store the fixed key
    localStorage.setItem('encryptionKey', JSON.stringify(Array.from(fixedKeyArray)));

    return key;
  } catch (error) {
    console.error('Error generating encryption key:', error);
    throw error;
  }
};

// Encrypt data using AES-GCM
export const encryptData = async (data) => {
  try {
    const key = await generateEncryptionKey();
    
    // Convert data to string if it's an object
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Convert string to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    
    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      dataBuffer
    );
    
    // Convert encrypted data and IV to base64 strings
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    
    // Return encrypted data with IV
    return {
      encrypted: encryptedBase64,
      iv: ivBase64
    };
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

// Decrypt data using AES-GCM
export const decryptData = async (encryptedData) => {
  try {
    const key = await generateEncryptionKey();
    
    // Convert base64 strings back to ArrayBuffers
    const encryptedArray = new Uint8Array(
      atob(encryptedData.encrypted).split('').map(char => char.charCodeAt(0))
    );
    const iv = new Uint8Array(
      atob(encryptedData.iv).split('').map(char => char.charCodeAt(0))
    );
    
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedArray
    );
    
    // Convert ArrayBuffer back to string
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    
    // Try to parse as JSON, if it fails return as string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

// Check if data is encrypted
export const isEncrypted = (data) => {
  return data && 
         typeof data === 'object' && 
         data.encrypted && 
         data.iv;
};

// Encrypt specific fields in an object
export const encryptObjectFields = async (obj, fieldsToEncrypt = []) => {
  try {
    const encryptedObj = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      // Encrypt all fields, even if they are null, undefined, or empty
      const value = obj[field] !== undefined ? obj[field] : null;
      encryptedObj[field] = await encryptData(value);
    }
    
    return encryptedObj;
  } catch (error) {
    console.error('Error encrypting object fields:', error);
    throw error;
  }
};

// Decrypt specific fields in an object
export const decryptObjectFields = async (obj, fieldsToDecrypt = []) => {
  try {
    const decryptedObj = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      if (obj[field] !== undefined && isEncrypted(obj[field])) {
        decryptedObj[field] = await decryptData(obj[field]);
      }
    }
    
    return decryptedObj;
  } catch (error) {
    console.error('Error decrypting object fields:', error);
    throw error;
  }
};

// Get the list of fields that should be encrypted for vehicle data
export const getEncryptedFields = () => {
  return [
    'id',
    'plate',
    'code',
    'chassis_id',
    'motor_id',
    'producer',
    'model',
    'year',
    'from_date',
    'to_date',
    'issued_at',
    'insurance_state',
    'owner_name',
    'owner_national_id',
    'owner_address',
    'owner_job',
    'owner_phone',
    'net_premium',
    'tax',
    'stamp',
    'issue_fees',
    'total_sum',
    'vehicle_license_type',
    'motor_cc',
    'cylinders',
    'fuel_type_id',
    'vehicle_color',
    'vehicle_kg',
    'wt_kg',
    'extra_size_percent',
    'wt_extra',
    'body_modification_extensions',
    'passengers',
    'tractor_parts',
    'vehicle_shape',
    'attach_type',
    'attach_to_date',
    'attach_serial',
    'Insurance_entity',
    'region',
    'policy_status',
    'vehicle_type',
    'traffic_unit',
    'insurance_last_vendor',
    'status'
  ];
}; 