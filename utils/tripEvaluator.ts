import { TripRequest, DriverProfile, TripEvaluation } from '@/types';

export function evaluateTrip(
  trip: TripRequest,
  profile: DriverProfile
): TripEvaluation {
  // Calculate total distance
  const totalDistance = trip.pickupDistance + trip.dropoffDistance;
  
  // Check if pickup distance is acceptable
  const isPickupDistanceAcceptable = trip.pickupDistance <= profile.maxPickupDistance;
  
  // Check if driving distance is acceptable
  const isDrivingDistanceAcceptable = trip.dropoffDistance <= profile.maxDrivingDistance;
  
  // Check if fare is acceptable
  const isFareAcceptable = trip.estimatedFare >= profile.minFare;
  
  // Calculate evaluation score (0-100)
  let evaluationScore = 0;
  
  // Pickup distance score (0-30)
  // Lower pickup distance = higher score
  const pickupDistanceScore = Math.max(
    0,
    30 * (1 - trip.pickupDistance / (profile.maxPickupDistance * 1.5))
  );
  
  // Driving distance score (0-30)
  // Lower driving distance relative to max = higher score
  const drivingDistanceScore = Math.max(
    0,
    30 * (1 - trip.dropoffDistance / (profile.maxDrivingDistance * 1.5))
  );
  
  // Fare score (0-40)
  // Higher fare = higher score
  const fareScore = Math.min(
    40,
    (trip.estimatedFare / profile.minFare) * 25
  );
  
  // Calculate total score
  evaluationScore = Math.round(
    pickupDistanceScore + drivingDistanceScore + fareScore
  );
  
  // Cap at 100
  evaluationScore = Math.min(evaluationScore, 100);
  
  // Determine if trip is acceptable
  const isAcceptable = 
    isPickupDistanceAcceptable && 
    isDrivingDistanceAcceptable && 
    isFareAcceptable;
  
  // Determine if trip is profitable
  const isProfitable = 
    isFareAcceptable && 
    isPickupDistanceAcceptable &&
    isDrivingDistanceAcceptable;
  
  // Determine if trip is borderline
  const isBorderline = 
    isAcceptable && 
    evaluationScore >= 60 && 
    evaluationScore < 80;
  
  // Determine recommendation
  let recommendation: 'accept' | 'reject' | 'consider';
  
  if (isProfitable && evaluationScore >= 80) {
    recommendation = 'accept';
  } else if (isBorderline) {
    recommendation = 'consider';
  } else {
    recommendation = 'reject';
  }
  
  // Calculate estimated profit
  // In a real app, this would be more sophisticated
  const estimatedProfit = Math.max(0, trip.estimatedFare - (totalDistance * 0.3));
  
  // Calculate time efficiency (dollars per minute)
  const estimatedTimeMinutes = trip.estimatedDuration / 60; // convert seconds to minutes
  const timeEfficiency = estimatedTimeMinutes > 0 
    ? (trip.estimatedFare / estimatedTimeMinutes).toFixed(2)
    : '0.00';
  
  // Calculate distance efficiency (dollars per mile)
  const distanceEfficiency = totalDistance > 0 
    ? (trip.estimatedFare / totalDistance).toFixed(2)
    : '0.00';
  
  return {
    tripId: trip.id,
    isAcceptable,
    isProfitable,
    isBorderline,
    evaluationScore,
    recommendation,
    estimatedProfit,
    timeEfficiency,
    distanceEfficiency
  };
}

// Helper function to determine color based on evaluation
export function getEvaluationColor(evaluation: TripEvaluation): string {
  if (evaluation.recommendation === 'accept') {
    return '#00C853'; // Green
  } else if (evaluation.recommendation === 'consider') {
    return '#FFD600'; // Yellow
  } else {
    return '#FF3D00'; // Red
  }
}

// Helper function to get text feedback based on evaluation
export function getEvaluationFeedback(evaluation: TripEvaluation): string {
  if (evaluation.recommendation === 'accept') {
    return 'This trip meets your criteria and should be profitable.';
  } else if (evaluation.recommendation === 'consider') {
    return 'This trip barely meets your criteria. Consider if it fits your current situation.';
  } else {
    return 'This trip does not meet your criteria and may not be profitable.';
  }
}