type CredentialItem = {
  time: string;
  credential_data: string;
  source: string;
};

type CombolistResult = {
  employee_credential_leak: {
    count: number;
    credential_items: CredentialItem[];
  };
  stealer_logs_for_sale: {
    count: number;
  };
  stealer_logs: {
    count: number;
  };
  hacker_dark_web_mentions: {
    count: number;
  };
};

export type DomainPublicReportApiResponse = {
  data: {
    combolist_result: CombolistResult;
    mxtoolbox_result: {
      count: number;
    };
    vulnscan_result: {
      count: number;
    };
    timestamp: number;
    severity: string;
  };
};
