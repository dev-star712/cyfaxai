type Permission = {
  id: string;
  name: string;
  code_name: string;
};

type Roles={
  id: string;
  role_name: string;
}

type Groups = {
  id: string;
  name: string;
  authorized_domains: string[];
  group_kind: string;
  permissions: string[];
  created_at: string;
  admin_user: string;
  created_by: string;
}

type Alerts = {
  id: string;
  domain_name: string;
  group_name: string[];
  owner_email: string;
}

type Pagination = {
  page: number;
  per_page: number;
  num_pages: number;
  total: number;
};

type PermissionsAPIResponse = {
  data: Permission[];
  pagination: Pagination;
};

type RolesAPIResponse = {
  data: Roles[];
}

type GroupsAPIResponse = {
  data: Groups[];
  pagination: Pagination;
}

type AlertsAPIResponse = {
  data: Alerts[];
  pagination: Pagination;
}

interface User {  
  id: string;  
  email: string;  
  full_name: string;  
  phone: string;  
  group_name: string | null;  
  role_name: string; 
  group: string; 
}
interface Group {  
  id: string;
  name: string;  
  authorized_domains: string[];  
  admin_user: string;  
  group_kind: 'client' | 'partner';
  permissions: string[];
  created_by: string;
  created_at: string;
} 

interface Alert {  
  id: string;
  domain_name: string;  
  email_alert_management: string[];  
  teams_alert_management: string[];  
  slack_alert_management: string[];  
  received_email: string;  
  teams_webhook: string;  
  slack_webhook: string;
  owner: string;
  owner_email: string;
  group_name: string;
} 