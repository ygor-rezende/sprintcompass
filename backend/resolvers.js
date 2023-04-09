import * as cfg from "./config.js";
import * as dbRtns from "./db_routines.js";
const resolvers = {
  projects: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.projectCollection, {}, {});
  },
  teamMembers: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.teamCollection, {}, {});
  },
  stories: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.backlogCollection, {}, {});
  },
  addProject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let project = {
      teamName: args.teamName,
      productName: args.productName,
      startDate: args.startDate,
      numHoursStoryPoint: args.numHoursStoryPoint,
      estimatedNumStoryPoints: args.estimatedNumStoryPoints,
      estimatedCost: args.estimatedCost,
    };
    let results = await dbRtns.addOne(db, cfg.projectCollection, project);
    return results.acknowledged ? project : null;
  },
  addBacklog: async (args) => {
    let db = await dbRtns.getDBInstance();
    let backlog = {
      userStoryPortion: args.userStoryPortion,
      priority: args.priority,
      relativeEstimate: args.relativeEstimate,
      estimatedCost: args.estimatedCost,
    };
    let results = await dbRtns.addOne(db, cfg.backlogCollection, backlog);
    return results.acknowledged ? backlog : null;
  },
  addSprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let sprint = {
      name: args.name,
      status: args.status,
      items: args.items,
    };
    let results = await dbRtns.addOne(db, cfg.sprintCollection, sprint);
    return results.acknowledged ? sprint : null;
  },
  addMember: async (args) => {
    let db = await dbRtns.getDBInstance();
    let teamMember = {
      firstName: args.firstName,
      lastName: args.lastName,
    };
    let results = await dbRtns.addOne(db, cfg.teamCollection, teamMember);
    return results.acknowledged ? teamMember : null;
  },
  addSubtask: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = {
      teamName: args.teamName,
      subtaskName: args.subtaskName,
      hoursWorked: args.hoursWorked,
      hoursToComplete: args.hoursToComplete,
      workInfo: args.workInfo,
      teamMember: args.teamMember,
    };
    let results = await dbRtns.addOne(db, cfg.subtaskCollection, subtask);
    return results.acknowledged ? subtask : null;
  },
};

export { resolvers };
