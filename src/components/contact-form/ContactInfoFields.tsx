
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoFieldsProps {
  email: string | undefined;
  phone: string | undefined;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ContactInfoFields({
  email,
  phone,
  errors,
  handleInputChange
}: ContactInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
          Email (Optional)
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email || ""}
          onChange={handleInputChange}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          value={phone || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
