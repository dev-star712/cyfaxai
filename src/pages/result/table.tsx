import { TableData } from "@/types/api-responses/detail-report";  
import React from "react";  
import { FormattedMessage } from "react-intl";  
import { useRouter } from 'next/router';   

const EmailProtectionResultsAllTable = ({ data }: { data: TableData }) => {  
  const router = useRouter();  
  const isHomePage = router.pathname !== '/result';  
  const blurClass = 'relative before:absolute before:inset-0 before:z-10 before:bg-white/5 before:backdrop-blur-sm';  

  const tableBody = data ?   
    data.map((row, i) => (  
      <tr key={i} className={`flex items-center justify-between [&>td]:border-b [&>td]:py-4 [&>td]:pl-6 [&>td]:font-mulish [&>td]:text-xs [&>td]:first:pl-[16px] sm:[&>td]:text-sm sm:[&>td]:first:pl-6 ${!isHomePage ? 'even:bg-[#ebe8e8] even:text-black' : ''} ${i >= 3 ? blurClass : ''}`}>  
        <td className="text-start">{row.time}</td>  
        <td className="text-center">{row.credential_data}</td>  
        <td className="pr-3 text-end">{row.source}</td>  
      </tr>  
    )) :   
    (<tr><td colSpan={3}>No data available</td></tr>);   

  return (  
    <table className={`w-full min-w-full sm:min-w-[600px] ${!isHomePage ? 'rounded-3xl shadow-[0_4px_14px_2px_rgba(0,0,0,0.1)]' : ''}`}>   
      {isHomePage && (  
        <thead>  
          <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:pl-6 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold [&>th]:first:pl-[16px] sm:[&>th]:first:pl-6">  
            <th>  
              <FormattedMessage id="breachTime" />  
            </th>  
            <th style={{ textAlign: 'center' }}>  
              <FormattedMessage id="credentialsData" />  
            </th>  
            <th style={{ textAlign: 'right', paddingRight: '12px' }}>  
              <FormattedMessage id="source" />  
            </th>  
          </tr>  
        </thead>  
      )}  
      <tbody>  
        {tableBody}  
      </tbody>  
    </table>  
  );  
};  

export default EmailProtectionResultsAllTable;