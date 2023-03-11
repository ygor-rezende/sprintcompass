import UserStory from "../components/userStoryClass.js";
import Project from "../components/projectClass.js";
import Sprint from "../components/sprintClass.js";

const test = () => {
  let user1 = new UserStory("some desc", 1, 4.5, 500);
  let user2 = new UserStory("Story2", 2, 5, 430.2);
  let project1 = new Project("team1", "produc1", "14-08-93", 3, 4, 340);
  let sprint1 = new Sprint("sprint1", "Open");
  console.log(project1);
  sprint1.addUserStory(user1);
  sprint1.addUserStory(user2);
  console.log(sprint1.userStories);
  sprint1.removeUserStory(user1);
  console.log(sprint1.userStories);
  //console.log(user1);
};

test();
