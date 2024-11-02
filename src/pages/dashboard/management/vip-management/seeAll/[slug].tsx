// ./seeAll/[slug].tsx  
import EmailProtectionResultsAllTable from './table';  
import { Tabs, TabsContent } from '@/components/ui/tabs';  
import { FormattedMessage } from 'react-intl';  
import React, { useState, useEffect } from 'react';  
import { PaginationComponent } from '@/components/common/pagination';  
import { useDataContext } from '@/context/DataContext'; 

const LeakedCredentials = () => {  
  const { data } = useDataContext(); 
  const [currentPage, setCurrentPage] = useState(1);  
  const [itemsPerPage, setItemsPerPage] = useState(10);  
  const [maxPage, setMaxPage] = useState(0);  

  useEffect(() => {  
    if (data) { 
      const totalItems = data.length || 0;  
      setMaxPage(Math.ceil(totalItems / itemsPerPage));  
    }  
  }, [data, itemsPerPage]);  

  const paginatedData = data ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];  

  const gotoPage = (page: number) => {  
    setCurrentPage(page);  
  };  

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setItemsPerPage(Number(event.target.value));  
    setCurrentPage(1);  
  };  

  return (  
    <>  
      <div className="p-4 font-mulish xl:p-5">  
        <h2 className="text-sm font-semibold sm:text-2xl/[120%]">  
          <FormattedMessage id="leakedCredentialsTableTitle" />  
        </h2>  
      </div>  
      <div className="p-3 sm:rounded-xl sm:p-5">  
        <Tabs defaultValue="leaked_credentials">  
          <TabsContent value="leaked_credentials" key="leaked_credentials" asChild>  
            <div className="overflow-hidden rounded shadow-[0_4px_14px_2px_rgba(0,0,0,0.06)]">  
              {paginatedData && paginatedData.length > 0 ? (  
                <EmailProtectionResultsAllTable data={paginatedData} />  
              ) : (  
                <p>No data available</p>  
              )}  

              <div className="flex w-full justify-center py-4">  
                <div className="flex items-center justify-center space-x-8">  
                  <div className="flex w-full justify-center py-4">  
                    <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">  
                      <div className="flex flex-row items-center justify-center md:justify-start">  
                        <label htmlFor="itemsPerPage" className="mr-2">  
                          <FormattedMessage id="pageShowCount" />  
                        </label>  
                        <select  
                          value={itemsPerPage}  
                          onChange={handleItemsPerPageChange}  
                          className="text-center md:text-left"  
                        >  
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

export default LeakedCredentials;