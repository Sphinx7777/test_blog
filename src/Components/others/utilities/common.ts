import { Action } from "redux";

export enum METHOD {
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
}

export enum CRUD {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ'
}

export interface IActionRequest {
  request: (data: any) => Action;
  success: (data: any, response: any) => Action;
  failure: (data: any, error: any) => Action;
}

export interface IEntityRequest {
  CREATE: IActionRequest;
  READ: IActionRequest;
  UPDATE: IActionRequest;
  DELETE: IActionRequest;
}

export const myPromise = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const blankAvatar = 'https://kingsballpen.com.ng/wp-content/uploads/2019/12/img-avatar-blank.jpg'
export const femaleAvatar = 'https://kingsballpen.com.ng/wp-content/uploads/2019/12/Female-Avatar.jpg'
export const getDate = (date: string) => {
  const createdDate = new Date(date);
  return createdDate.toLocaleDateString("us-US");
}