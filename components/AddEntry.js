import React, { Component } from 'react'
import {View,Text} from 'react-native'
import { getMetricMetaInfo } from '../utils/helpers'

export default class AddEntry extends Component{
    state={
        run:0,
        bike:0,
        swim:0,
        sleep:0,
        eat:0
    }

    increment=(metric) =>{
        const {max,step}=getMetricMetaInfo(metric)

        this.setState((state) => {
            const count=state[metric] + step
            return{
                ...state,
                [metric]:count>max ? max : count
            }
        })
    }

    decrement=() =>{
        const {step}=getMetricMetaInfo(metric)

        this.setState((state) =>{
            const count=state[metric] - step
            return{
                ...state,
                [metric]:count
            }
        })
    }

    slide=(metric,value) =>{
        this.setState(() => ({
            [metric]:value
        }))
    }

    render(){
        return(
            <View>
                <Text>This text is from component add entry</Text>
                {getMetricMetaInfo('bike').getIcon()}
            </View>
        )
    }
}