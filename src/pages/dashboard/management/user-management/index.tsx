import React, { useState, useEffect, useCallback } from 'react';  
import UserManagementTable from "./user-management-table";  
import { Tabs, TabsContent } from "@/components/ui/tabs";  
import { PaginationComponent } from '@/components/common/pagination';  
import { FormattedMessage, useIntl } from "react-intl"; 
import { getUsersQueryOptions } from "@/cyfax-api-client/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import CreateUser from "@/components/create-user";
import { getAuthTokenOnClient } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSelectedValue } from '@/context/selectedValueContext'; 

const UserManagement = () => {  
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);  
  const [itemsPerPage, setItemsPerPage] = useState(10);  
  const [maxPage, setMaxPage] = useState(0); 
  const { selectedValue, rowType, setSelectedValue } = useSelectedValue();  
  const [searchTerm, setSearchTerm] = useState(selectedValue || '');  
  const [selectedOption, setSelectedOption] = useState('ORG name');  
  useEffect(() => {  
    if (selectedValue) {  
      setSearchTerm(selectedValue);  
      if (rowType === 'adminEmail') setSelectedOption('Email');  
      if (rowType === 'companyName') setSelectedOption('ORG name');  
      
      setSelectedValue('', '');  
    }  
  }, [selectedValue, rowType, setSelectedValue]);
  
  const gotoPage = (page: number) => {  
    setCurrentPage(page);  
  };  

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setItemsPerPage(Number(event.target.value));  
    setCurrentPage(1); 
  };  

  const allUsers = useQuery({
    ...getUsersQueryOptions(),
  });
  const users = allUsers?.data

  useEffect(() => {  
    const totalCount = users?.length || 0;  
    setMaxPage(Math.ceil(totalCount / itemsPerPage));  
  }, [users?.length, itemsPerPage]);
  const paginatedUsers = users?.slice(  
    (currentPage - 1) * itemsPerPage,  
    currentPage * itemsPerPage  
  );  

  const searchUsers = useCallback(async () => {  
    if(!searchTerm) {
      queryClient.refetchQueries(getUsersQueryOptions());  
    };
    const baseUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/user_management/`;  
    let url = baseUrl;  

    switch (selectedOption) {  
      case 'Full name':  
        url += `?full_name=${encodeURIComponent(searchTerm)}`;  
        break;  
      case 'Email':  
        url += `?email=${encodeURIComponent(searchTerm)}`;  
        break;  
      case 'ORG name':  
        url += `?group_name=${encodeURIComponent(searchTerm)}`;  
        break;  
      default:  
        return;  
    }  
    const tokens = await getAuthTokenOnClient();
    try {  
      const response = await fetch(url, {  
        method: 'GET',  
        headers: {
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${tokens.accessToken}`,
        }
      });  
      if (!response.ok) {  
        throw new Error('Network response was not ok');  
      }  
      const data = await response.json();   
      queryClient.setQueryData(["get-users"], data.data || []);  
    } catch (error) {  
      console.error('Error fetching filtered users', error);  
    }  
  }, [searchTerm, selectedOption, queryClient]); 
  
  useEffect(() => {  
    const timeout = setTimeout(() => {  
      searchUsers();  
    }, 1000);  
  
    return () => clearTimeout(timeout);  
  }, [searchTerm, selectedOption, searchUsers]);

  const [isCreateProfileVisible, setIsCreateProfileVisible] = useState(false); 
  const handleCreateClick = () => {  
    setIsCreateProfileVisible(true);  
  };  
  const handleCreateClose = () => {  
    setIsCreateProfileVisible(false);  
  }; 
  const updateUserInState = (updatedUser: User) => {  
    queryClient.setQueryData(["get-users"], (oldUsers: User[] | undefined) => {  
      return oldUsers?.map(user =>  
        user.id === updatedUser.id ? updatedUser : user  
      );  
    });  
  };
  const handleUserCreated = (newUser:  User) => {  
    queryClient.setQueryData<User[]>(["get-users"], (oldUsers=[]) => {  
      return [...oldUsers, newUser];  
    });  
  }; 
  useEffect(() => {  
    if (users) {  
      console.log('Users:', users);  
    }  
  }, [users]);
  const intl = useIntl();

  return (  
    <>  
      <div className="p-4 xl:p-5">  
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">  
          <h2 className="text-sm font-semibold sm:text-2xl/[120%]">   
            <FormattedMessage id="userManagementTitle" />   
          </h2>   
          <div className="flex w-full flex-col items-center space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">  
            <div className="flex w-full flex-col items-center space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">  
              <div className="relative w-full md:w-auto">  
                <input  
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                  type="text"  
                  placeholder={intl.formatMessage({ id: "search" })}  
                  className="h-10 w-full rounded-lg border-2 pl-3 pr-8 text-xs outline-none placeholder:text-xs md:w-64 md:pr-10 md:text-base md:placeholder:text-base lg:h-12 lg:pl-5 lg:pr-14"  
                  style={{ borderColor: '#720072' }}  
                />  
                <button className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 md:right-5">  
                  <Search style={{color: '#720072'}} className="w-4 md:w-5 lg:w-6" />  
                </button>  
              </div>  

              <div className="flex w-full items-center justify-between space-x-4 md:w-auto md:space-x-2">  
                <p style={{ color: '#720072' }} className="text-sm font-normal sm:text-xl/[120%]">  
                  <FormattedMessage id="searchBy" />  
                </p>  

                <select  
                  value={selectedOption}
                  onChange={(e)=>setSelectedOption(e.target.value)}
                  style={{ color: '#720072' }}
                  id="role"  
                  className="h-11 w-full rounded-lg border px-3 text-sm outline-none md:w-auto md:text-base lg:h-12 lg:px-4"  
                >  
                  <option style={{ color: '#720072' }} value="Full name">Full name</option>  
                  <option style={{ color: '#720072' }} value="Email">Email</option>  
                  <option style={{ color: '#720072' }} value="ORG name">ORG name</option>  
                </select>  
              </div>  
            </div>  
            <button   
              style={{backgroundColor: '#720072'}}
              className="h-12 rounded-lg px-8 text-sm font-semibold text-white duration-300 hover:opacity-90 md:text-base lg:text-lg"   
              onClick={()=>handleCreateClick()}
            >   
                <FormattedMessage id="createUserButton" />   
            </button>
          </div>  
        </div>  
      </div>
      <div className="p-3 sm:rounded-xl sm:p-5">  
        <Tabs defaultValue="sub_domain_exploitable_services">  
          <TabsContent value="sub_domain_exploitable_services" key="sub_domain_exploitable_services" asChild>  
            <div className="overflow-hidden rounded shadow-[0_4px_14px_2px_rgba(0,0,0,0.06)]">  
              <UserManagementTable users={paginatedUsers || []} onUserUpdate={updateUserInState} />  

              
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
      {isCreateProfileVisible && <CreateUser onClose={handleCreateClose} onUserCreate={handleUserCreated} />} 
    </>  
  );  
};  

export default UserManagement;