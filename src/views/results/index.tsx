import Modal from "@/components/modal";
import Spinner from "@/components/ui/spinner";
import { getPublicReportQueryOptions } from "@/cyfax-api-client/queries";
import { formatDate, getApiErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiMiniUser } from "react-icons/hi2";
import { FormattedMessage, useIntl } from "react-intl";
import icon3 from "../../../public/dashboard/Vactor3.svg";
import icon5 from "../../../public/dashboard/Vactor5.svg";
import icon6 from "../../../public/dashboard/Vactor6.svg";
import icon1 from "../../../public/dashboard/Vector1.svg";
import icon2 from "../../../public/dashboard/Vector2.svg";
import icon4 from "../../../public/dashboard/Vector4.svg";
import icon7 from "../../../public/dashboard/Vector7.svg";
import icon8 from "../../../public/dashboard/Vector8.svg";
import DashboardCard from "./components/single-card";

const Results = () => {
  const router = useRouter();
  const intl = useIntl();

  const domain = router.query.domain as string;

  const publicReportQuery = useQuery({
    ...getPublicReportQueryOptions({
      domain,
    }),
  });

  const data = publicReportQuery.data?.data;

  if (publicReportQuery.isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-12 px-5 py-20">
        <Spinner className="w-8 text-[#720072]" />
        <p className="text-black/70 lg:text-xl">
          Please wait. This process may take more than 1 minute.
        </p>
      </div>
    );
  }

  if (publicReportQuery.isError) {
    return (
      <div className="flex w-full items-center justify-center px-5 py-20">
        <p className="text-xl text-red-500">
          {getApiErrorMessage(publicReportQuery.error)}
        </p>
      </div>
    );
  }

  const stealerLogsCount = data?.combolist_result?.stealer_logs?.count || 0;
  const stealerLogsForSaleCount =
    data?.combolist_result?.stealer_logs_for_sale?.count || 0;
  const employeeCredentialLeakCount =
    data?.combolist_result?.employee_credential_leak?.count || 0;
  const hackerDarkWebMentionsCount =
    publicReportQuery.data?.data.combolist_result.hacker_dark_web_mentions
      .count || 0;
  const vulnscanResultCount = data?.vulnscan_result.count || 0;
  const mxtoolboxResultCount = data?.mxtoolbox_result.count || 0;

  const isZeroFindings =
    stealerLogsCount <= 0 &&
    stealerLogsForSaleCount <= 0 &&
    employeeCredentialLeakCount <= 0 &&
    hackerDarkWebMentionsCount <= 0 &&
    vulnscanResultCount <= 0 &&
    mxtoolboxResultCount <= 0;

  return (
    <div className="h-[calc(100vh-43px)] bg-white md:grow lg:h-[calc(100vh-80px)] lg:overflow-y-auto">
      <div className="mx-auto max-w-7xl px-5 xl:px-10">
        <h1 className="mt-5 flex flex-col items-center justify-center text-center font-mulish text-xl font-bold md:text-3xl lg:mt-9 lg:text-[40px] lg:font-bold lg:leading-[60px] xl:flex-row">
          <span className="text-[#000000]">
            <FormattedMessage id="resultPageHeroTitle" />
          </span>
          <span className="ml-3 text-[#720072]">{domain}</span>
        </h1>
        {isZeroFindings && (
          <p
            className="animate-shake mx-auto mt-3 max-w-[700px] rounded-xl border-2 border-accent bg-[#720072]/5 p-3 py-4 text-center"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({ id: "zeroFindings" }),
            }}
          />
        )}

        <div className="mx-auto mt-5 grid grid-cols-2 justify-center gap-4 py-4 md:grid-cols-3 md:py-5 lg:mt-9 lg:grid-cols-3 xl:grid-cols-4">
          {/* first card */}
          <div className="mx-auto flex w-full flex-col rounded-lg border border-[#dec1dd] bg-white p-6 px-3 pt-4 text-center lg:rounded-2xl">
            <Image
              src={icon1}
              className="mx-auto size-6 flex-none md:size-8 lg:h-[42px] lg:w-[55px]"
              alt="icon"
            ></Image>
            <div className="flex grow items-center justify-center">
              <h2 className="mt-8 px-4 font-mulish text-xl font-medium capitalize leading-[30px] lg:text-[32px] lg:leading-[48px] ">
                {/* <FormattedMessage id="highthreatlevel" /> */}
                {data?.severity} Threat Level
              </h2>
            </div>
          </div>
          {/* other cards */}
          <DashboardCard
            date={formatDate(data?.timestamp)}
            title="resultPageCardTitle1"
            iconSrc={icon2}
          />

          <DashboardCard
            date={stealerLogsCount}
            title="resultPageCardTitle2"
            iconSrc={icon3}
          />
          <DashboardCard
            date={stealerLogsForSaleCount}
            title="resultPageCardTitle3"
            iconSrc={icon4}
          />
          <DashboardCard
            date={employeeCredentialLeakCount}
            title="resultPageCardTitle4"
            iconSrc={icon5}
          />
          <DashboardCard
            date={hackerDarkWebMentionsCount}
            title="resultPageCardTitle5"
            iconSrc={icon6}
          />
          <DashboardCard
            date={vulnscanResultCount}
            title="resultPageCardTitle6"
            iconSrc={icon7}
          />

          <DashboardCard
            date={mxtoolboxResultCount}
            title="resultPageCardTitle7"
            iconSrc={icon8}
          />
        </div>

        {/* table section */}
        <table className="mx-auto my-5 w-full">
          <thead>
            <tr className="mb-3 flex h-[39px] items-center justify-between rounded-t-[5px] bg-[#f4f4f4] px-4 lg:h-12">
              <th className="font-mulish text-xs font-medium leading-[18px] lg:text-base lg:font-semibold lg:leading-[20px]">
                <FormattedMessage id="breachTime" />
              </th>
              <th className="font-mulish text-xs font-medium leading-[18px] lg:text-base lg:font-semibold lg:leading-[20px]">
                <FormattedMessage id="credentialsData" />
              </th>
              <th className="font-mulish text-xs font-medium leading-[18px] lg:text-base lg:font-semibold lg:leading-[20px]">
                <FormattedMessage id="source" />
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.combolist_result.employee_credential_leak.credential_items
              .slice(0, 3)
              .map((item) => (
                <tr
                  key={item.credential_data}
                  className={`flex h-12 items-center justify-between border-b bg-white px-4 shadow-md last:rounded-b-[5px] last:border-b-0 lg:shadow-lg`}
                >
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.time}
                  </th>
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.credential_data}
                  </th>
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.source}
                  </th>
                </tr>
              ))}
            {data?.combolist_result.employee_credential_leak.credential_items
              .slice(3, 5)
              .map((item) => (
                <tr
                  key={item.credential_data}
                  className={`relative flex h-12 items-center justify-between overflow-hidden border-b bg-white px-4 shadow-md before:absolute before:inset-0 before:z-10 before:bg-white/5 before:backdrop-blur-sm last:rounded-b-[5px] last:border-b-0 lg:shadow-lg`}
                >
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.time}
                  </th>
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.credential_data}
                  </th>
                  <th className="font-mulish text-[10px] font-normal leading-[18px] text-[#07131F] lg:text-sm lg:font-medium lg:leading-[13px]">
                    {item.source}
                  </th>
                </tr>
              ))}
          </tbody>
        </table>

        <Modal>
          <button className="my-5 flex h-12 items-center justify-center gap-x-1 rounded-lg bg-[#720072] px-6 duration-200 hover:bg-[#a83aa3] lg:h-[56px] lg:gap-x-1.5">
            <HiMiniUser className="text-2xl text-white" />
            <p className="font-mulish text-base font-semibold leading-[19px] text-white lg:text-xl lg:leading-[24px]">
              <FormattedMessage id={"ctaButton"} />
            </p>
          </button>
        </Modal>

        <h3 className="mb-9 mt-5 font-mulish text-xs font-normal leading-[18px] text-black lg:text-base lg:font-medium lg:leading-6">
          <FormattedMessage id={"guidelineText"} />
        </h3>
      </div>
    </div>
  );
};

export default Results;
