
import { useState, useEffect } from "react";
import { Contact } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// Define the structure for our offline contacts
interface OfflineContact extends Partial<Contact> {
  id: string;
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useOfflineStorage() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const openRequest = indexedDB.open("CustomerContactsDB", 1);

    openRequest.onupgradeneeded = function(event) {
      const db = openRequest.result;
      
      // Create an object store for contacts if it doesn't exist
      if (!db.objectStoreNames.contains("contacts")) {
        const store = db.createObjectStore("contacts", { keyPath: "id" });
        store.createIndex("synced", "synced", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    openRequest.onsuccess = function() {
      setDb(openRequest.result);
      setIsReady(true);
    };

    openRequest.onerror = function(event) {
      console.error("IndexedDB error:", openRequest.error);
      setIsReady(false);
    };

    return () => {
      db?.close();
    };
  }, []);

  const saveContact = (contactData: Partial<Contact>): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not available"));
        return;
      }

      try {
        const transaction = db.transaction("contacts", "readwrite");
        const store = transaction.objectStore("contacts");
        
        const contact: OfflineContact = {
          ...contactData,
          id: contactData.id || uuidv4(), // Generate UUID if not provided
          synced: false,
          createdAt: contactData.createdAt || new Date(),
          updatedAt: contactData.updatedAt || new Date()
        };

        const request = store.put(contact);
        
        request.onsuccess = () => {
          resolve(contact.id);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const getStoredContacts = (): OfflineContact[] => {
    if (!db) return [];
    
    const contacts: OfflineContact[] = [];
    const transaction = db.transaction("contacts", "readonly");
    const store = transaction.objectStore("contacts");
    const request = store.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = request.result;
      if (cursor) {
        contacts.push(cursor.value);
        cursor.continue();
      }
    };
    
    return contacts;
  };

  const getUnsyncedContacts = (): Promise<OfflineContact[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        resolve([]);
        return;
      }

      const contacts: OfflineContact[] = [];
      const transaction = db.transaction("contacts", "readonly");
      const store = transaction.objectStore("contacts");
      const index = store.index("synced");
      const request = index.openCursor(IDBKeyRange.only(false));
      
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          contacts.push(cursor.value);
          cursor.continue();
        } else {
          resolve(contacts);
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const markAsSynced = (contactId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not available"));
        return;
      }

      const transaction = db.transaction("contacts", "readwrite");
      const store = transaction.objectStore("contacts");
      const request = store.get(contactId);
      
      request.onsuccess = () => {
        const contact = request.result;
        if (contact) {
          contact.synced = true;
          store.put(contact);
          resolve();
        } else {
          reject(new Error("Contact not found"));
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  return {
    isReady,
    saveContact,
    getStoredContacts,
    getUnsyncedContacts,
    markAsSynced
  };
}
