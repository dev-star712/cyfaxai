import ChartLine from "./linechart"
import { FormattedMessage } from "react-intl";

const VulnerabilitiesServices = () => {
  return (
    <div className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
        <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium max-sm:tracking-[0.3px] sm:text-2xl/[150%] sm:font-semibold">
            <FormattedMessage id="vulnerabilitiesServicesTitle" />
            </h2>
        </div>
        <div className="mt-5"></div>
        <div style={{ width: '100%', height: '300px' }}> {/* Adjust the height as needed */}  
            <ChartLine />  
        </div>
    </div>
  );
};

export default VulnerabilitiesServices;
