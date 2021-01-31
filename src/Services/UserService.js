const getCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

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
  initialStep,
  getCookie,
  currentUser: getCurrentUser,
};

function logout() {
  localStorage.removeItem("currentUser");
}

function validUserName(userName) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
  var query = `$filter=UserName eq '${btoa(userName)}'`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (data.value.length === 1) {
          return true;
        }
        return false;
      }
      return false;
    })
    .catch((error) => {
      return error;
    });
}

function validEmail(email) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
  var query = `$filter=Email eq '${btoa(email)}'`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (data.value.length === 1) {
          return true;
        }
      }
      return false;
    })
    .catch((error) => {
      return error;
    });
}

function sessionExpired() {
  localStorage.clear();
  window.location.pathname = "/home";
}

function getUser(email) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
  var query = `$filter=Email eq '${btoa(email)}'`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (data.value.length === 1) {
          var rec = {
            name: atob(data.value[0].Title),
            email: atob(data.value[0].Email),
            address: atob(data.value[0].Address),
            mobile: atob(data.value[0].Mobile),
            userName: atob(data.value[0].UserName),
            drivingLicence: atob(data.value[0].DrivingLicence),
            id: data.value[0].ID,
          };
          return rec;
        }
      }
      return Promise.reject();
    })
    .catch((error) => {
      return error;
    });
}

async function getRequestDigest() {
  return fetch(
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/contextinfo",
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=nometadata",
        Authorization: `Bearer ${getCookie("access")}`,
      },
    }
  ).then(async (res) => {
    var data = await res.json();
    document.cookie = `digest=${data.FormDigestValue}`;
  });
}

async function getToken() {
  return fetch(
    "https://cors-anywhere.herokuapp.com/https://accounts.accesscontrol.windows.net/4e847bc8-615a-4c91-a8ca-8cff7106481e/tokens/OAuth/2",
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: `grant_type=client_credentials&client_id=766f911b-5b3c-4ea4-a67d-564080155d94@4e847bc8-615a-4c91-a8ca-8cff7106481e&client_secret=UJQhDYryjeR36gTMq2Dkc3zQ39e9CPaPk8xVk9gFPw8=&resource=00000003-0000-0ff1-ce00-000000000000/chandraprakashtiwariv.sharepoint.com@4e847bc8-615a-4c91-a8ca-8cff7106481e`,
    }
  )
    .then((a) => a.json())
    .then((a) => (document.cookie = `access='${a.access_token}'`))
    .catch();
}

function addNewUser(userData) {
  var digest = localStorage.getItem("digest");

  var token = document.cookie;
  var data1 = {
    Title: btoa(userData.name),
    Mobile: btoa(userData.mobile),
    Address: btoa(userData.address),
    Email: btoa(userData.email),
    Password: btoa(userData.password),
    UserName: btoa(userData.userName),
    DrivingLicence: btoa(userData.drivingLicence),
  };

  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items";

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json;odata=verbose",
      "x-RequestDigest": digest.FormDigestValue,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data1),
  }).then(async (r) => {
    if (r.status === 201) {
      return Promise.resolve("Ok");
    }

    return Promise.reject("Reject");
  });
}

function login(loginDetails) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('user')/items?";
  var query = `$filter=((UserName eq '${btoa(
    loginDetails.userName
  )}') or (Email eq '${btoa(loginDetails.userName)}'))and(Password eq '${btoa(
    loginDetails.password
  )}')`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (data.value.length === 1) {
          var rec = {
            name: atob(data.value[0].Title),
            email: atob(data.value[0].Email),
            address: atob(data.value[0].Address),
            mobile: atob(data.value[0].Mobile),
            userName: atob(data.value[0].UserName),
            drivingLicence: atob(data.value[0].DrivingLicence),
            id: data.value[0].ID,
          };
          localStorage.setItem("currentUser", JSON.stringify(rec));
          return Promise.resolve("ok");
        } else {
          return Promise.reject("wrong");
        }
      } else if (response.status === 204) return Promise.reject("wrong");
      else if (response.status === 500) {
        return Promise.reject("servererror");
      }

      return Promise.reject();
    })
    .catch((error) => {
      return error;
    });
}

function initialStep() {
  getToken();
  getRequestDigest();
}

function getCookie(cookiesName) {
  var name = cookiesName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length + 1, c.length - 1);
    }
  }
  return "";
}

export default UserService;
