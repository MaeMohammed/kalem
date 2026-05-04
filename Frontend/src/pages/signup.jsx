import SignupForm from '@/components/authentication/signupForm'
import BorderGlow from '@/components/reactbits/BorderGlow'
import Shuffle from '@/components/reactbits/Shuffle'
import React from 'react'

const Signup = () => {
  return (
     <div className='min-h-screen flex items-center justify-center'
        style={{background: "radial-gradient(ellipse at center, #392051 0%, #000000 70%)"}}
    >
      
      <div className='flex flex-col items-center w-full max-w-md px-4'>
        <Shuffle
          className='text-5xl text-center font-black  tracking-widest mb-5'
          text="Kalem"
          shuffleDirection="right"
          duration={0.45}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
        <BorderGlow
          className='w-full max-w-md'
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="#120F17"
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >

          <SignupForm/>
        </BorderGlow>
      </div>
    </div>
  )
}

export default Signup
