
import React, { useState, useEffect } from 'react';
import { Contact } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PersonalInfoFields } from './contact-form/PersonalInfoFields';
import { AddressFields } from './contact-form/AddressFields';
import { AdditionalFields } from './contact-form/AdditionalFields';
import { ContactInfoFields } from './contact-form/ContactInfoFields';
import { SubmissionConfirmation } from './contact-form/SubmissionConfirmation';

interface CustomerContactFormProps {
  onSave: (contact: Partial<Contact>) => void;
  initialData?: Contact;
}

export function CustomerContactForm({ onSave, initialData }: CustomerContactFormProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Canada',
    tags: ['customer-added'],
    status: 'active'
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
    
    if (errors.state) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.state;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.streetAddress?.trim()) {
      newErrors.streetAddress = "Street address is required";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state?.trim()) {
      newErrors.state = "Province is required";
    }

    if (!formData.postalCode?.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else {
      // Validate Canadian postal code (letter-number-letter number-letter-number format)
      const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
      if (!postalCodeRegex.test(formData.postalCode)) {
        newErrors.postalCode = "Invalid postal code format (e.g. A1A 1A1)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add creation timestamp for sorting later
      const contactWithTimestamp = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onSave(contactWithTimestamp);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Canada',
          tags: ['customer-added'],
          status: 'active'
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <Card className="border shadow-sm animate-fade-in">
      {submitted ? (
        <SubmissionConfirmation />
      ) : (
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-center">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PersonalInfoFields 
              firstName={formData.firstName || ''}
              lastName={formData.lastName || ''}
              email={formData.email}
              phone={formData.phone}
              errors={errors}
              handleInputChange={handleInputChange}
            />
            
            <AddressFields 
              streetAddress={formData.streetAddress}
              city={formData.city}
              state={formData.state}
              postalCode={formData.postalCode}
              handleInputChange={handleInputChange}
              handleProvinceChange={handleProvinceChange}
              errors={errors}
            />
            
            <ContactInfoFields
              email={formData.email}
              phone={formData.phone}
              errors={errors}
              handleInputChange={handleInputChange}
            />
            
            <AdditionalFields 
              notes={formData.notes}
              handleInputChange={handleInputChange}
            />
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <Button type="submit" size="lg">
              Submit
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
