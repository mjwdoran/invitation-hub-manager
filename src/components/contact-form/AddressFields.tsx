
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CANADIAN_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' }
];

interface AddressFieldsProps {
  streetAddress: string | undefined;
  city: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleProvinceChange?: (value: string) => void;
  errors?: Record<string, string>;
}

export function AddressFields({
  streetAddress,
  city,
  state,
  postalCode,
  handleInputChange,
  handleProvinceChange,
  errors = {}
}: AddressFieldsProps) {
  // Validate Canadian postal code (letter-number-letter number-letter-number format)
  const validatePostalCode = (value: string) => {
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
    return postalCodeRegex.test(value);
  };

  const handlePostalCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !validatePostalCode(value)) {
      // This will trigger if the blur event happens and the postal code is invalid
      // The actual validation error state is handled in the parent component
      e.target.setCustomValidity('Invalid postal code format (e.g. A1A 1A1)');
    } else {
      e.target.setCustomValidity('');
    }
  };

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
          className={errors.streetAddress ? "border-destructive" : ""}
        />
        {errors.streetAddress && (
          <p className="text-xs text-destructive">{errors.streetAddress}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={city || ""}
            onChange={handleInputChange}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">Province</Label>
          {handleProvinceChange ? (
            <Select 
              value={state || ""} 
              onValueChange={handleProvinceChange}
            >
              <SelectTrigger id="state" className={errors.state ? "border-destructive" : ""}>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {CANADIAN_PROVINCES.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="state"
              name="state"
              value={state || ""}
              onChange={handleInputChange}
              className={errors.state ? "border-destructive" : ""}
            />
          )}
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={postalCode || ""}
            onChange={handleInputChange}
            placeholder="A1A 1A1"
            onBlur={handlePostalCodeBlur}
            className={errors.postalCode ? "border-destructive" : ""}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode}</p>
          )}
        </div>
      </div>
    </>
  );
}
