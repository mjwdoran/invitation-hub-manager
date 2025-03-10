
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: 'active' | 'inactive';
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  name: string;
  description: string;
  eventDate?: Date;
  mailByDate?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  recipients: InvitationRecipient[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationRecipient {
  contactId: string;
  status: 'pending' | 'sent' | 'delivered' | 'returned';
  sentDate?: Date;
  deliveredDate?: Date;
}

// Mock data for development
export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Appleseed',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    streetAddress: '1 Infinite Loop',
    city: 'Cupertino',
    state: 'CA',
    postalCode: '95014',
    country: 'USA',
    status: 'active',
    tags: ['friend', 'vip'],
    notes: 'Prefers formal invitations',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    streetAddress: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
    status: 'active',
    tags: ['family'],
    notes: '',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05')
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael@example.com',
    streetAddress: '456 Park Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
    status: 'inactive',
    tags: ['business'],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-02-15')
  }
];

export const mockInvitations: Invitation[] = [
  {
    id: '1',
    name: 'Summer Gala 2023',
    description: 'Annual charity fundraiser',
    eventDate: new Date('2023-07-15'),
    mailByDate: new Date('2023-06-15'),
    status: 'completed',
    recipients: [
      { contactId: '1', status: 'delivered', sentDate: new Date('2023-06-10'), deliveredDate: new Date('2023-06-13') },
      { contactId: '2', status: 'delivered', sentDate: new Date('2023-06-10'), deliveredDate: new Date('2023-06-14') }
    ],
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-07-20')
  },
  {
    id: '2',
    name: 'Product Launch',
    description: 'New product unveiling',
    eventDate: new Date('2023-09-30'),
    mailByDate: new Date('2023-09-01'),
    status: 'scheduled',
    recipients: [
      { contactId: '1', status: 'pending' },
      { contactId: '2', status: 'pending' },
      { contactId: '3', status: 'pending' }
    ],
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-01')
  }
];
