export interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  isEnabled: string;
  keycloakId: string;
  phoneNumber: string;
  ussdPhoneNumber: string;
  tenantId: string;
  isUSSDDisabled: boolean;
  userAssignedRolesId: string[];
  pinStatus: string;
  username: string;
  pinAttempts: number;
  passwordStatus: string;
  requiredActions: string[];
  accessTypes: string[];
}

export interface KeycloakUser {
  keycloakId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  companyName: string;
  roles: Record<string, string[]>;
}

export interface EnableUserPayload {
  userRefId: string;
  isEnabled: boolean;
}

export interface EditUserPayload {
  userRefId: string;
  userName: string;
  firstName: string;
  lastName: string;
  ussdPhoneNumber: string;
  email: string | undefined;
  phoneNumber: string | undefined;
  isEnabled: boolean;
}

export interface EditUserForm {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  company: string | null;
  phoneNumber: string | null;
  ussdPhoneNumber: string | null;
  password: string | null;
  passwordConfirmation: string | null;
  pinSecret: string | null;
  pinSecretConfirmation: string | null;
  user_roles: string[];
}

export interface QrInterface {
  phoneNumber: string;
  ussdPhoneNumber: string;
  email: string;
  username: string;
}
