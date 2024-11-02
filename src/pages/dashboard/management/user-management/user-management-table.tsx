import { FormattedMessage } from "react-intl";  
import UpdateProfile from "@/components/user-profile-update";
import ChangePassword from "@/components/user-password-change";
import DeleteProfile from "@/components/user-profile-delete";
import RemoveProfile from "@/components/user-profile-remove";
import ChooseOption from "@/components/choose-option"
import AddToGroup from "@/components/add-to-group"
import {useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
interface UserManagementTableProps{
  users: any[];
  onUserUpdate: (user: User) => void;
}

const capitalizeWords = (s: string) => {  
  if (typeof s !== 'string') {  
    return '';
  }  

  return s  
    .replace(/_/g, ' ')  
    .split(' ')  
    .map(word => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))  
    .join(' ');  
};

const UserManagementTable: React.FC<UserManagementTableProps> = ({users, onUserUpdate,}) => {  

  const [isUpdateProfileVisible, setIsUpdateProfileVisible] = useState(false);  
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);  
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);  
  const [isRemoveVisible, setIsRemoveVisible] = useState(false);  
  const [isChooseVisible, setIsChooseVisible] = useState(false);  
  const [isAddToGroupVisible, setIsAddToGroupVisible] = useState(false);
  const [userToAddToGroup, setUserToAddToGroup] = useState<User | null>(null);
  const handleAddToGroupClick = (user: User) => {  
    setUserToAddToGroup(user);  
    setIsAddToGroupVisible(true);  
  };  
  
  const handleAddToGroupClose = () => {  
    setIsAddToGroupVisible(false);  
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);  

  const handleEditClick = (user: User) => {  
    setIsUpdateProfileVisible(true);  
    setSelectedUser(user);
  };  
  const handleChangeClick = (user: User) => {
    setIsChangePasswordVisible(true);
    setSelectedUser(user);
  }
  const handleDeleteClick = (user: User) => {
    setIsChooseVisible(true);
    setSelectedUser(user);
  }

  const handleUpdateClose = () => {  
    setIsUpdateProfileVisible(false);  
  }; 
  const handleChangeClose = () => {  
    setIsChangePasswordVisible(false);  
  }; 
  const handleDeleteClose = () => {  
    setIsDeleteVisible(false);  
  }; 
  const handleChooseClose = () => {  
    setIsChooseVisible(false);  
  }; 
  const handleRemoveClose = () => {  
    setIsRemoveVisible(false);  
  }; 
  const handleRemoveAction = () => {  
    setIsChooseVisible(false);  
    setIsRemoveVisible(true);  
  };  
  
  const handleDeleteAction = () => {  
    setIsChooseVisible(false);  
    setIsDeleteVisible(true);  
  }; 

  const displayFullNameOrEmailPart = (user: User | undefined): string => {  
    if (!user) return 'Unknown';  
    if (user.full_name && user.full_name.trim().length > 0) {  
      return user.full_name;  
    } else if (user.email && user.email.includes('@')) {  
      return user.email.split('@')[0];  
    }  
    return 'Unknown';  
  };
  const displayRoleName = (roleName: string | undefined) => roleName ? capitalizeWords(roleName) : 'Unknown Role';  
  const displayGroupNameOrNA = (user: User) => {  
    const rolesWithNoGroupName = ['super_admin', 'client_admin', 'partner_admin'];  
    if (!user.group_name && rolesWithNoGroupName.includes(user.role_name)) {  
      return 'N/A';  
    } else if (!user.group_name) {  
      return (  
        <button   
          style={{backgroundColor: '#720072'}}
          className="rounded px-2 py-1 text-white"   
          onClick={() => handleAddToGroupClick(user)}  
        >  
          + Add to group  
        </button>  
      );  
    } else {  
      return capitalizeWords(user.group_name);  
    }  
  };
  const onGroupAdded = (updatedUser: User) => {  
    onUserUpdate(updatedUser);  
  };

  const getInitial = (user: User): string => {  
    if (user.full_name && user.full_name.length > 0) {  
        return user.full_name.charAt(0).toUpperCase();  
    }  

    if (user.email && user.email.length > 0) {  
        return user.email.charAt(0).toUpperCase();  
    }  

    return '?';  
};

  return (  
    <>
      <div>  
        <table className="w-full max-lg:hidden">  
          <thead>  
            <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:text-center [&>th]:font-semibold">  
              <th>  
                <FormattedMessage id="#" />  
              </th>  
              <th>  
                <FormattedMessage id="user" />  
              </th>  
              <th>  
                <FormattedMessage id="phoneNumber" />  
              </th>  
              <th>  
                <FormattedMessage id="createdAt" />  
              </th>  
              <th>  
                <FormattedMessage id="orgName" />  
              </th>  
              <th>  
                <FormattedMessage id="role" />  
              </th>  
              <th>  
                <FormattedMessage id="actions" />  
              </th>  
            </tr>  
          </thead>  
          <tbody>  
          {users && users.map((user, index) => (
            <tr 
              key={user.id} 
                className="h-20 border-b py-4 text-sm"  
            >  
                <td className="text-center">{index+1}</td>  
                <td className="text-center">  
                  <div className="flex items-start justify-start">  
                    <div   
                      style={{backgroundColor: "RGB(236, 229, 253)", color: "RGB(133, 91, 243)"}}   
                      className="ml-20 rounded-md p-3 font-extrabold"  
                    >  
                      {getInitial(user)}
                    </div>  
                    <div className="ml-2 flex flex-col text-left"> 
                      <span style={{fontWeight: "bold"}}>{displayFullNameOrEmailPart(user)}</span>  
                      <span>{user.email}</span>  
                    </div>  
                  </div> 
                </td>
                <td className="text-center">{user.phone}</td>  
                <td className="text-center">{new Date(user.created_at).toLocaleDateString()}</td>  
                <td className="text-center">  
                  {displayGroupNameOrNA(user)}
                </td>
                <td className="rounded-lg text-center">  
                  <div style={{backgroundColor: "RGB(248, 228, 229)", color: "RGB(220, 111, 144)"}} className="mx-auto rounded-md py-2 font-bold">  
                    {displayRoleName(user.role_name)}  
                  </div>  
                </td>
                <td className="text-center">  
                  <div className="mr-2 inline-block rounded-lg bg-blue-50 p-2">  
                    <EditIcon className="size-5 text-sky-600" onClick={()=>handleEditClick(user)}/>  
                  </div> 
                  <div className="mr-2 inline-block rounded-lg bg-blue-50 p-2">  
                    <RefreshIcon className="size-5 text-orange-400" onClick={()=>handleChangeClick(user)}/>  
                  </div> 
                  <div className="inline-block rounded-lg bg-blue-50 p-2">  
                    <DeleteIcon className="size-5 text-orange-700" onClick={()=>handleDeleteClick(user)}/>  
                  </div>  
                </td>
            </tr>  
          ))}
          </tbody>
        </table>  
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
          {users && users.map((user, index) => (
          <div
            key={user.id} 
              className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)]"
          >
            <div className="grid grid-cols-[repeat(3,auto)] items-center gap-5">  
              <div>  
                <p className="text-[13px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="#" />  
                </p>  
                <span className="mt-2.5 text-xs">{index+1}</span>  
              </div>  
              <div>  
                <p className="text-[13px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="user" />  
                </p>  
                <div className="flex items-center justify-center">  
                    <div   
                      style={{backgroundColor: "RGB(236, 229, 253)", color: "RGB(133, 91, 243)"}}   
                      className="rounded-md px-2 py-1"  
                    >  
                      {getInitial(user)}
                    </div>  
                    <div className="ml-2 flex flex-col text-left text-xs"> 
                      <span>{displayFullNameOrEmailPart(user)}</span>  
                      <span>{user.email}</span>  
                    </div>  
                  </div> 
              </div>  
              <div>  
                <p className="text-[11px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="phoneNumber" />  
                </p>  
                <span className="mt-2.5 text-xs">{user.phone}</span>  
              </div>  
            </div>

            <hr className="my-2.5 border-t border-black/20" />

            <div className="grid grid-cols-[repeat(3,auto)] items-center gap-5">
              <div>  
                <p className="text-[11px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="createdAt" />  
                </p>  
                <span className="mt-2.5 text-xs">{new Date(user.created_at).toLocaleDateString()}</span>  
              </div>  
              <div>  
                <p className="text-center text-[13px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="companyName" />  
                </p>  
                <span className="mt-2.5 block max-w-[150px] truncate text-center text-xs">  
                  {displayGroupNameOrNA(user)}
                </span>  
              </div>
              <div>
                <p className="text-center text-[13px] font-semibold tracking-[-0.2px]">
                    <FormattedMessage id="role" />
                </p>
                <div style={{fontSize: "14px", width: "100px", backgroundColor: "RGB(248, 228, 229)", color: "RGB(220, 111, 144)"}} className="mx-auto rounded-md py-2 text-center font-bold">  
                  {displayRoleName(user.role_name)}  
                </div>  
              </div>
            </div>

            <hr className="my-2.5 border-t border-black/20" />

            <div className="flex items-center justify-between">  
              <p className="text-[13px] font-semibold tracking-[-0.2px]">  
                <FormattedMessage id="actions" />  
              </p>  
              <div className="flex items-center">  
                <div className="mr-2 inline-block rounded-lg bg-blue-50 p-2">  
                  <EditIcon className="size-5 text-sky-600" onClick={()=>handleEditClick(user)}/>  
                </div> 
                <div className="mr-2 inline-block rounded-lg bg-blue-50 p-2">  
                  <RefreshIcon className="size-5 text-orange-400" onClick={()=>handleChangeClick(user)}/>  
                </div> 
                <div className="inline-block rounded-lg bg-blue-50 p-2">  
                  <DeleteIcon className="size-5 text-orange-700" onClick={()=>handleDeleteClick(user)}/>  
                </div> 
              </div>  
            </div>
          </div>
          ))}
        </div>
      </div>
      {isUpdateProfileVisible && selectedUser && <UpdateProfile user={selectedUser} onClose={handleUpdateClose} onUserUpdate={onUserUpdate} />} 
      {isChangePasswordVisible && selectedUser && <ChangePassword onClose={handleChangeClose} user={selectedUser}/>}
      {isDeleteVisible && selectedUser && <DeleteProfile user={selectedUser} onClose={handleDeleteClose} />} 
      {isRemoveVisible && selectedUser && <RemoveProfile user={selectedUser} onClose={handleRemoveClose} />}
      {isChooseVisible && (  
        <ChooseOption  
          onClose={handleChooseClose}  
          onRemove={handleRemoveAction}  
          onDelete={handleDeleteAction}  
        />  
      )} 
      {  
        isAddToGroupVisible && userToAddToGroup && (  
          <AddToGroup user={userToAddToGroup} onClose={handleAddToGroupClose} onGroupAdded={onGroupAdded} />  
        )  
      } 
    </>
  );
};

export default UserManagementTable;
