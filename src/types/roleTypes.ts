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