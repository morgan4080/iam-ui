export interface Role {
  id: string;
  keycloakRoleId: string;
  name: string;
  groupName: string;
  description: string;
  userCount: number;
  services: string[];
  permissions: Record<string, string>;
}
export interface RoleV2 {
  id: string;
  keycloakRoleId: string;
  name: string;
  roleType: string;
  description: string;
  userCount: number;
  services: string[];
  created: string;
  permissions?: Record<string, string>;
}
