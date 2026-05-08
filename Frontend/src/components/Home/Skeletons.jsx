import React from 'react'

export const Sideskeleton = () => {
    const channelsplaceholders=[1,2,3,4,5,6]
    return (
       
       <div className='flex flex-col gap-2 p-2'>
         {channelsplaceholders.map((_,i)=>(
            <div key={i} className='flex items-center gap-2 px-3 py-2'>
                 <div className='w-full h-3 bg-base-300 rounded-lg animate-pulse'/>
            </div>
         ))} 
       </div>

    )
}

export const UsersSkeleton=()=>{
   const usersplaceholders=[1,2,3,4,5,6]
   return(
     <div className='flex flex-col gap-2 p-2'>
      {
         usersplaceholders.map((_,i)=>(
            <div key={i} className='flex items-center gap-3 px-3 py-2'>
               <div className='w-10 h-10 rounded-full bg-base-300 animate-pulse'></div>
               <div className='w-full h-4 bg-base-300 animate-pulse'></div>
            </div>
         ))
      }
     </div>
   )
}
export const ChatSkeleton=()=>{
     const chatsplaceholders=[1,2,3,4,5,6]
   return(
         <div className='flex flex-col gap-2 p-2'>
            {
               chatsplaceholders.map((_,i)=>(
                  <div key={i} classname={`flex items-end gap-2 ${i % 2 === 0? "justify-start":"justify-end flex-row-reverse"}`}>
                     <div className='w-8 h-8 rounded-full bg-base-300 animate-pulse flex-shrink-0'/>
                     <div className={`h-10 bg-base-300 rounded-2xl animate-pulse ${i % 2 === 0? "w-48":"w-36"}`}></div>
                  </div>   
               ))
            }
         </div>
   )
}