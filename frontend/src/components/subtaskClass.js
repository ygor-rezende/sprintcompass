export default class Subtask {
    constructor(
      teamName,
      subtaskName,
      hoursWorked,
      hoursToComplete,
      workInfo,
      teamMember
    ) {
      this.teamName = teamName;
      this.subtaskName = subtaskName;
      this.hoursWorked = hoursWorked;
      this.hoursToComplete = hoursToComplete;
      this.workInfo = workInfo;
      this.teamMember = teamMember;
    }
  }
  