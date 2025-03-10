
import { useState, useEffect } from "react";
import { CustomerContactForm } from "@/components/CustomerContactForm";
import { CustomerHeader } from "@/components/CustomerHeader";
import { Contact } from "@/lib/types";
import { toast } from "sonner";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { useSyncData } from "@/hooks/useSyncData";

const CustomerPortal = () => {
  const { saveContact, getStoredContacts } = useOfflineStorage();
  const { isPending, sync, lastSyncTime } = useSyncData();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online!");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline. Changes will be saved locally.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSave = async (contactData: Partial<Contact>) => {
    try {
      // Save to local storage regardless of online status
      await saveContact(contactData);
      toast.success("Thank you! Your information has been saved.");
      
      // If online, attempt to sync immediately
      if (isOnline) {
        sync();
      }
    } catch (error) {
      toast.error("There was a problem saving your information.");
      console.error("Error saving contact:", error);
    }
  };

  const handleManualSync = () => {
    if (isOnline) {
      sync();
    } else {
      toast.warning("You're offline. Please try again when you have internet connection.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-medium tracking-tight">Join Our Mailing List</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on our latest events and announcements
            </p>
          </div>
          
          {!isOnline && (
            <div className="bg-amber-100 text-amber-800 p-4 rounded-md text-sm">
              You appear to be offline. Your information will be saved locally and synced when you reconnect.
            </div>
          )}
          
          {isOnline && lastSyncTime && (
            <div className="text-center text-xs text-muted-foreground">
              Last synced: {new Date(lastSyncTime).toLocaleString()}
            </div>
          )}
          
          <CustomerContactForm onSave={handleSave} />
          
          {getStoredContacts().length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleManualSync}
                disabled={isPending || !isOnline}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
              >
                {isPending ? "Syncing..." : "Sync Now"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerPortal;
