import { supabase } from "@/lib/supabase-client";

export interface EmployeeProfile {
    role: string,
    username: string
}

export async function assignEmployeeUUID(userId: string, userEmail: string) {

    const trimmedEmail = userEmail.trim();

    const {data, error} = await supabase
        .from('employee')
        .update({ auth_id: userId })
        .eq('email', trimmedEmail)

    if (error) {
        console.error(`UUID assignment failed for ${trimmedEmail}: ${error.message}`);
        return { success: false, error: error.message }; // Return failure if update API call failed
    }

    console.log(`UUID successfully assigned to employee in assignEmployeeUUID: ${trimmedEmail}`)
    console.log(`User ID assigned in assignEmployeeUUID: ${userId}`);

    // ... instead of just returning data:
    return { success: true, data };
}

export const fetchEmployeeData = async (userId: string): Promise <EmployeeProfile | null> => {

    console.log(`User id passed to fetch employee: ${userId}`)

    const { data, error } = await supabase
        .from('employee')
        .select('role, username')
        .eq('auth_id', userId)
        .single()

    console.log(`username in fetch employee: ${data?.username}`);
        
    
    if (error) throw new Error(`failed fetching employee's data: ${error.message}`);
    return data as EmployeeProfile | null; 
}

export const checkAndAssignUUID = async (userId: string, userEmail: string) => {
    const assignmentResult = await assignEmployeeUUID(userId, userEmail);

    return assignmentResult ? userId : null;
}