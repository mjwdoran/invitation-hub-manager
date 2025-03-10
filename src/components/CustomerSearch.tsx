
import React, { useState } from 'react';
import { Contact } from '@/lib/types';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerSearchProps {
  onContactFound: (contact: Contact) => void;
}

export function CustomerSearch({ onContactFound }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { getStoredContacts } = useOfflineStorage();
  
  const handleSearch = () => {
    if (searchTerm.length < 3) {
      toast.warning("Please enter at least 3 characters to search");
      return;
    }
    
    const contacts = getStoredContacts();
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchingContact = contacts.find(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const address = `${contact.streetAddress} ${contact.city} ${contact.state}`.toLowerCase();
      
      return fullName.includes(searchTermLower) || address.includes(searchTermLower);
    });
    
    if (matchingContact) {
      onContactFound(matchingContact);
      toast.success("Found your information!");
    } else {
      toast.info("No matching information found. Please fill out the form below.");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={searchTerm.length < 3}>
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
