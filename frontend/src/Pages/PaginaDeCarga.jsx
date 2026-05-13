import React from 'react'

export  function PaginaDeCarga() {
  return (
    <>
        <div className='flex flex-col space-y-6 justify-center font-bold items-center text-center text-5xl h-screen'>
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
            </div>
        </div>
    </>
  )
}
