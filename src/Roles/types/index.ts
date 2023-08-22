export interface Role {
  id: string;
  keycloakId: string;
  name: string;
  groupName: string;
  description: string;
  userCount: number;
  services: string[];
  permissions: Record<string, string>;
}

export type ServiceConfigurationType = {
  name: string;
  selected: boolean;
  resources: {
    name: string;
    selected: boolean;
    show: boolean;
    permissions: {
      id: string;
      name: string;
      selected: boolean;
    }[];
  }[];
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
