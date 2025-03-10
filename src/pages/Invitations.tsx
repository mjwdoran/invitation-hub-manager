
import { useState } from "react";
import { Header } from "@/components/Header";
import { InvitationList } from "@/components/InvitationList";
import { InvitationForm } from "@/components/InvitationForm";
import { Invitation } from "@/lib/types";
import { toast } from "sonner";

const Invitations = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedInvitation(undefined);
    setShowForm(true);
  };

  const handleEditClick = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setShowForm(true);
  };

  const handleSave = (invitation: Partial<Invitation>) => {
    // In a real app, this would save to a database
    if (selectedInvitation) {
      toast.success("Invitation updated successfully");
    } else {
      toast.success("Invitation created successfully");
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
              <h1 className="text-3xl font-medium tracking-tight">Invitations</h1>
              <p className="text-muted-foreground mt-1">
                Manage your invitation campaigns
              </p>
            </div>
            
            <InvitationList 
              onAddClick={handleAddClick}
              onEditClick={handleEditClick}
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-medium tracking-tight">
                {selectedInvitation ? 'Edit Invitation' : 'New Invitation'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {selectedInvitation ? 'Update invitation details' : 'Create a new invitation campaign'}
              </p>
            </div>
            
            <InvitationForm 
              invitation={selectedInvitation}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Invitations;
