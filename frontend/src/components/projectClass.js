export default class Project {
  constructor(
    teamName,
    productName,
    startDate,
    numHoursStoryPoint,
    estimatedNumStoryPoints,
    estimatedCost
  ) {
    this.teamName = teamName;
    this.productName = productName;
    this.startDate = startDate;
    this.numHoursStoryPoint = numHoursStoryPoint;
    this.estimatedNumStoryPoints = estimatedNumStoryPoints;
    this.estimatedCost = estimatedCost;
  }
}
