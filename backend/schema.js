const schema = `
type Query {
projects: [Project],
teamMembers: [TeamMember]
},
type Project {
teamName: String
productName: String
startDate: String
numHoursStoryPoint: Float
estimatedNumStoryPoints: Float
estimatedCost: Float
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
    addMember(firstName: String, lastName: String): TeamMember,
    },
`;
export { schema };
