export type CredentialItem = {
  time: string;
  credential_data: string;
  source: "COMBOLIST" | "TELEGRAM";
};

export type PricesItem = {
  feature: string;
  essentials: string;
  professional: string;
  enterprise: string;
};

export type StealerLogsForSaleItem = {
  affected_asset: string[];
  tag: string;
  source: string;
  price: string;
};

export type StealerLogsItem = {
  affected_asset: string[];
  tag: string;
  user: string[];
  machine_ip: string;
};

export type DarkWebMentionsItem = {
  date: string;
  content: string;
  source: string;
};

export type HackerMentionsItem = {
  date: string;
  content: string;
  source: string;
};

export type ComboListResult = {
  employee_credential_leak: {
    count: number;
    credential_items: CredentialItem[];
  };
  stealer_logs_for_sale: {
    count: number;
    stealer_logs_for_sale_items: StealerLogsForSaleItem[];
  };
  stealer_logs: {
    count: number;
    stealer_logs_items: StealerLogsItem[];
  };
  hacker_dark_web_mentions: {
    count: number;
    dark_web_mentions_items: DarkWebMentionsItem[];
    hacker_mentions_items: HackerMentionsItem[];
  };
};

export type DNSTwistItem = {
  fuzzer: string;
  domain: string;
  dns_ns: string[];
  dns_a: string[];
  dns_mx: string[];
  url: string;
  title: string;
  scheme: string;
  web_server: string | null;
  tech: string[] | null;
};
export type DNSTwistResult = {
  count: number;
  dnstwist_items: DNSTwistItem[];
};

export type MXToolboxDNSItem = {
  host: string;
  result: string;
};
export type TableData = CredentialItem[];  

export type PriceData = PricesItem[];

export type StealerTableData = StealerLogsForSaleItem[];

export type MachineTableData = StealerLogsItem[];

export type DarkTableData = DarkWebMentionsItem[];

export type HackerTableData = HackerMentionsItem[];

export type MXToolboxCategory = Record<string, MXToolboxDNSItem[]>;

export type MXToolboxResult = {
  count: number;
  mxtoolbox_category: MXToolboxCategory;
};

export type SubDomainResult = {
  count: number;
  sub_domain_items: any[]; // Replace `any` with the correct export type if needed
};

export type DiscoveryResult = {
  org_domain: Record<string, unknown>;
  sub_domain: SubDomainResult;
};

export type VulnscanResult = {
  count: number;
  org_domain: {
    host: string;
    ip: string;
    count: number;
    ports: {
      port: number;
      protocol: string;
      service_name: string;
      service_product: string;
      vulnerability_list: {
        vuln_id: string;
        is_exploit: boolean;
        cvss: number;
        references: string[];
      }[];
    }[];
  };
  sub_domain: {
    host: string;
    ip: string;
    ports: {
      port: number;
      protocol: string;
      service_name: string;
      service_product: string;
      vulnerability_list: {
        vuln_id: string;
        is_exploit: boolean;
        cvss: number;
        references: string[];
      }[];
    }[];
  }[]; // Replace `any` with the correct export type if needed
};

export type DetailScore = {
  total_score: number;
  combolist_score: number;
  logs_from_infected_score: number;
  stealer_logs_score: number;
  dark_web_score: number;
  email_score: number;
  vuln_score: number;
  vip_score: number;
};

export interface VulnerabilityChartItem {  
  total: number;  
  exploitable: number;  
} 

export type Data = {
  combolist_result: ComboListResult;
  dnstwist_result: DNSTwistResult;
  mxtoolbox_result: MXToolboxResult;
  discovery_result: DiscoveryResult;
  vulnscan_result: VulnscanResult;
  timestamp: number;
  severity: string;
  detail_score: DetailScore;
  security_finding_chart: {
    legend: string;
    count: number;
    color: string;
  }[];
  combolist_chart: {
    legend: string;
    count: number;
  }[];
  vuln_chart?: Record<string, VulnerabilityChartItem | null>
};

export type DetailReportAPIResponse = {
  data: Data;
};
