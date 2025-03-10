
import { useState } from "react";
import { Contact, mockContacts } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus,
  Mail,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface ContactListProps {
  onAddClick: () => void;
  onEditClick: (contact: Contact) => void;
}

export function ContactList({ onAddClick, onEditClick }: ContactListProps) {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    
    return fullName.includes(searchTerm) || 
           contact.email?.toLowerCase().includes(searchTerm) ||
           contact.city.toLowerCase().includes(searchTerm) ||
           contact.state.toLowerCase().includes(searchTerm) ||
           contact.tags.some(tag => tag.toLowerCase().includes(searchTerm));
  });

  const handleStatusToggle = (contactId: string) => {
    // In a real app, this would update the contact in the database
    toast.success("Contact status updated");
  };

  const handleDelete = (contactId: string) => {
    // In a real app, this would delete the contact from the database
    toast.success("Contact deleted");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          className="min-w-[140px]"
          onClick={onAddClick}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>
      
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <TableRow 
                      key={contact.id}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                      onClick={() => onEditClick(contact)}
                    >
                      <TableCell className="font-medium">
                        <div>{contact.firstName} {contact.lastName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {contact.email && (<span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {contact.email}</span>)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{contact.streetAddress}</div>
                        <div className="text-xs text-muted-foreground">
                          {contact.city}, {contact.state} {contact.postalCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={contact.status === 'active' ? "default" : "outline"} 
                          className="capitalize"
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onEditClick(contact);
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleStatusToggle(contact.id);
                            }}>
                              {contact.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(contact.id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No contacts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
