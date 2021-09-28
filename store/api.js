import axios from 'axios';

const fetchCategories = async () => {
  const request = await axios.get('https://api.fake.rest/3a448a57-49ed-4fe0-82b4-16052ef87316/categories');
  return request;
};

const fetchTasks = async () => {
  const request = await axios.get('https://api.fake.rest/3a448a57-49ed-4fe0-82b4-16052ef87316/tasks');
  return request;
};

export default {
  fetchCategories,
  fetchTasks,
}