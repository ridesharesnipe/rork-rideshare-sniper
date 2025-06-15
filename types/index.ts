export type DriverStatus = 'online' | 'offline' | 'busy';

export interface DriverProfile {
  id: string;
  name: string;
  minFare: number;
  maxPickupDistance: number;
  maxDrivingDistance: number;
  isActive: boolean;
  minFarePerMile: number;
  minFarePerMinute: number;
}

export interface TripRequest {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDistance: number; // miles
  dropoffDistance: number; // miles
  estimatedFare: number;
  estimatedDuration: number; // seconds
  passengerRating: number;
  passengerName: string;
  timestamp: number;
  platform: 'uber' | 'lyft' | 'other';
}

export interface TripEvaluation {
  tripId: string;
  isAcceptable: boolean;
  isProfitable: boolean;
  isBorderline: boolean;
  evaluationScore: number;
  recommendation: 'accept' | 'reject' | 'consider';
  estimatedProfit?: number;
  timeEfficiency?: string;
  distanceEfficiency?: string;
}

export interface PermissionStatus {
  sniper: boolean;
}

export interface StatsData {
  totalTrips: number;
  acceptedTrips: number;
  rejectedTrips: number;
  totalEarnings: number;
  averageFare: number;
  topDestination?: string;
  mostProfitableDay?: string;
  mostProfitableTimeOfDay?: string;
}