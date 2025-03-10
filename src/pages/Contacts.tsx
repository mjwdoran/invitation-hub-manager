
import { useState } from "react";
import { Header } from "@/components/Header";
import { ContactList } from "@/components/ContactList";
import { ContactForm } from "@/components/ContactForm";
import { Contact, mockContacts } from "@/lib/types";
import { toast } from "sonner";

const Contacts = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedContact(undefined);
    setShowForm(true);
  };

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleSave = (contact: Partial<Contact>) => {
    // In a real app, this would save to a database
    if (selectedContact) {
      toast.success("Contact updated successfully");
    } else {
      toast.success("Contact added successfully");
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {!showForm ? (
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-medium tracking-tight">Contacts</h1>
              <p className="text-muted-foreground mt-1">
                Manage your mailing list contacts
              </p>
            </div>
            
            <ContactList 
              onAddClick={handleAddClick}
              onEditClick={handleEditClick}
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-medium tracking-tight">
                {selectedContact ? 'Edit Contact' : 'Add Contact'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {selectedContact ? 'Update contact information' : 'Create a new contact'}
              </p>
            </div>
            
            <ContactForm 
              contact={selectedContact}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Contacts;
