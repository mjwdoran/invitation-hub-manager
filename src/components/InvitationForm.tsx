
import { useState } from "react";
import { Invitation, mockContacts, Contact, InvitationRecipient } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InvitationFormProps {
  invitation?: Invitation;
  onSave: (invitation: Partial<Invitation>) => void;
  onCancel: () => void;
}

export function InvitationForm({ invitation, onSave, onCancel }: InvitationFormProps) {
  const [formData, setFormData] = useState<Partial<Invitation>>(
    invitation || {
      name: "",
      description: "",
      status: "draft",
      recipients: []
    }
  );
  const [eventDate, setEventDate] = useState<Date | undefined>(invitation?.eventDate);
  const [mailByDate, setMailByDate] = useState<Date | undefined>(invitation?.mailByDate);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableContacts, setAvailableContacts] = useState<Contact[]>(
    mockContacts.filter(contact => 
      contact.status === 'active' && 
      !formData.recipients?.some(r => r.contactId === contact.id)
    )
  );
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEventDateChange = (date: Date | undefined) => {
    setEventDate(date);
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleMailByDateChange = (date: Date | undefined) => {
    setMailByDate(date);
    setFormData((prev) => ({ ...prev, mailByDate: date }));
  };

  const handleAddRecipients = () => {
    if (selectedContactIds.length === 0) {
      toast.error("No contacts selected");
      return;
    }

    const newRecipients = selectedContactIds.map(contactId => ({
      contactId,
      status: 'pending' as const
    }));

    setFormData((prev) => ({
      ...prev,
      recipients: [...(prev.recipients || []), ...newRecipients]
    }));

    // Remove selected contacts from available contacts
    setAvailableContacts(prev => 
      prev.filter(contact => !selectedContactIds.includes(contact.id))
    );
    
    setSelectedContactIds([]);
    toast.success(`${newRecipients.length} recipients added`);
  };

  const handleRemoveRecipient = (contactId: string) => {
    // Add back to available contacts
    const contactToAdd = mockContacts.find(c => c.id === contactId);
    if (contactToAdd) {
      setAvailableContacts(prev => [...prev, contactToAdd]);
    }

    // Remove from recipients
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients?.filter(r => r.contactId !== contactId) || []
    }));
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const getContactById = (contactId: string) => {
    return mockContacts.find(c => c.id === contactId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Card className="border shadow-sm mx-auto animate-fade-in">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{invitation ? 'Edit Invitation' : 'New Invitation'}</CardTitle>
          <CardDescription>
            {invitation 
              ? 'Update invitation details and recipient list' 
              : 'Create a new invitation campaign'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                Campaign Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={2}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={handleEventDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mailByDate">Mail By Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !mailByDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {mailByDate ? format(mailByDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={mailByDate}
                      onSelect={handleMailByDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* Recipients */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">Recipients</h3>
              <Badge variant="outline">
                {formData.recipients?.length || 0} selected
              </Badge>
            </div>
            
            {/* Current Recipients */}
            {formData.recipients && formData.recipients.length > 0 && (
              <Card className="border shadow-sm">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm">Selected Recipients</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-48 overflow-y-auto">
                    <Table>
                      <TableBody>
                        {formData.recipients.map((recipient) => {
                          const contact = getContactById(recipient.contactId);
                          return contact ? (
                            <TableRow key={recipient.contactId}>
                              <TableCell>
                                <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {contact.streetAddress}, {contact.city}, {contact.state}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveRecipient(recipient.contactId)}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ) : null;
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Available Contacts */}
            <Card className="border shadow-sm">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm">Available Contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-60 overflow-y-auto">
                  {availableContacts.length > 0 ? (
                    <Table>
                      <TableBody>
                        {availableContacts.map((contact) => (
                          <TableRow key={contact.id} className="cursor-pointer">
                            <TableCell className="py-2">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`contact-${contact.id}`}
                                  checked={selectedContactIds.includes(contact.id)}
                                  onCheckedChange={() => toggleContactSelection(contact.id)}
                                />
                                <Label htmlFor={`contact-${contact.id}`} className="cursor-pointer">
                                  <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {contact.streetAddress}, {contact.city}, {contact.state}
                                  </div>
                                </Label>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No more contacts available
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-4 py-2">
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto"
                  disabled={selectedContactIds.length === 0}
                  onClick={handleAddRecipients}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Add Selected
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {invitation ? 'Save Changes' : 'Create Invitation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Helper Table component
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function TableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    >
      {children}
    </td>
  );
}
