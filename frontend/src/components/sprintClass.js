export default class Sprint {
  constructor(sprintName, status) {
    this.sprintName = sprintName;
    this.status = status;
    this.userStories = [];
  }

  addUserStory(userStory) {
    this.userStories.push(userStory);
  }

  removeUserStory(userStory) {
    this.userStories.filter((element) => {
      return element !== userStory;
    });
  }
}
