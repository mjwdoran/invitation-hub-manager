
import { Contact } from "./types";
import { Database } from "@/integrations/supabase/types";

type DbContact = Database['public']['Tables']['contacts']['Row'];

export const mapDbContactToContact = (dbContact: DbContact): Contact => ({
  id: dbContact.id,
  firstName: dbContact.first_name,
  lastName: dbContact.last_name,
  email: dbContact.email || undefined,
  phone: dbContact.phone || undefined,
  streetAddress: dbContact.street_address,
  city: dbContact.city,
  state: dbContact.state,
  postalCode: dbContact.postal_code,
  country: dbContact.country,
  status: dbContact.status as 'active' | 'inactive',
  tags: dbContact.tags || [],
  notes: dbContact.notes || undefined,
  createdAt: new Date(dbContact.created_at),
  updatedAt: new Date(dbContact.updated_at)
});

export const mapContactToDb = (contact: Partial<Contact>) => ({
  first_name: contact.firstName,
  last_name: contact.lastName,
  email: contact.email,
  phone: contact.phone,
  street_address: contact.streetAddress,
  city: contact.city,
  state: contact.state,
  postal_code: contact.postalCode,
  country: contact.country,
  status: contact.status,
  tags: contact.tags,
  notes: contact.notes,
  updated_at: new Date().toISOString()
});
