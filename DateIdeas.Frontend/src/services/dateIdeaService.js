import * as api from '../api/dateIdeaApiService';
import { convertEmptyStringsToNull } from '../utils/stringUtils';

export const addIdea = async (newIdea, setIdeas) => {
  const tagIds = newIdea.tags.map((tag) => tag.id);
  const newIdeaToSubmit = { ...newIdea, tagIds };
  delete newIdeaToSubmit.tags;
  convertEmptyStringsToNull(newIdeaToSubmit);
  const createdIdea = await api.createDateIdea(newIdeaToSubmit);
  console.log('Adding Idea' + createdIdea);
};

export const editIdea = async (updatedIdea, setIdeas) => {
  const tagIds = updatedIdea.tags.map((tag) => tag.id);
  const updatedIdeaToSubmit = { ...updatedIdea, tagIds };
  delete updatedIdeaToSubmit.tags;
  convertEmptyStringsToNull(updatedIdeaToSubmit);
  await api.updateDateIdea(updatedIdeaToSubmit.id, updatedIdeaToSubmit);
};

export const deleteIdea = async (id, setIdeas) => {
  await api.deleteDateIdea(id);
};

export const addNewTag = async (newTag, tags, setTags) => {
    if (!tags.includes(newTag)) {
      newTag = await api.createTag({ name: newTag });
    }
  };