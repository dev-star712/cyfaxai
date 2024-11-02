import { StealerTableData } from "@/types/api-responses/detail-report";  
import React from "react";  
import { FormattedMessage } from "react-intl";  

const StealerLogsForSaleAllTable = ({ data }: { data: StealerTableData }) => {  
    const tableBody = data ?  
      data.map((row, i) => (  
        <tr key={i} className="[&>td]:border-b [&>td]:py-2 [&>td]:pl-4 [&>td]:first:pl-3 sm:[&>td]:py-4 sm:[&>td]:pl-6 sm:[&>td]:first:pl-6 [&>td]:font-mulish [&>td]:text-xs sm:[&>td]:text-sm">  
          <td>{row.affected_asset}</td>  
          <td>{row.tag}</td>  
          <td>{row.source}</td>  
          <td>{row.price}</td>  
        </tr>  
      )) :  
      (<tr><td colSpan={4}>No data available</td></tr>);  
  
    return (  
      <div className="w-full overflow-x-auto">  
        <table className="min-w-full sm:min-w-[600px] w-full">  
          <thead>  
            <tr className="bg-[#60605B]/[.07] [&>th]:py-2 [&>th]:pl-4 [&>th]:first:pl-3 sm:[&>th]:py-3.5 sm:[&>th]:pl-6 sm:[&>th]:first:pl-6 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold [&>th]:text-xs sm:[&>th]:text-sm">  
              <th>  
                <FormattedMessage id="affectedAssets" />  
              </th>  
              <th>  
                <FormattedMessage id="tag" />  
              </th>  
              <th>  
                <FormattedMessage id="source" />  
              </th>  
              <th>  
                <FormattedMessage id="price" />  
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

export default StealerLogsForSaleAllTable;