
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressFieldsProps {
  streetAddress: string | undefined;
  city: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AddressFields({
  streetAddress,
  city,
  state,
  postalCode,
  handleInputChange
}: AddressFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Mailing Address</Label>
        <Input
          id="streetAddress"
          name="streetAddress"
          value={streetAddress || ""}
          onChange={handleInputChange}
          placeholder="Street Address"
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={city || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={state || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Zip Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={postalCode || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
}
