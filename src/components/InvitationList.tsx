
import { useState } from "react";
import { Invitation, mockInvitations } from "@/lib/types";
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
  Mail,
  Calendar,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface InvitationListProps {
  onAddClick: () => void;
  onEditClick: (invitation: Invitation) => void;
}

export function InvitationList({ onAddClick, onEditClick }: InvitationListProps) {
  const [invitations] = useState<Invitation[]>(mockInvitations);
  const [search, setSearch] = useState("");

  const filteredInvitations = invitations.filter(invitation => {
    const searchTerm = search.toLowerCase();
    
    return invitation.name.toLowerCase().includes(searchTerm) ||
           invitation.description.toLowerCase().includes(searchTerm) ||
           invitation.status.toLowerCase().includes(searchTerm);
  });

  const formatDate = (date?: Date) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'outline';
      case 'scheduled':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleDuplicate = (invitationId: string) => {
    // In a real app, this would duplicate the invitation
    toast.success("Invitation duplicated");
  };

  const handleDelete = (invitationId: string) => {
    // In a real app, this would delete the invitation
    toast.success("Invitation deleted");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search invitations..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          className="min-w-[168px]"
          onClick={onAddClick}
        >
          <Plus className="mr-2 h-4 w-4" /> New Invitation
        </Button>
      </div>
      
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Mail By</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length > 0 ? (
                  filteredInvitations.map((invitation) => (
                    <TableRow 
                      key={invitation.id}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                      onClick={() => onEditClick(invitation)}
                    >
                      <TableCell className="font-medium">
                        <div>{invitation.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {invitation.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(invitation.eventDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(invitation.mailByDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2 text-sm font-medium">
                            {invitation.recipients.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({invitation.recipients.filter(r => r.status === 'delivered').length} delivered)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={getStatusBadgeVariant(invitation.status)} 
                          className="capitalize"
                        >
                          {invitation.status}
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
                              onEditClick(invitation);
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(invitation.id);
                            }}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(invitation.id);
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No invitations found.
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
