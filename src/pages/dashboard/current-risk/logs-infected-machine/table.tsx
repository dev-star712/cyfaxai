import { MachineTableData } from "@/types/api-responses/detail-report";
import React from "react";  
import { FormattedMessage } from "react-intl";  

const LogsInfectedMachine = ({ data } : {data: MachineTableData}) => {  
    const tableBody = data ?  
        data.map((row, i) => {  
            const affectedAssets = Array.isArray(row.affected_asset) ? row.affected_asset : [row.affected_asset];  
            // Normalize row.user to an array, similar to affectedAssets  
            const users = Array.isArray(row.user) ? row.user : [row.user];  

            return (  
                <tr key={i} className="[&>td]:border-b [&>td]:py-2 [&>td]:pl-4 [&>td]:first:pl-3 sm:[&>td]:py-4 sm:[&>td]:pl-6 sm:[&>td]:first:pl-6 [&>td]:font-mulish [&>td]:text-xs sm:[&>td]:text-sm">  
                    <td>  
                        {affectedAssets.map((asset, index) => (  
                            <React.Fragment key={index}>  
                                {asset}  
                                {index < affectedAssets.length - 1 && <span className="text-red-500"> | </span>}  
                            </React.Fragment>  
                        ))}  
                    </td>  
                    <td>{row.tag}</td>  
                    {/* Display users, separated by a colon for multiple values */}  
                    <td>  
                        {users.map((user, index) => (  
                            <React.Fragment key={index}>  
                                {user}  
                                {index < users.length - 1 && <span className="text-red-500"> | </span>}  
                            </React.Fragment>  
                        ))}  
                    </td>  
                    <td>{row.machine_ip}</td>  
                </tr>  
            );  
        }) :  
        (<tr><td colSpan={4}>No data available</td></tr>);  

    return (  
        <div className="flex w-full overflow-x-auto">  
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
                            <FormattedMessage id="users" />  
                        </th>  
                        <th>  
                            <FormattedMessage id="machineIP" />  
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

export default LogsInfectedMachine;