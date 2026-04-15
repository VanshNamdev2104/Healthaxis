import React from 'react'
import { useHospital } from '../hooks/useHospital'
import { useSelector } from 'react-redux'

const DoctorsPage = () => {
    const { handleCreateDoctor, handleDeleteDoctor, handleGetAllDoctorBySpecialization, handleGetAllDoctors, handleGetDoctor } = useHospital()
    const { doctors } = useSelector((state) => state.hospital)
    return (
        <div>

        </div>
    )
}

export default DoctorsPage