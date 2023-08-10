import axios from "axios";

/** 
 * @param supportTeamGroup - name of the group that should be attending to the website new visitor or guest chat
 * 
 * This method retrieve the support group staff member id so as to use it 
 * to create a group chat with the new guest chat. This is done to ensure all the member of the support group 
 * gets the message. 
 * @returns Array of team id's
 * */


 export const getVisitorSupportTeam = async (supportTeamGroup: string = 'Marketing' ) => {

    const endPoint: string = "https://development-api.gate-house.com/cpaat-data/group/staff/" + supportTeamGroup;
    const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDVjN2IxN2RiMDE3MTU0NTJkMDY5YyIsImVtYWlsIjoib2x1d2F0b3lpbi5rb21vbGFmZUBjcGFhdC1jb25zdWx0aW5nLmNvbSIsImlzQ3BhYXRBZG1pbiI6dHJ1ZSwiaWF0IjoxNjg1NjE5Mzk3LCJleHAiOjE2ODgyMTEzOTd9.plZ7NdKzU6EbFHZV5D7dUG9RkOlKoowizA1bY3gDHYQ";
    const team: any = await axios.get(`${endPoint}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    let supportTeam: Array<any> = [];

    try {
       
        if (team?.data?.data.length !== 0) {
          team.data.data.forEach((team: any)=> {
            supportTeam.push(team._id);
          });

          return supportTeam;
        }
      } catch (error: any) {
        console.log("error message:", error?.message);
        return [];
      }
  }
