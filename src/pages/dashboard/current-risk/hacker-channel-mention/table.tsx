import { HackerTableData } from "@/types/api-responses/detail-report";  
import React from "react";  
import { FormattedMessage } from "react-intl";  

const HackerChannelMentionsAllTable = ({ data }: { data: HackerTableData }) => {  
    const tableBody = data ?   
    data.map((row, i) => (  
      <tr key={i} className="[&>td]:border-b [&>td]:py-4 [&>td]:pl-6 [&>td]:first:pl-[16px] sm:[&>td]:first:pl-6 [&>td]:font-mulish [&>td]:text-xs sm:[&>td]:text-sm">  
        <td>{row.date}</td>  
        <td>{row.content}</td>  
        <td>{row.source}</td>  
      </tr>  
    )) :   
    // Render a message or an empty set if data is undefined  
    (<tr><td colSpan={3}>No data available</td></tr>); 
  return (  
    <div className="w-full overflow-x-auto"> {/* Ensure the container takes full width */}  
      <table className="min-w-full sm:min-w-[600px] w-full"> {/* Adjusted for mobile and provided a minimum width for larger screens */}  
        <thead>  
          <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:pl-6 [&>th]:first:pl-[16px] sm:[&>th]:first:pl-6 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold">  
            <th>  
              <FormattedMessage id="date" />  
            </th>  
            <th>  
              <FormattedMessage id="content" />  
            </th>  
            <th>  
              <FormattedMessage id="source" />  
            </th>  
          </tr>  
        </thead>  
        <tbody>  
          {tableBody}
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default HackerChannelMentionsAllTable;