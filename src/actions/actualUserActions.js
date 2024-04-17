import { RESETACTUALUSER, SETACTUALUSER } from "../types";

export const setActualUser = (data) => ({ type: SETACTUALUSER, payload: data });

export const updateActualUser = (data) => ({ type: SETACTUALUSER, payload: data });

export const resetActualUser = () => ({ type: RESETACTUALUSER });
