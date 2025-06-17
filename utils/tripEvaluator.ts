// Trip evaluation logic based on user criteria

export interface TripData {
  fare: number;
  pickupDistance: number;
  pickupTime: number;
  totalDistance: number;
  totalTime: number;
  rating?: number;
  isShare?: boolean;
}

export interface TripCriteria {
  minFare: number;
  maxPickupDistance: number;
  maxPickupTime: number;
  minRating: number;
  acceptShare: boolean;
}

export type TripDecision = 'green' | 'yellow' | 'red';

export const evaluateTrip = (trip: TripData, criteria: TripCriteria): TripDecision => {
  // Check if trip is a shared ride but user doesn't want shared rides
  if (trip.isShare && !criteria.acceptShare) {
    return 'red';
  }

  // Calculate score based on criteria (0-100)
  let score = 0;
  
  // Fare score (0-40 points)
  const fareRatio = trip.fare / criteria.minFare;
  if (fareRatio >= 1.5) {
    score += 40; // Excellent fare
  } else if (fareRatio >= 1.0) {
    score += 30; // Good fare
  } else if (fareRatio >= 0.8) {
    score += 15; // Below minimum but close
  }
  
  // Pickup distance score (0-30 points)
  const distanceRatio = criteria.maxPickupDistance / trip.pickupDistance;
  if (distanceRatio >= 2.0) {
    score += 30; // Very close pickup
  } else if (distanceRatio >= 1.0) {
    score += 20; // Within max distance
  } else if (distanceRatio >= 0.8) {
    score += 10; // Slightly over max distance
  }
  
  // Pickup time score (0-20 points)
  const timeRatio = criteria.maxPickupTime / trip.pickupTime;
  if (timeRatio >= 2.0) {
    score += 20; // Very quick pickup
  } else if (timeRatio >= 1.0) {
    score += 15; // Within max time
  } else if (timeRatio >= 0.8) {
    score += 5; // Slightly over max time
  }
  
  // Rating score (0-10 points)
  if (trip.rating) {
    if (trip.rating >= criteria.minRating) {
      score += 10;
    } else if (trip.rating >= criteria.minRating - 0.3) {
      score += 5;
    }
  } else {
    // If no rating provided, give benefit of doubt
    score += 5;
  }
  
  // Determine decision based on score
  if (score >= 70) {
    return 'green';
  } else if (score >= 50) {
    return 'yellow';
  } else {
    return 'red';
  }
};

// Calculate estimated earnings per hour
export const calculateEarningsPerHour = (fare: number, totalTime: number): number => {
  // totalTime is in minutes, convert to hours
  const hours = totalTime / 60;
  return fare / hours;
};

// Calculate earnings per mile
export const calculateEarningsPerMile = (fare: number, totalDistance: number): number => {
  return fare / totalDistance;
};