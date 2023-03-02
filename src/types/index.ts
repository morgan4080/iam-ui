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
}

export interface KeycloakUser {
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
    companyName: string;
    roles: Record<string, string[]>
}
