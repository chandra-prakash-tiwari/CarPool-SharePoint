import UserService from './UserService'
import {CityService} from './CityService'

export const BookingService = {
    searchRide,
    myBookings,
    addBookings,
    cancelBooking,
    bookingResponse,
    getByRideId
};

function addBookings(booking, noofSeats) {
    var bookingSearch = JSON.parse(sessionStorage.getItem('bookingSearch'));
    var data = {
        RideId: booking.ID,
        From: bookingSearch.from,
        To: bookingSearch.to,
        TravelDate: bookingSearch.date,
        NoofSeats: noofSeats,
        Time: booking.Time,
        BookerId: UserService.currentUser.id
    }

    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items";
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
		body: JSON.stringify(data),	
	}).then(async r=>{
        if(r.status===201){
            return Promise.resolve("Ok");
        }
        return Promise.reject("Reject");
    });
}

function getByRideId(rideId, bookerId) {
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items?";
    var query=`$filter=(RideId eq '${rideId}') and (BookerId eq '${bookerId}') and (Status eq '3')`;

    return fetch(url+query, {
        method:"GET",
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

function cancelBooking(id) {
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var url=`https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items(${id})`;                
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
            Status:5
        })
    }).then(async response => {
        if (response.status === 204) {
            return Promise.resolve("Ok");
        }
        return Promise.resolve();
    }).catch(error => {
        return error;
    })  
}

function searchRide(bookingSearch){
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items?";
    var query=`$filter=(ViaPointsId eq '${CityService.getValidCity(bookingSearch.from)[0].ID}') and (ViaPointsId eq '${CityService.getValidCity(bookingSearch.to)[0].ID}') and (TravelDate eq '${bookingSearch.date}')`;

    return fetch(url+query, {
        method:"GET",
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        },
    }).then(async response => {
        if (response.status === 200) {
            const data = await response.json();
            for(var i=0;i<data.value.length;i++){
                var data1=[];
                if(data.value[i].ViaPointsId.indexOf(CityService.getValidCity(bookingSearch.to)[0].ID) > data.value[i].ViaPointsId.indexOf(CityService.getValidCity(bookingSearch.from)[0].ID)){
                    data1.push(data.value[i]);
                }
            }
            return Promise.resolve(data1);
        }
        return false;
    }).catch(error => {
        return error;
    })
}

function myBookings(){
    var token=localStorage.getItem('token');    
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items?";
    var query=`$filter=(Booker eq '${UserService.currentUser.id}')`;

    return fetch(url+query, {
        method:"GET",
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

function bookingResponse(rideId, bookingId, status) {
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    if(status === 1){ 
        var url="https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items?";
        var query=`$filter=(Id eq '${rideId}')`;
    
        return fetch(url+query, {
            method:"GET",
            headers: { 
                Accept:'application/json;odata=nometadata',
                'Content-Type': 'application/json' ,
                Authorization:`Bearer ${token}`
            },
        }).then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                let AvailableSeat=data.value[0].AvailableSeats;
                if(data.value[0].AvailableSeats>0){  
                    var url1=`https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Rides')/items(${rideId})`;                
                    return fetch(url1, {
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
                            AvailableSeats:( AvailableSeat - 1)
                        })
                    }).then(async response => { 
                        var url2=`https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items(${bookingId})`;                
                        return fetch(url2, {
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
                                Status:1
                            })
                        }).then(async response => {
                            if (response.status === 204) {
                                return Promise.resolve(1);
                            }
                            return false;
                        }).catch(error => {
                            return error;
                        })
                    }).catch(error => {
                        return error;
                    })
                }

                else{
                   return RejectBooking(bookingId);
                }
            }
            return Promise.reject(3);
        }).catch(error => {
            return error;
        })
    }

    else{
        return RejectBooking(bookingId);
    }
       
}

function RejectBooking(bookingId){
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var url=`https://chandraprakashtiwariv.sharepoint.com/sites/carpool/_api/lists/getbytitle('Bookings')/items(${bookingId})`;                
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
            Status:2
        })
    }).then(async response => {
        if (response.status === 204) {
            return Promise.resolve(2);
        }
        return Promise.resolve(3);
    }).catch(error => {
        return error;
    })   
}

export default BookingService;