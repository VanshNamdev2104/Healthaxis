import { createSlice } from "@reduxjs/toolkit";


export const hospitalSlice = createSlice({
    name: "hospital",
    initialState : {
        error : null,
        loading : false,
        hospital : null,
        hospitalAdmin : null
    },
    reducers : {
        setHospital : (state, action) => {
            state.hospital = action.payload;
        },
        setHospitalAdmin : (state, action) => {
            state.hospitalAdmin = action.payload;
        },
        setLoading : (state, action) => {
            state.loading = action.payload;
        },
        setError : (state, action) => {
            state.error = action.payload;
        }
    }
})


export const {setError, setHospital, setLoading , setHospitalAdmin} = hospitalSlice.actions;
export default hospitalSlice.reducer