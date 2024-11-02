import LeakedPieChart from "./pieChartWithCustomizedLabel"
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { FormattedMessage } from "react-intl";

const SecurityFindings = () => {
  const { combolist_chart } = useDetailReport();
  const sumOfCounts = combolist_chart.reduce((accumulator, item) => accumulator + item.count, 0);
  const bgColor = ["#390039", "#720072", "#ab00ab"]
  return (
    <div className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
        <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium max-sm:tracking-[0.3px] sm:text-2xl/[150%] sm:font-semibold">
                <FormattedMessage id="leakedPasswords" /><span style={{color: "#ab00ab", fontSize: '23px'}}>{sumOfCounts}</span>)
            </h2>
        </div>


        <div className="grid grid-cols-3 items-center font-inter sm:gap-x-[78px]">
            <div className="col-span-1 mx-2 mt-4 grid space-y-2">
                {combolist_chart.map((item, index) => (
                    <div key={item.legend} className="flex items-center gap-x-2">
                    <div
                        className="size-3 rounded-sm"
                        style={{ background: bgColor[index % bgColor.length] }}
                    ></div>
                    <p className="truncate text-sm">{item.legend}</p>
                    </div>
                ))}
            </div>

            <div style={{ width: '100%', height: '300px' }} className="col-span-2 grid"> {/* Adjust the height as needed */}  
                <LeakedPieChart /> 
            </div>

            {/* <div className="size-[130px] rounded-full bg-[#720072]/20 sm:size-[185px]"></div> */}
        </div>

    </div>
  );
};

export default SecurityFindings;
