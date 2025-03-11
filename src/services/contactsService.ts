
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/lib/types";

export const contactsService = {
  async getContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Contact[];
  },

  async searchContacts(searchTerm: string) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Contact[];
  },

  async saveContact(contact: Partial<Contact>) {
    const { data, error } = await supabase
      .from('contacts')
      .upsert({
        ...contact,
        updated_at: new Date().toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Contact;
  },

  async deleteContact(id: string) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
