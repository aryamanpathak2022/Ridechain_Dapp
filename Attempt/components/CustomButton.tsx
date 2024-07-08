import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title,handlePress,containerStyles,textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.65}
    className= {`bg-secondary rounded-xl min-h-[64px] justify-center items-center 
    ${containerStyles} ${isLoading ? 'opacity-50': ''}`}
    disabled={isLoading}
    >
      <Text className ={`text-primary pblack text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}
//HERE WE ARE CALLING TITLE AS IT IS THE CUSTOM COMPONENT FROM THE INDEX DIRECTLY
export default CustomButton