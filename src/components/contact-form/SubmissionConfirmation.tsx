
import React from 'react';
import { CheckCircle } from 'lucide-react';

export function SubmissionConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-medium">Thank You!</h2>
      <p className="text-muted-foreground mt-2">
        Your information has been saved successfully.
      </p>
    </div>
  );
}
