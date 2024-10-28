import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar';

function PublicProfilePage() {
    const { userId } = useParams();
  return (
    <div>
        <Navbar/>
        This is Profile Page of {userId}
    </div>
  )
}

export default PublicProfilePage