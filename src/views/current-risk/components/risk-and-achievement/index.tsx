import IconArrowUp from "@/components/icons/icon-arrow-up";
import IconCircleExclamation from "@/components/icons/icon-circle-exclamation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { FormattedMessage } from "react-intl";
import useMeasure from "react-use-measure";

const RiskAndAchievement = () => {
  const { data } = useDetailReport();
  const [ref] = useMeasure();

  const totalScore = data?.detail_score.total_score ?? 0;

  const scoreColor = (score: number): string => {  
    if (score <= 27) {  
      return '#390039'; // Dark purple to represent the low range  
    } else if (score <= 48) {  
      return '#720072'; // Slightly lighter purple  
    } else if (score <= 73) {  
      return '#ab00ab'; // Medium purple  
    } else if (score <= 100) {  
      return '#ff47fe'; // Light purple to pink  
    } else {  
      return '#ff78fe'; // Lightest pink for any values that might somehow exceed 100  
    }  
  };

  return (
    <div className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium max-sm:tracking-[0.3px] sm:text-2xl/[150%] sm:font-semibold">
          <FormattedMessage id="riskAndAchievementScore" />
        </h2>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <IconCircleExclamation className="w-5 text-[#292D32] sm:w-6" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <FormattedMessage id="riskAndAchievmentModalText" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Gradient */}
      <div className="mb-[64px] mt-[61px] sm:mb-[144px] sm:mt-[70px]">
        <div
          ref={ref}
          className="relative h-11 rounded-full bg-[linear-gradient(90deg,#390039_0%,#720072_27.26%,#ab00ab_48.48%,#ff47fe_72.97%,#ff78fe_100%)] sm:h-[68px]"
        >
          <div className="absolute right-[35%] top-0 flex -translate-y-full flex-col items-center gap-y-2">
            <span className="text-xs font-medium sm:text-sm/[150%]">
              <FormattedMessage id="acceptable" />
            </span>
            <IconArrowUp className="max-w-3" />
          </div>
          <div className="absolute right-[10%] top-0 flex -translate-y-full flex-col items-center gap-y-2">
            <span className="text-xs font-medium sm:text-sm/[150%]">
              <FormattedMessage id="good" />
            </span>
            <IconArrowUp className="max-w-3" />
          </div>
          <div
            style={{
              left: `${totalScore}%`,
            }}
            className="absolute bottom-0 -translate-x-2 translate-y-full"
          >
            <IconArrowUp className="h-[29px] rotate-180" />
            <div
              className="absolute left-1/2 top-full flex w-[126px] flex-col items-center gap-y-2"
              style={{
                transform:
                  totalScore > 93
                    ? "translateX(-85%)"
                    : totalScore < 7
                    ? "translateX(-15%)"
                    : "translateX(-50%)",
              }}
            >
              <span className="text-center text-xs font-medium sm:text-xl/[150%]">
                <FormattedMessage id="currentRiskLevel" />
                <span style={{color: scoreColor(totalScore), fontSize: '22px'}}>{Math.round(totalScore)}</span>  
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Gradient */}

      <div className="flex justify-between gap-4 rounded-full px-6 py-5 shadow-[0_0_12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-x-1.5 sm:gap-x-4">
          <div className="size-4 bg-[#390039] sm:size-7"></div>
          <span className="shrink-0 text-[10px] font-medium max-sm:tracking-[-0.3px] sm:text-sm/[150%]">
            <FormattedMessage id="high" />
          </span>
        </div>
        <div className="flex items-center gap-x-1.5 sm:gap-x-4">
          <div className="size-4 bg-[#ab00ab] sm:size-7"></div>
          <span className="shrink-0 text-[10px] font-medium max-sm:tracking-[-0.3px] sm:text-sm/[150%]">
            <FormattedMessage id="medium" />
          </span>
        </div>
        <div className="flex items-center gap-x-1.5 sm:gap-x-4">
          <div className="size-4 bg-[#ff78fe] sm:size-7"></div>
          <span className="shrink-0 text-[10px] font-medium max-sm:tracking-[-0.3px] sm:text-sm/[150%]">
            <FormattedMessage id="low" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskAndAchievement;
