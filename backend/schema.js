const schema = `
type Query {
projects: [Project],
},
type Project {
teamName: String
productName: String
startDate: String
numHoursStoryPoint: Float
estimatedNumStoryPoints: Float
estimatedCost: Float
},

type Mutation {
    addProject(teamName: String, productName: String, startDate: String, numHoursStoryPoint: Float, estimatedNumStoryPoints: Float, estimatedCost: Float): Project
    }
`;
export { schema };
