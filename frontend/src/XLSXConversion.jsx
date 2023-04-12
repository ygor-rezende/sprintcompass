import * as XLSX from "xlsx";
import * as groupBy from "group-by-with-sum";
class XLSXConversion {
  constructor(subtasks) {
    this.subtasks = subtasks;
  }

  generateWorkbook(teamName) {
    const filteredSubtasks = this.subtasks.filter(
      (subtask) => subtask.teamName === teamName
    );

    //Sum hours worked by userstory and by team member
    const storiesByMember = groupBy(
      filteredSubtasks,
      "priority,userStory,teamMember",
      "actualHours"
    );

    const worksheet = XLSX.utils.json_to_sheet([], {
      header: [`Project Team Name: ${teamName}`],
    });

    XLSX.utils.sheet_add_json(worksheet, [], {
      header: ["Priority", "User Stories", "Team Member", "Actual Hours"],
      origin: "A2",
    });

    XLSX.utils.sheet_add_json(worksheet, storiesByMember, {
      skipHeader: true,
      origin: "A3",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subtasks");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return buffer;
  }

  generateSprintSumaryReport(teamName) {
    const filteredSubtasks = this.subtasks.filter(
      (subtask) => subtask.teamName === teamName
    );

    //Sum hours worked by userstory and by user story
    const hoursByStory = groupBy(
      filteredSubtasks,
      "userStory",
      "actualHours,hoursToComplete"
    );

    //calculate the percentage of hours completed
    //FORMULA: Actual hours to date / (actual hours to date + any re-estimated hours to complete).
    // For example, if the Actuals hours is 8, and the reestimate
    //is 2 hours, then is would be 8/(8+2) = .8 or 80%.
    const percentageCompleted = hoursByStory.map((story) => ({
      userStory: story.userStory,
      teamMember: "",
      percentageComplete: `${
        (
          story.actualHours /
          (story.actualHours + story.hoursToComplete)
        ).toFixed(2) * 100
      }%`,
      actualHoursWorked: story.actualHours,
      hoursToComplete: story.hoursToComplete,
    }));

    let dataToDisplay = [];
    percentageCompleted.forEach((userStories) => {
      dataToDisplay.push(userStories);
      filteredSubtasks.forEach((subtasks) => {
        if (userStories.userStory == subtasks.userStory) {
          dataToDisplay.push({
            userStory: subtasks.subtaskInfo,
            teamMember: subtasks.teamMember,
            percentageComplete: "",
            actualHoursWorked: subtasks.actualHours,
            hoursToComplete: subtasks.hoursToComplete,
          });
        }
      });
    });

    const worksheet = XLSX.utils.json_to_sheet([], {
      header: [`Project Team Name: ${teamName}`],
    });

    XLSX.utils.sheet_add_json(worksheet, [], {
      header: [
        "User Stories/Sub Tasks",
        "",
        "Percentage Complete",
        "Actual Hours Worked",
        "Re-Estimate to Complete",
      ],
      origin: "A2",
    });

    XLSX.utils.sheet_add_json(worksheet, dataToDisplay, {
      skipHeader: true,
      origin: "A3",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subtasks");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return buffer;
  }
}

export default XLSXConversion;
