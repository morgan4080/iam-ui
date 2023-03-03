export type RoleUsers = {
    id: string;
    keycloakId: string;
    username: string;
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
    userType: string;
    pinStatus: string;
    invitationStatus: string;
    ussdPhoneNumber: string;
    userAssignedRolesId: string[];
    isEnabled: boolean;
    isUSSDDisabled: boolean
}

export interface permissionInterface { id: number, checked: boolean, name: string, description: string, keycloakRoleId: string, roleType: string, clientName: string, clientId: string }
export interface serviceInterface { id: number, clientId: string, name: string, description: string, permissions: permissionInterface[]}