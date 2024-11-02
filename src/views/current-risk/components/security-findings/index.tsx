import IconCircleExclamation from "@/components/icons/icon-circle-exclamation";
import IconCircleExclamationOutline from "@/components/icons/icon-circle-exclamation-outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";

const Chart = dynamic(
  () =>
    import(
      "@/views/current-risk/components/security-findings/components/chart"
    ),
  { ssr: false },
);

const SecurityFindings = () => {
  const { chartData } = useDetailReport();
  const bgColor = ["#390039", "#720072", "#ab00ab", "#e400e4", "#ff47fe", "#ff78fe", "#ffa9ff"]
  return (
    <div className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium max-sm:tracking-[0.3px] sm:text-2xl/[150%] sm:font-semibold">
          <FormattedMessage id="securityFindings" />
        </h2>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <IconCircleExclamation className="w-5 text-[#292D32] sm:w-6" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <FormattedMessage id="securityFindingModalText" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-x-2.5">
          <p className="text-[15px] font-medium sm:text-base/[150%]">
            <FormattedMessage id="byCategory" />
          </p>
          <IconCircleExclamationOutline className="pointer-events-none w-5 text-[#292D32] opacity-40" />
        </div>

        <div className="flex items-center gap-x-4 font-inter sm:gap-x-[78px]">
          <div className="mt-4 space-y-2.5">
            {chartData.map((item, index) => (
              <div key={item.legend} className="flex items-center gap-x-2.5">
                <div
                  className="size-2.5 rounded-sm"
                  style={{ background: bgColor[index % bgColor.length] }}
                ></div>
                <p className="text-xs">{item.legend}</p>
              </div>
            ))}
          </div>

          <Chart />
          {/* <div className="size-[130px] rounded-full bg-[#720072]/20 sm:size-[185px]"></div> */}
        </div>

        <p className="mt-7 text-center text-xs/[150%]">
          <a
            href="#"
            className="pointer-events-none text-[#720072] underline underline-offset-2 opacity-40"
          >
            <FormattedMessage id="clickHere" />
          </a>{" "}
          <FormattedMessage id="toLearnMoreAboutSecurityFindingsCategories" />
        </p>
      </div>
    </div>
  );
};

export default SecurityFindings;
