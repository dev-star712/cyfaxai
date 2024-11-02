import EmailProtectionResultsAllTable from "@/components/email-protection-results-all-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { FormattedMessage } from "react-intl";
import SearchBar from "@/components/search-bar";  
import SearchDialog from "@/components/search-dialog"; 
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  

const AttackSurface = () => {
  const { isOpenDomainModal, data } = useDetailReport();

  const { data: account } = useAuthUserAccount();  
  const roleName = account?.role_name || "";  

  const canViewDialog = !["client_admin", "client_user"].includes(roleName);
  
  const tab = 
    {
        value: "email_weaknesses",
        content: (
            <>
              {data?.mxtoolbox_result.mxtoolbox_category && (
                <EmailProtectionResultsAllTable
                  data={data?.mxtoolbox_result.mxtoolbox_category}
                />
              )}
            </>
          ),
        title: "emailWeaknesses",
        seeAllLink: "#",
    }

  return (
    <>
    <div className="p-4 font-mulish xl:p-5">  
      <div className="mb-6 flex grow items-center justify-start space-x-3 rounded-lg md:space-x-5 lg:mr-5">  
        <SearchBar />  
      </div>  
      <h2 className="text-sm font-semibold sm:text-2xl/[120%]">
          <FormattedMessage id="emailWeaknessesTableTitle" /> 
      </h2>  
    </div>
      <div className="p-3 sm:rounded-xl sm:p-5">
        {isOpenDomainModal && canViewDialog && <SearchDialog />} 

        <Tabs defaultValue={tab.value}>
            <TabsContent value={tab.value} key={tab.value} asChild>
                <div className="overflow-hidden rounded shadow-[0_4px_14px_2px_rgba(0,0,0,0.06)]">
                    {tab.content}
                </div>
            </TabsContent>
 
        </Tabs>
      </div>
    </>
  );
};

export default AttackSurface;