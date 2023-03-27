const schema = `
type Query {
projects: [Project],
teamMembers: [TeamMember],
stories: [Backlog],
sprints: [Sprint]
},
type Project {
teamName: String
productName: String
startDate: String
numHoursStoryPoint: Float
estimatedNumStoryPoints: Float
estimatedCost: Float
},

type Sprint {
    name: String
    status: String
    items: String
},

type Subtask {
teamName: String
subtaskName: String
hoursWorked: Float
hoursToComplete: Float
workInfo: String
teamMember: String
},

type Backlog{
    userStoryPortion: String
    priority: String
    relativeEstimate: Float
    estimatedCost: Float
},

type TeamMember {
    firstName: String
    lastName: String
    },

type Mutation {
    addProject(teamName: String, productName: String, startDate: String, numHoursStoryPoint: Float, estimatedNumStoryPoints: Float, estimatedCost: Float): Project,
    addBacklog(userStoryPortion: String, priority: String, relativeEstimate: Float, estimatedCost: Float): Backlog,
    addSprint(name: String, status: String, items: String): Sprint,
    addMember(firstName: String, lastName: String): TeamMember,
    addSubtask(teamName: String, subtaskName: String, hoursWorked: Float hoursToComplete: Float workInfo: String teamMember: String): Subtask,
    },
`;
export { schema };
