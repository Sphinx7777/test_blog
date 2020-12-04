import { Action } from "redux";
import Entity from "./entity";
import { CRUD, IEntityRequest, IActionRequest } from "./common";

export function action(type: string, payload = {}): Action {
    return { type, ...payload };
}

export function entityRequest(entity: Entity) {
    const result: any = {};
    return [CRUD.CREATE, CRUD.READ, CRUD.UPDATE, CRUD.DELETE].reduce((acc: IEntityRequest, crud: CRUD) => {
        const pref = `${entity.entityName.toUpperCase()}_${crud}`;
        const glob = { entity, crud };
        const act: IActionRequest = {
            request: (data) => action(`${pref}_REQUEST`, { glob, data }),
            success: (data, response) => action(`${pref}_SUCCESS`, { glob, data, response }),
            failure: (data, error) => action(`${pref}_FAILURE`, { glob, data, error }),
        };
        // @ts-ignore
        acc[crud] = act;
        return acc;
    }, result);
}

export const SET_REGISTRATION = 'SET_REGISTRATION'
export const SET_LOGOUT_USER = 'SET_LOGOUT_USER'
export const SET_AUTH_USER = 'SET_AUTH_USER'
export const GET_ALL_POST = 'GET_ALL_POSTS'
export const SET_IDENTITY = 'SET_IDENTITY'
export const SET_NEW_POST = 'SET_NEW_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const DELETE_POST = 'DELETE_POST'
export const GET_ONE_POST = 'GET_ONE_POST'
export const GET_MESSAGE = 'GET_MESSAGE'
export const DELL_MESSAGE = 'DELL_MESSAGE'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_QUERY = 'SET_QUERY'

export const setAuthUserAC = (authUser: any) => action(SET_AUTH_USER, authUser);
export const setIdentityAC = (authUser: any) => action(SET_IDENTITY, authUser);
export const setRegistrationAC = (data: any) => action(SET_REGISTRATION, data);
export const setLogOutUserAC = (data: any) => action(SET_LOGOUT_USER, data);
export const getOnePostAC = (id: any) => action(GET_ONE_POST, id);
export const setQueryAC = (query: any = null) => action(SET_QUERY, query);
export const setNewPostAC = (post: any) => action(SET_NEW_POST, post);
export const updatePostAC = (data: any) => action(UPDATE_POST, data);
export const deletePostAC = (id: any) => action(DELETE_POST, id);
export const getAllPostsAC = (data: any) => action(GET_ALL_POST,data);
export const getMessageAC = (payload: any) => action(GET_MESSAGE, payload);
export const setMessageAC = (payload: any) => action(SET_MESSAGE, payload);
export const dellMessageAC = () => action(DELL_MESSAGE);





