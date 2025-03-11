
import React, { useState } from 'react';
import { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { contactsService } from '@/services/contactsService';

interface CustomerSearchProps {
  onContactFound: (contact: Contact) => void;
}

export function CustomerSearch({ onContactFound }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (searchTerm.length < 3) {
      toast.warning("Please enter at least 3 characters to search");
      return;
    }
    
    setIsSearching(true);
    try {
      const contacts = await contactsService.searchContacts(searchTerm);
      const matchingContact = contacts[0];
      
      if (matchingContact) {
        onContactFound(matchingContact);
        toast.success("Found your information!");
      } else {
        toast.info("No matching information found. Please fill out the form below.");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("There was an error searching for your information");
    } finally {
      setIsSearching(false);
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
        <Button 
          onClick={handleSearch} 
          disabled={searchTerm.length < 3 || isSearching}
        >
          <Search className="mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
}
