
import { useState, useCallback } from "react";
import { useOfflineStorage } from "./useOfflineStorage";
import { toast } from "sonner";

export function useSyncData() {
  const { getUnsyncedContacts, markAsSynced } = useOfflineStorage();
  const [isPending, setIsPending] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(
    localStorage.getItem("lastSyncTime") 
      ? Number(localStorage.getItem("lastSyncTime")) 
      : null
  );

  const sync = useCallback(async () => {
    if (isPending) return;
    
    setIsPending(true);
    
    try {
      const unsyncedContacts = await getUnsyncedContacts();
      
      if (unsyncedContacts.length === 0) {
        toast.info("No new contacts to sync");
        setIsPending(false);
        return;
      }

      // In a real implementation, this would send data to your server
      // This is a mock implementation that simulates a server sync
      console.log("Syncing contacts:", unsyncedContacts);
      
      // Simulate network request with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark all contacts as synced in IndexedDB
      for (const contact of unsyncedContacts) {
        await markAsSynced(contact.id);
      }
      
      // Update last sync time
      const now = Date.now();
      localStorage.setItem("lastSyncTime", now.toString());
      setLastSyncTime(now);
      
      toast.success(`Successfully synced ${unsyncedContacts.length} contacts`);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync contacts. Please try again later.");
    } finally {
      setIsPending(false);
    }
  }, [isPending, getUnsyncedContacts, markAsSynced]);

  return {
    isPending,
    sync,
    lastSyncTime
  };
}
