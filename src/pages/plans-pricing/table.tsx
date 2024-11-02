import { PriceData } from "@/types/api-responses/detail-report";  
import React from "react";  
import { FormattedMessage } from "react-intl";  

const PlansPricingAllTable = ({  
  data,  
  selectedPlan  
}: {  
  data: PriceData;  
  selectedPlan: string;  
}) => {  
  const tableBody = data ? (  
    data.map((row, i) => (  
      <tr  
        key={i}  
        className="bg-[#09171B] text-left leading-[28px] text-white [&>td]:border-b [&>td]:px-6 [&>td]:py-4 [&>td]:font-mulish [&>td]:text-xs sm:[&>td]:text-sm"  
      >  
        <td>{row.feature}</td>  
        <td  
          className={`${  
            selectedPlan !== "essentials" ? "hidden md:table-cell" : ""  
          }`}  
        >  
          {row.essentials}  
        </td>  
        <td  
          className={`${  
            selectedPlan !== "professional" ? "hidden md:table-cell" : ""  
          }`}  
        >  
          {row.professional}  
        </td>  
        <td  
          className={`${  
            selectedPlan !== "enterprise" ? "hidden md:table-cell" : ""  
          }`}  
        >  
          {row.enterprise}  
        </td>  
      </tr>  
    ))  
  ) : (  
    <tr>  
      <td colSpan={4} className="text-left">No data available</td>  
    </tr>  
  );  

  return (  
    <div className="overflow-hidden rounded-3xl">  
      <table className="w-full min-w-full">  
        <thead>  
          <tr className="bg-[#720072] leading-[18.75px] text-white [&>th]:px-6 [&>th]:py-3.5 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold"  
          >  
            <th><FormattedMessage id="feature" /></th>  
            <th className={`${selectedPlan !== "essentials" ? "hidden md:table-cell" : ""}`}>  
              <FormattedMessage id="essentials" />  
            </th>  
            <th className={`${selectedPlan !== "professional" ? "hidden md:table-cell" : ""}`}>  
              <FormattedMessage id="professional" />  
            </th>  
            <th className={`${selectedPlan !== "enterprise" ? "hidden md:table-cell" : ""}`}>  
              <FormattedMessage id="enterprise" />  
            </th>  
          </tr>  
        </thead>  
        <tbody>{tableBody}</tbody>  
      </table>  
    </div>  
  );  
};  

export default PlansPricingAllTable;