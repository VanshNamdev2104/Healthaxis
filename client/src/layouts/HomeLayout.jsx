import React from 'react'
import HeroGeometric from '../components/HeroGeometric';
import CursorParticle from '../components/CursorParticle';

const HomeLayout = () => {
  return (
    <div>
      <CursorParticle />
      <HeroGeometric
       badge="Smart Healthcare Platform"
       title1="Your Health, Simplified"
       title2="With HealthAxis"
    />
    </div>
  ) 
}

export default HomeLayout