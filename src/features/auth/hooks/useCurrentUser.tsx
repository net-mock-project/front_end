import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../../profile/api/profileApi"


export const useCurrentUser= () =>{
    return useQuery({
        queryKey: ["me"],
        queryFn: getProfile,
        retry: false
    })
}