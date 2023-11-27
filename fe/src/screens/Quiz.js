import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Questions from './Questions'

function onNext(){
  console.log('On next click')
}

function onPrev(){
  console.log('On onPrev click')
}


export default function Quiz() {

  const state = useSelector(state => state)

    useEffect(() => {
        console.log(state)
    })

  return (
    <div className='container'>
    <h1 className='title text-light'>Quiz Application</h1>

    {/* display questions */}

    <Questions />
    <div className='grid'>
        <button className='btn prev' onClick={onPrev}>Prev</button>
        <button className='btn next' onClick={onNext}>Next</button>
    </div>
</div>
  )
}