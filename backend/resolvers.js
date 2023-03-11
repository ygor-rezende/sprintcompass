import * as cfg from "./config.js";
import * as dbRtns from "./db_routines.js";
const resolvers = {
  projects: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.projectCollection, {}, {});
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
};

export { resolvers };
