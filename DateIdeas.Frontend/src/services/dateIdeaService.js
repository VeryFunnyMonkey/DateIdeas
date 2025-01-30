import * as api from '../api/dateIdeaApiService';
import { convertEmptyStringsToNull } from '../utils/stringUtils';

export const getIdeas = async (ideas) => {
  ideas = await api.getDateIdeas();
  ideas.forEach((idea) => {
    if (idea.scheduledDate) {
    idea.scheduledDate = new Date(idea.scheduledDate+'Z'); // this is to convert the date from UTC to local time, need to add the Z otherwise it doesnt work..
    console.log(idea);
    }
  });
  return ideas;
}

export const addIdea = async (newIdea, setIdeas) => {
  const tagIds = newIdea.tags.map((tag) => tag.id);
  const newIdeaToSubmit = { ...newIdea, tagIds };
  delete newIdeaToSubmit.tags;
  convertEmptyStringsToNull(newIdeaToSubmit);
  if(newIdeaToSubmit.scheduledDate)
    newIdeaToSubmit.scheduledDate = new Date(newIdeaToSubmit.scheduledDate).toISOString(); // this is to convert the date from local time to UTC
  const createdIdea = await api.createDateIdea(newIdeaToSubmit);
  console.log('Adding Idea' + createdIdea);
};

export const editIdea = async (updatedIdea, setIdeas) => {
  const tagIds = updatedIdea.tags.map((tag) => tag.id);
  const updatedIdeaToSubmit = { ...updatedIdea, tagIds };
  delete updatedIdeaToSubmit.tags;
  convertEmptyStringsToNull(updatedIdeaToSubmit);
  if(updatedIdea.scheduledDate)
    updatedIdea.scheduledDate = new Date(updatedIdea.scheduledDate).toISOString(); // this is to convert the date from local time to UTC
  await api.updateDateIdea(updatedIdeaToSubmit.id, updatedIdeaToSubmit);
};

export const deleteIdea = async (id, setIdeas) => {
  await api.deleteDateIdea(id);
};

export const getTags = async (tags) => {
  tags = await api.getTags();
  return tags;
};

export const addNewTag = async (newTag, tags, setTags) => {
    if (!tags.includes(newTag)) {
      const addedTag = await api.createTag({ name: newTag });
      return addedTag;
    }
  };

  export const deleteTag = async (id) => {
    await api.deleteTag(id);
  };