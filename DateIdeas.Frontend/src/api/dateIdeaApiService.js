import axios from 'axios';

const API_BASE_URL = '/api';

export const getDateIdeas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dateideas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching date ideas:', error);
    throw error;
  }
};

export const getDateIdea = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dateideas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching date idea with ID ${id}:`, error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const getTag = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tag with ID ${id}:`, error);
    throw error;
  }
};

export const createDateIdea = async (dateIdea) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/dateideas`, dateIdea);
    return response.data;
  } catch (error) {
    console.error('Error creating date idea:', error);
    throw error;
  }
}

export const createTag = async (tag) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tags`, tag);
    return response.data;
  } catch (error) {
    console.error('Error creating date idea:', error);
    throw error;
  }
}

export const updateDateIdea = async (id, dateIdea) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/dateideas/${id}`, dateIdea);
    return response.data;
  } catch (error) {
    console.error(`Error updating date idea with ID ${id}:`, error);
    throw error;
  }
};

export const updateTag = async (id, tag) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tags/${id}`, tag);
    return response.data;
  } catch (error) {
    console.error(`Error updating tag with ID ${id}:`, error);
    throw error;
  }
};

export const deleteDateIdea = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/dateideas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting date idea:', error);
    throw error;
  }
}

export const deleteTag = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}