'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string | null;
  email: string | null;
  is_auth: boolean;
}

interface Offer {
  downsell: string | null;
}

interface Responses {
  foundWithMigrateMate: string;
  rolesApplied: string;
  companiesEmailed: string;
  companiesInterviewed: string;
}

interface CancellationContextType {
  responses: Responses;
  setResponses: React.Dispatch<React.SetStateAction<Responses>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  offer: Offer;
  setOffer: React.Dispatch<React.SetStateAction<Offer>>;
}

const CancellationContext = createContext<CancellationContextType | undefined>(undefined);

export function CancellationProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<Responses>({
    foundWithMigrateMate: '',
    rolesApplied: '',
    companiesEmailed: '',
    companiesInterviewed: ''
  });

  const [user, setUser] = useState<User>({
    id: null,
    email: null,
    is_auth: false
  });

  const [offer, setOffer] = useState<Offer>({
    downsell: null
  });

  return (
    <CancellationContext.Provider value={{ responses, setResponses, user, setUser, offer, setOffer }}>
      {children}
    </CancellationContext.Provider>
  );
}

export default CancellationContext;