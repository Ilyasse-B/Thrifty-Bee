import React from 'react'
import Star from './Star'
import BlankStar from './BlankStar'

const StarContainer = ({fillStar, number, starClick, isClickable = true}) => {
  return (
    <div>{fillStar ? <Star number={number} starClick={isClickable ? starClick : null}/> : <BlankStar number={number} starClick={isClickable ? starClick : null} />}</div>
  )
}

export default StarContainer