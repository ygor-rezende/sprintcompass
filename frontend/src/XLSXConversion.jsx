import * as XLSX from 'xlsx';
import * as groupBy from 'group-by-with-sum'
class XLSXConversion {
  constructor(subtasks) {
    this.subtasks = subtasks;
  }

  generateWorkbook(teamName) {
    const filteredSubtasks = this.subtasks.filter(subtask => subtask.teamName === teamName);

    //Sum hours worked by userstory and by team member
    const storiesByMember = groupBy(filteredSubtasks,'priority,userStory,teamMember','actualHours');

    const worksheet = XLSX.utils.json_to_sheet(storiesByMember);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subtasks');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  }

  generateSprintSumaryReport(teamName) {
    const filteredSubtasks = this.subtasks.filter(subtask => subtask.teamName === teamName);

    //Sum hours worked by userstory and by user story
    const hoursByStory = groupBy(filteredSubtasks,'userStory','actualHours,hoursToComplete');

    //calculate the percentage of hours completed
    //FORMULA: Actual hours to date / (actual hours to date + any re-estimated hours to complete).
    // For example, if the Actuals hours is 8, and the reestimate
    //is 2 hours, then is would be 8/(8+2) = .8 or 80%.
    const percentageCompleted = hoursByStory.map(story => ({
      userStory: story.userStory, 
      percentageComplete: `${(story.actualHours / (story.actualHours + story.hoursToComplete)).toFixed(2)*100}%`,
      actualHoursWorked: story.actualHours,
      hoursToComplete: story.hoursToComplete,
    }));

        
    

    const worksheet = XLSX.utils.json_to_sheet(percentageCompleted);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subtasks');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  }
}

export default XLSXConversion;
