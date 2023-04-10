export default class Subtask {
    constructor(
      teamName,
      story,
      subtaskName,
      hoursWorked,
      hoursToComplete,
      workInfo,
      teamMember
    ) {
      this.teamName = teamName;
      this.story = story;
      this.subtaskName = subtaskName;
      this.hoursWorked = hoursWorked;
      this.hoursToComplete = hoursToComplete;
      this.workInfo = workInfo;
      this.teamMember = teamMember;
    }
  }
  