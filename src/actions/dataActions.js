import { GETDATATOEDITH, RESETDATATOEDITH, SETDATATOEDITH } from "../types";

export const setData = (data) =>({type: SETDATATOEDITH, payload: data});

export const resetData = () => ({type: RESETDATATOEDITH});

export const getDataToEdith = () => ({type: GETDATATOEDITH});