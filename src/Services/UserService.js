
const getCurrentUser = JSON.parse(localStorage.getItem('currentUser')); 

export const UserService = {
    getUser,
    login,
    logout,
    sessionExpired,
    addNewUser,
    validEmail,
    validUserName,
    getToken,
    getRequestDigest,
    currentUser: getCurrentUser
}

function logout() {
    localStorage.removeItem('currentUser');
}

function validUserName(userName){
    var token=localStorage.getItem('token');
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
    var query=`$filter=UserName eq '${userName}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                if(data.value.length === 1)
                {
                    return true;
                }
                return false;
            }
            return false;
        }).catch(error => {
            return error;
        })
}

function validEmail(email){
    var token=localStorage.getItem('token');
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
    var query=`$filter=Email eq '${email}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                if(data.value.length === 1)
                {
                    return true;
                }
            }
            return false;
        }).catch(error => {
            return error;
        })
}

function sessionExpired() {
    localStorage.clear();
    window.location.pathname = '/home';
}

function getUser(email){
    var token=localStorage.getItem('token');
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
    var query=`$filter=Email eq '${email}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                if(data.value.length === 1)
                {
                    var rec={
                        name:data.value[0].Title,
                        email:data.value[0].Email,
                        address:data.value[0].Address,
                        mobile:data.value[0].Mobile,
                        userName:data.value[0].UserName,
                        drivingLicence:data.value[0].DrivingLicence,
                        id:data.value[0].ID
                    }
                    return rec;
                }
            }
            return Promise.reject();
        }).catch(error => {
            return error;
        })
}

async function getRequestDigest(){
    var token=localStorage.getItem('token');

    return fetch("https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/contextinfo",{
        method:"POST",
		headers:{
            Accept:"application/json;odata=nometadata",
            Authorization:`Bearer ${token}`
        },
    }).then(async res=>{
        localStorage.setItem('digest',JSON.stringify(await res.json()));
    })
}

async function getToken(){
    return fetch('https://cors-anywhere.herokuapp.com/https://accounts.accesscontrol.windows.net/4e847bc8-615a-4c91-a8ca-8cff7106481e/tokens/OAuth/2',{
        method:"POST",
        headers:{
            Accept:"application/json;odata=verbose",
            "Content-Type":"application/x-www-form-urlencoded"
        },

        body : `grant_type=client_credentials&client_id=766f911b-5b3c-4ea4-a67d-564080155d94@4e847bc8-615a-4c91-a8ca-8cff7106481e&client_secret=UJQhDYryjeR36gTMq2Dkc3zQ39e9CPaPk8xVk9gFPw8=&resource=00000003-0000-0ff1-ce00-000000000000/chandraprakashtiwariv.sharepoint.com@4e847bc8-615a-4c91-a8ca-8cff7106481e`
    }).then(a => a.json()).then(a => localStorage.setItem('token',a.access_token)).catch(e => console.log(e))
    
}

function addNewUser(userData){
   
    getToken();
    getRequestDigest();
    var digest=localStorage.getItem('digest');

    var token=localStorage.getItem('token');
    var data1 = {
        Title:userData.name,
        Mobile: userData.mobile,
        Address: userData.address,
        Email: userData.email,
        Password: userData.password,
        UserName: userData.userName,
        DrivingLicence: userData.drivingLicence
    }

    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items";

        return fetch(url,{
			method:"POST",
			headers:{
				Accept:"application/json;odata=verbose",
                "x-RequestDigest":digest.FormDigestValue,
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
			},
			body:JSON.stringify(data1)	
		}).then(async r=>{
            if(r.status===201){
                return Promise.resolve("Ok");
            }

            return Promise.reject("Reject");
        });
}

function login(loginDetails)
{
    getToken();
    getRequestDigest();
    var token=localStorage.getItem('token');

    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
    var query=`$filter=((UserName eq '${loginDetails.userName}') or (Email eq '${loginDetails.userName}'))and(Password eq '${loginDetails.password}')`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
        if (response.status === 200) {
            const data = await response.json();
            if(data.value.length === 1){
                var rec={
                    name:data.value[0].Title,
                    email:data.value[0].Email,
                    address:data.value[0].Address,
                    mobile:data.value[0].Mobile,
                    userName:data.value[0].UserName,
                    drivingLicence:data.value[0].DrivingLicence,
                    id:data.value[0].ID
                }
                localStorage.setItem('currentUser', JSON.stringify(rec));
                return Promise.resolve("ok");
            }
            else{
                return Promise.reject("wrong");
            }
        }
        else if (response.status === 204) 
            return Promise.reject("wrong");

        else if (response.status === 500) {
            return Promise.reject("servererror");
        }

        return Promise.reject();
    }).catch(error => {
        return error;
    })
}

export default UserService;