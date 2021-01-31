import UserService from "./UserService";

export const CarService = {
  addNewCar,
  getCars,
  deleteCar,
  hasNumber,
};

// function addNewCar(carDetails) {
//     return fetch(`/api/car/create?ownerid=${UserService.currentUser.id}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${UserService.currentUser.userToken}`,
//         },
//         body: JSON.stringify({
//             number: carDetails.number,
//             model: carDetails.model,
//             noofSeat: parseInt(carDetails.noofSeats)
//         }),
//     }).then(async response => {
//         if (response.status === 200) {
//             return Promise.resolve('Ok')
//         }
//         else if (response === 401) {
//             UserService.sessionExpired();
//             return Promise.reject();
//         }
//         else if (response.status === 404) {
//             return Promise.reject('not found');
//         }
//         else if (response.status === 500) {
//             return Promise.reject('Server error');
//         }
//         else
//             return Promise.reject();
//     }).catch(error => {
//         return error;
//     })
// }

// function getCars() {
//     return fetch(`/api/car/getbyownerid?ownerId=${UserService.currentUser.id}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             Authorization: `Bearer ${UserService.currentUser.userToken}`
//         }
//     }).then(async response => {
//         if (response.status === 200) {
//             const data = await response.json();
//             return Promise.resolve(data);
//         }
//         else if (response.status === 401) {
//             UserService.sessionExpired();
//             return Promise.reject();
//         }
//         else if (response.status === 500) {
//             return Promise.reject('serverError');
//         }

//         else
//             return Promise.reject();
//     }).catch(error => {
//         return error;
//     })
// }

function getCars() {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Cars')/items?";
  var query = `$filter=OwnerId eq ${UserService.currentUser.id}'`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${UserService.getCookie("access")}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        return Promise.resolve(data);
      }
      return false;
    })
    .catch((error) => {
      return error;
    });
}

function addNewCar(carDetails) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Cars')/items";
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json;odata=verbose",
      "x-RequestDigest": UserService.getCookie("digest"),
      "Content-Type": "application/json",
      Authorization: `Bearer ${UserService.getCookie("access")}`,
    },
    body: JSON.stringify({
      Number: carDetails.number,
      Model: carDetails.model,
      NoofSeats: parseInt(carDetails.noofSeats),
      OwnerIdId: UserService.currentUser.id,
    }),
  }).then(async (r) => {
    if (r.status === 201) {
      return Promise.resolve("Ok");
    }
    return Promise.reject("Reject");
  });
}

// function deleteCar(id) {
//     return fetch(`/api/car/delete?id=${id}`, {
//         method: 'DELETE',
//         headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         Authorization: `Bearer ${UserService.currentUser.userToken}`
//         }
//     }).then(async response => {
//         if (response.status === 200) {
//             return Promise.resolve('ok');
//         }
//         else if (response.status === 401) {
//             UserService.sessionExpired();
//             return Promise.reject();
//         }
//         else if (response.status === 500) {
//             return Promise.reject('serverError');
//         }
//         else
//             return Promise.reject();
//     }).catch(error => {
//         return ;
//     })
// }

function deleteCar(id) {
  var url = `https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Cars')/items(${id})`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${UserService.getCookie("access")}`,
      "x-RequestDigest": UserService.getCookie("digest"),
      "If-Match": "*",
      "X-HTTP-Method": "DELETE",
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        return Promise.resolve("Ok");
      }
      return Promise.resolve();
    })
    .catch((error) => {
      return error;
    });
}

function hasNumber(number) {
  var url =
    "https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Cars')/items?";
  var query = `$filter=Number eq '${number}'`;

  return fetch(url + query, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "application/json",
      Authorization: `Bearer ${UserService.getCookie("access")}`,
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

export default CarService;
