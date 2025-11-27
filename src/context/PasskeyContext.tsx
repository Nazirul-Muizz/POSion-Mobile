import { createElement, useState, useContext, createContext, ReactNode} from "react";
import { Passkey} from "@/constants/Passkey";
import { ROLES, RolesType } from "@/constants/Roles";

type PasskeyContextType = {
    passkeyAuth: {role?: string} | null,
    login: (passkey:string) => void,
    logout: () => void,
    isPasskeyAuthorized: (requiredRole: string) => boolean,
    ROLES: RolesType
}

const PasskeyAuthContext = createContext<PasskeyContextType | null>(null);

export const PasskeyAuthProvider = ({ children }: {children: ReactNode}) => {
    const [passkeyAuth, setPasskeyAuth] = useState<{role?: string} | null>(null);

    const login = (passkey: string) => {
        let role = null;
        passkey === Passkey.Employer ? role = ROLES.MANAGER : null;

        if (role) setPasskeyAuth({role});
        else alert('Invalid passkey!');
    };

    const logout = () => setPasskeyAuth(null);

    const isPasskeyAuthorized = (requiredRole: string) => {
        if (!passkeyAuth) return false;
        if (!requiredRole) return true;
        return passkeyAuth.role === requiredRole;
    }

    return (
    <PasskeyAuthContext.Provider value={{ passkeyAuth, login, logout, isPasskeyAuthorized, ROLES }}>
      {children}
    </PasskeyAuthContext.Provider>
  );
}

export const usePasskeyAuth = (): PasskeyContextType => {
  const context = useContext(PasskeyAuthContext);
  if (!context) throw new Error("usePasskeyAuth must be used inside PasskeyAuthProvider");
  return context;
};