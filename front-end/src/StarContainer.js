import React from 'react'
import Star from './Star'
import BlankStar from './BlankStar'

const StarContainer = ({fillStar, number, starClick}) => {
  return (
    <div>{fillStar ? <Star number={number} starClick={starClick}/> : <BlankStar number={number} starClick={starClick} />}</div>
  )
}

export default StarContainer