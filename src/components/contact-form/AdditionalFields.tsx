
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalFieldsProps {
  notes: string | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AdditionalFields({ notes, handleInputChange }: AdditionalFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes (Optional)</Label>
      <Textarea
        id="notes"
        name="notes"
        value={notes || ""}
        onChange={handleInputChange}
        rows={2}
        placeholder="Any additional information you'd like us to know"
      />
    </div>
  );
}
