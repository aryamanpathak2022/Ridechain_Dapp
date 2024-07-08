// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedCab {
    struct Ride {
        uint256 id;
        address user;
        address driver;
        string pickupLocation;
        string dropoffLocation;
        bool isCompleted;
    }

    uint256 public rideCounter;
    mapping(uint256 => Ride) public rides;

    event RideReceived(uint256 indexed rideId, address indexed driver);
    event RideCompleted(uint256 indexed rideId, address indexed user, address indexed driver);

    constructor() {
        rideCounter = 0;
    }

    function requestRide(string memory pickupLocation, string memory dropoffLocation) public returns (uint256) {
        rideCounter++;
        rides[rideCounter] = Ride({   
            id: rideCounter,
            user: msg.sender,
            driver: address(0),
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
            isCompleted: false
        });

        return rideCounter;
    }

    function receiveRide(uint256 rideId) public {
        Ride storage ride = rides[rideId];
        require(ride.driver == address(0), "Ride already taken");
        require(ride.user != address(0), "Invalid ride ID");

        ride.driver = msg.sender;

        emit RideReceived(rideId, msg.sender);
    }

    function completeRide(uint256 rideId) public {
        Ride storage ride = rides[rideId];
        require(ride.user == msg.sender || ride.driver == msg.sender, "Only ride participants can complete the ride");
        require(!ride.isCompleted, "Ride already completed");

        ride.isCompleted = true;

        emit RideCompleted(rideId, ride.user, ride.driver);
    }

    function getRide(uint256 rideId) public view returns (Ride memory) {
        return rides[rideId];
    }
}
