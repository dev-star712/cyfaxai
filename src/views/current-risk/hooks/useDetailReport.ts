import { getRolesQueryOptions, getDetailReportQueryOptions } from "@/cyfax-api-client/queries";
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const domainAtom = atom<null | string>();

interface RoleData {  
  id: string;  
  role_name: string;  
  authorized_permissions?: string[];  
}

function mapRoleNameToId(data: Roles[] | undefined): Record<string, string> {  
  const mapping: Record<string, string> = {};  

  // Provide default value for missing properties  
  data?.forEach(role => {  
    mapping[role.id] = role.role_name;  
  });  

  return mapping;  
}


const useDetailReport = () => {
  const [domain, setDomain] = useAtom(domainAtom);
  const { data, isAdmin } = useAuthUserAccount();

  const getDetailReportQuery = useQuery({
    ...getDetailReportQueryOptions({
      domain: domain || undefined,
    }),
    enabled: !!data,
  });

  const getRolesQuery = useQuery({
    ...getRolesQueryOptions(),
  });

  const isOpenDomainModal = !domain;

  const queryData = getDetailReportQuery.data?.data;
  const combolist_chart = queryData?.combolist_chart || [];
  const vuln_chart=queryData?.vuln_chart;
 
  const rolesData = getRolesQuery.data?.data as RoleData[];
  const roleNameToIdMap = mapRoleNameToId(rolesData || []);  

  const chartData = queryData?.security_finding_chart || [];
  const totalSecurityIssuesFound =
    (queryData?.combolist_result.employee_credential_leak.count ?? 0) +
    (queryData?.combolist_result.stealer_logs_for_sale.count ?? 0) +
    (queryData?.combolist_result.stealer_logs.count ?? 0) +
    (queryData?.combolist_result.hacker_dark_web_mentions.count ?? 0) +
    (queryData?.dnstwist_result.count ?? 0) +
    (queryData?.mxtoolbox_result.count ?? 0) +
    (queryData?.vulnscan_result.count ?? 0);

  useEffect(() => {
    if (!data) {
      setDomain(null);
      return;
    }
  }, [data, isAdmin, setDomain]);

  return {
    getDetailReportQuery,
    data: queryData,
    isOpenDomainModal,
    setDomain,
    domain,
    chartData,
    totalSecurityIssuesFound,
    combolist_chart,
    vuln_chart,
    roleNameToIdMap,
    rolesData
  };
};

export default useDetailReport;
