
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string | undefined;
  phone: string | undefined;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PersonalInfoFields({
  firstName,
  lastName,
  email,
  phone,
  errors,
  handleInputChange
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>
            First Name*
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
            className={errors.firstName ? "border-destructive" : ""}
            required
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>
            Last Name*
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
            className={errors.lastName ? "border-destructive" : ""}
            required
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>
    </>
  );
}
