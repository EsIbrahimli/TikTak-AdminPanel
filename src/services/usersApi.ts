import {axiosInstance} from './axiosInstance';

 export const getUsers = async () => {
  const response = await axiosInstance.get("/admin/users");

  return response.data.data;
};
