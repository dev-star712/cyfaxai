import React, { useState, useEffect } from 'react';  
import CompanyDomainNameVariationAllTable from "@/components/company-domain-name-variation-all-table";  
import { Tabs, TabsContent } from "@/components/ui/tabs";  
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";  
import { FormattedMessage } from "react-intl";  
import { PaginationComponent } from '@/components/common/pagination'; 
import SearchBar from "@/components/search-bar";  
import SearchDialog from "@/components/search-dialog"; 
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  

const AttackSurface = () => {  
  const { isOpenDomainModal, data } = useDetailReport();  
  const [currentPage, setCurrentPage] = useState(1);  
  const [itemsPerPage, setItemsPerPage] = useState(10);  
  const [maxPage, setMaxPage] = useState(0);
  
  const { data: account } = useAuthUserAccount();  
  const roleName = account?.role_name || "";  

  const canViewDialog = !["client_admin", "client_user"].includes(roleName);
  
  useEffect(() => {  
    const dnstwistItems = data?.dnstwist_result?.dnstwist_items || [];  
    setMaxPage(Math.ceil(dnstwistItems.length / itemsPerPage));  
  }, [data, itemsPerPage]);  

  const paginatedItems = data?.dnstwist_result?.dnstwist_items?.slice(  
    (currentPage - 1) * itemsPerPage,  
    currentPage * itemsPerPage  
  );   

  const gotoPage = (page: number) => {  
    setCurrentPage(page);  
  };  

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setItemsPerPage(Number(event.target.value));  
    setCurrentPage(1); // Reset to first page since the items per page changed  
  };  

  return (  
    <>  
    <div className="p-4 font-mulish xl:p-5">  
      <div className="mb-6 flex grow items-center justify-start space-x-3 rounded-lg md:space-x-5 lg:mr-5">  
        <SearchBar />  
      </div>  
      <h2 className="text-sm font-semibold sm:text-2xl/[120%]">  
          <FormattedMessage id="domainNameVariationsTableTitle" />   
      </h2>  
    </div>  
      <div className="p-3 sm:rounded-xl sm:p-5">  
        {isOpenDomainModal && canViewDialog && <SearchDialog />} 

        <Tabs defaultValue="domain_name_variations">  
            <TabsContent value="domain_name_variations" key="domain_name_variations" asChild>  
                <div className="overflow-hidden rounded shadow-[0_4px_14px_2px_rgba(0,0,0,0.06)]">  
                    {paginatedItems && (  
                        <CompanyDomainNameVariationAllTable  
                            rows={paginatedItems}  
                        />  
                    )}  
                     <div className="flex w-full justify-center py-4">  
                        <div className="flex items-center justify-center space-x-8">  
                            <div className="flex w-full justify-center py-4">  
                                <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">  
                                    <div className="flex flex-row items-center justify-center md:justify-start">  
                                        <label htmlFor="itemsPerPage" className="mr-2">  
                                            <FormattedMessage id="pageShowCount" />  
                                        </label>  
                                        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="text-center md:text-left">  
                                            <option value="10">10</option>  
                                            <option value="20">20</option>  
                                            <option value="50">50</option>  
                                        </select>  
                                    </div>  
 
                                    <div className="flex w-full justify-center md:justify-start">  
                                        <PaginationComponent  
                                            currentPage={currentPage}  
                                            maxPage={maxPage}  
                                            gotoPage={gotoPage}  
                                        />   
                                    </div>  
                                </div>  
                            </div>
                        </div>  
                    </div>
                </div>  
            </TabsContent>  
        </Tabs>  
      </div>  
    </>  
  );  
};  

export default AttackSurface;