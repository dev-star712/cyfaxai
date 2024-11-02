import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
} from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import { useState, useEffect } from "react";  
import { toast } from "react-toastify";
import { getAuthTokenOnClient } from "@/lib/utils";

interface ChooseOptionProps {  
    onClose: () => void;  
    user: User;
    onGroupAdded: (updateUser: User) => void;
}   

const AddToGroup = ({ onClose, user, onGroupAdded }: ChooseOptionProps) => {  
    const [groups, setGroups] = useState<Groups[]>([]);  
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState("");  
    const filteredGroups = groups?.filter(group =>   
        group.name.toLowerCase().includes(searchTerm.toLowerCase())  
        );

    useEffect(() => {  
        const getGroups = async () => {  
            const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/groups/?group_kind=${user.role_name.includes('partner_user') ? 'partner' : user.role_name.includes('client_user') ? 'client' : ''}`;  
            const tokens = await getAuthTokenOnClient();  
            try {  
                const response = await fetch(apiUrl, {  
                    method: 'GET',  
                    headers: {  
                        'Content-Type': 'application/json',  
                        'Authorization': `Bearer ${tokens.accessToken}`,  
                    },  
                });  

                if (!response.ok) {  
                    const errorResponse = await response.json();   
                    throw new Error(errorResponse.data || "An error occurred while fetching groups");  
                }  

                const data = await response.json();  
                const loadedGroups = data.data || [];  
                setGroups(loadedGroups);
                if (loadedGroups.length > 0) {  
                    const defaultGroup = loadedGroups[0];  
                    setSelectedGroupId(defaultGroup.id);  
                    setSelectedGroupName(defaultGroup.name); // Set default group name  
                } 
            } catch (error) {  
                console.error('Failed to fetch groups:', error);  
                toast.error("Failed to fetch groups");  
            }  
        };  
        
        getGroups();  
    }, [user.role_name]);
    const [selectedGroupName, setSelectedGroupName] = useState('');
    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  
        const selectedGroup = groups.find(group => group.id === e.target.value);  
        if (selectedGroup) {  
            setSelectedGroupId(selectedGroup.id);  
            setSelectedGroupName(selectedGroup.name);  
        }  
    };

    const handleAddGroup = async () => {  
        const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/group_user/`;  
        const requestBody = {  
            group: selectedGroupId,  
            users: [user.id]
        };  
        const tokens = await getAuthTokenOnClient();
        try {  
            const response = await fetch(apiUrl, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                    'Authorization': `Bearer ${tokens.accessToken}`,
                },  
                body: JSON.stringify(requestBody),  
            });  

            if (!response.ok) {  
                const errorResponse = await response.json(); 
                throw new Error(errorResponse.data);
            }  
            
            const data = await response.json();  
            const updatedUser = { ...user, group_name: selectedGroupName }; // selectedGroupName is the string name of the group that the user was added to   
            onGroupAdded(updatedUser);  

            toast.success(data.data);
            onClose()
        } catch (error) {  
            console.error('Failed to add the group:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to add the group. ${errorMessage}`);   
        }  
    }; 

    return (  
        <>  
            <Dialog open>  
            <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                <DialogHeader>  
                <DialogTitle>  
                    <div className="flex w-full items-center justify-between">  
                    <button onClick={onClose} className="ml-auto text-[#ab00ab]">X</button>  
                    </div>  
                    <div className="flex flex-1 justify-center">  
                    <h2 className="text-center text-xl font-semibold text-[#ab00ab]">  
                        <FormattedMessage id="selectGroupTitle" />  
                    </h2>  
                    </div>  
                </DialogTitle>  
                </DialogHeader>  
                <div className="my-4">  
                <input  
                    type="text"  
                    placeholder="Search..."  
                    value={searchTerm}  
                    onChange={(e) => setSearchTerm(e.target.value)}  
                    className="mb-2 w-full rounded border p-2"  
                />  
                
                <select className="w-full rounded border p-2"
                    value={selectedGroupId}  
                    onChange={handleGroupChange}
                >  
                    {filteredGroups && filteredGroups.map((group) => (  
                        <option key={group.id} value={group.id}>{group.name}</option>  
                    ))} 
                </select>
                </div>  
                <div className="flex justify-center">  
                <button  
                    className="mr-2 h-11 w-32 rounded-md bg-[#720072] px-4 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                    onClick={handleAddGroup}  
                >  
                    <FormattedMessage id="addGroup" />  
                </button>  
                </div>  
            </DialogContent>  
            </Dialog>   
        </>  
    );  
};  

export default AddToGroup;