import {React, useContext} from 'react'
import {RecommendationContext} from '../Context/RecommendationContext';

function useRecommendation() {
  return  useContext(RecommendationContext)
}

export default useRecommendation