import UserService from './UserService';
import { CityService } from './CityService';

export const RideService = {
    allRides,
    addRides,
    updateRide,
    getRideById,
    getAllBookers,
    carAvailableForRide
}

function allRides() {
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items?";
    var query=`$filter=OwnerId eq ${UserService.currentUser.id}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                return Promise.resolve(data.value);
            }
            return false;
        }).catch(error => {
            return error;
        })
}

function carAvailableForRide(date, time) {
    var carId = JSON.parse(sessionStorage.getItem('carDetails')).ID;
    var token=localStorage.getItem('token');
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items?";
    var query=`$filter=CarId eq '${carId}' and TravelDate eq '${date}' and Time eq ${time}`;

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
                    return false;
                }
            }
            return true;
        }).catch(error => {
            return error;
        })
}

function addRides(viaPointProps) {
    var carDetails = JSON.parse(sessionStorage.getItem('carDetails'));
    var rideDetails = JSON.parse(sessionStorage.getItem('rideDetails'))
    if (carDetails === null || rideDetails === null)
        return;
        var ViaPoints = []; 

        for (var i = 0; i < viaPointProps.cities.length + 2; i++) {
            if (i === 0) {
                ViaPoints.push(CityService.getCityDetails(rideDetails.from).ID)
            }
    
            else if (i === viaPointProps.cities.length + 1) {
                ViaPoints.push(CityService.getCityDetails(rideDetails.to).ID)
            }
    
            else {
                var city = CityService.getCityDetails(viaPointProps.cities[i - 1].city);
                if (city !== null)
                ViaPoints.push(city.ID)
            }
        }
    
        for (let i = 0; i < ViaPoints.length - 1; i++) {
            for (let j = 1; j < ViaPoints.length; j++) {
                if (ViaPoints[i] === ViaPoints[j]) {
                    if (i !== j) {
                        return new Promise(function (resolve, reject) {
                            resolve('duplicate');
                        });
                    }
                }
            }
        }

    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items";
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    return fetch(url,{
		method:"POST",
		headers:{
			Accept:"application/json;odata=verbose",
            "x-RequestDigest":digest.FormDigestValue,
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
		},
		body: JSON.stringify({
            ToId: ViaPoints[ViaPoints.length-1],
            FromId:ViaPoints[0],
            TravelDate: rideDetails.date.toString(),
            AvailableSeats: parseInt(viaPointProps.availableSeats),
            RatePerKM: parseInt(viaPointProps.ratePerKM),
            ViaPointsId: ViaPoints,
            OwnerId: carDetails.OwnerIdId,
            CarId: carDetails.ID,
            Time: rideDetails.time
        }),	
	}).then(async r=>{
        if(r.status===201){
            return Promise.resolve("Ok");
        }
        return Promise.reject("Reject");
    }).catch(r=>console.log(r))

}

function updateRide(viaPointProps) {
    var carDetails = JSON.parse(sessionStorage.getItem('carDetails'));
    var rideDetails = JSON.parse(sessionStorage.getItem('rideDetails'))
    var rideId = sessionStorage.getItem('rideId');
    if (carDetails === null || rideDetails === null)
        return;
    var ViaPoints = [];
    for (var i = 0; i < viaPointProps.cities.length + 2; i++) {
        if (i === 0) {
            ViaPoints.push(CityService.getCityDetails(rideDetails.from))
        }

        else if (i === viaPointProps.cities.length + 1) {

            ViaPoints.push(CityService.getCityDetails(rideDetails.to))
        }

        else {
            var city = CityService.getCityDetails(viaPointProps.cities[i - 1].city);
            if (city !== null)
                ViaPoints.push(city)
        }
    }

    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var url=`https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items(${rideId})`;                
    return fetch(url, {
        method:"POST",
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`,
            "x-RequestDigest":digest.FormDigestValue,
            "If-Match":"*",
            "X-HTTP-Method":"MERGE"
        },
        body:JSON.stringify({
            From: rideDetails.from,
            To: rideDetails.to,
            TravelDate: rideDetails.date.toString(),
            AvailableSeats: parseInt(viaPointProps.availableSeats),
            RatePerKM: parseInt(viaPointProps.ratePerKM),
            ViaPoints: ViaPoints,
            OwnerId: carDetails.ownerId,
            CarId: carDetails.id,
            time: rideDetails.time
        })
    }).then(async response => {
        if (response.status === 204) {
            sessionStorage.removeItem('carDetails');
            sessionStorage.removeItem('rideDetails');
            return Promise.resolve("Ok");
        }
        else if (response === 401) {
            UserService.sessionExpired();
            window.location.pathname = '/login';
            return Promise.reject();
        }
        else if (response.status === 500) {
            return Promise.reject('serverError');
        }
    }).catch(error => {
        return error;
    }) 
}

function getRideById(id) {
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items?";
    var query=`$filter=ID eq ${id}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
        if (response.status === 200) {
            const data = await response.json();
            return Promise.resolve(data.value);
        }
        return false;
    }).catch(error => {
        return error;
    })
}

function getAllBookers(id) {
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items?";
    var query=`$filter=RideId eq ${id}'`;

    return fetch(url+query, {
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                return Promise.resolve(data.value);
            }
            return false;
        }).catch(error => {
            return error;
        })
}

export default RideService;