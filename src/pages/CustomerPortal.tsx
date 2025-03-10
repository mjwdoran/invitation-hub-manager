import { useState, useEffect } from "react";
import { CustomerContactForm } from "@/components/CustomerContactForm";
import { CustomerHeader } from "@/components/CustomerHeader";
import { CustomerSearch } from "@/components/CustomerSearch";
import { Contact } from "@/lib/types";
import { toast } from "sonner";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { useSyncData } from "@/hooks/useSyncData";

const CustomerPortal = () => {
  const { saveContact, getStoredContacts } = useOfflineStorage();
  const { isPending, sync, lastSyncTime } = useSyncData();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [existingContact, setExistingContact] = useState<Contact | null>(null);

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
      const dataToSave = existingContact 
        ? { ...contactData, id: existingContact.id }
        : contactData;
        
      await saveContact(dataToSave);
      toast.success("Thank you! Your information has been saved.");
      setExistingContact(null);
      
      if (isOnline) {
        sync();
      }
    } catch (error) {
      toast.error("There was a problem saving your information.");
      console.error("Error saving contact:", error);
    }
  };

  const handleContactFound = (contact: Contact) => {
    setExistingContact(contact);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-medium tracking-tight">Join Our Mailing List</h1>
            <p className="text-muted-foreground mt-1">
              {existingContact ? "Update your information" : "Search for your existing information or add yourself to our list"}
            </p>
          </div>
          
          {!isOnline && (
            <div className="bg-amber-100 text-amber-800 p-4 rounded-md text-sm">
              You appear to be offline. Your information will be saved locally and synced when you reconnect.
            </div>
          )}
          
          <CustomerSearch onContactFound={handleContactFound} />
          
          <CustomerContactForm 
            onSave={handleSave} 
            initialData={existingContact || undefined}
          />
          
          {getStoredContacts().length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => sync()}
                disabled={isPending || !isOnline}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
              >
                {isPending ? "Syncing..." : "Sync Now"}
              </button>
              
              {isOnline && lastSyncTime && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last synced: {new Date(lastSyncTime).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerPortal;
