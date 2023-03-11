import UserStory from "../components/userStoryClass.js";
import Project from "../components/projectClass.js";

const test = () => {
  let user1 = new UserStory("some desc", 1, 4.5, 500);
  let project1 = new Project("team1", "produc1", "14-08-93", 3, 4, 340);
  console.log(user1);
  console.log(project1);
};

test();
