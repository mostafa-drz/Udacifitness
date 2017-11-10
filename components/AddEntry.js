import React, { Component } from 'react'
import {View,Text,TouchableOpacity,StyleSheet,Platform} from 'react-native'
import { getMetricMetaInfo,timeToString,getDailyReminderValue} from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {Ionicons} from '@expo/vector-icons'
import {submitEntry,removeEntry} from '../utils/api'
import {addEntry} from '../actions'
import {connect} from 'react-redux'
import {white,purple} from '../utils/colors'
function SubmitBtn({onPress}){
    return(
        <TouchableOpacity style={Platform.OS==='ios' ? styles.iosSubmitButton : styles.androindSubmitButton}onPress={onPress}>
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
    )
}
class AddEntry extends Component{
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

    decrement=(metric) =>{
        const {step}=getMetricMetaInfo(metric)

        this.setState((state) =>{
            const count=state[metric] - step
            return{
                ...state,
                [metric]:count<0 ? 0 : count
            }
        })
    }

    slide=(metric,value) =>{
        this.setState(() => ({
            [metric]:value
        }))
    }

    submit=() => {
        const key=timeToString()
        const entry=this.state

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))
        this.props.addEntry({[key]:entry})
        submitEntry({key,entry})
    }

    reset=() =>{
        const key=timeToString()

        this.props.addEntry({[key]:getDailyReminderValue()})
        removeEntry({key})

    }
    render() {
        const metaInfo = getMetricMetaInfo()
        if(this.props.alreadyLogged){
            return(
                <View style={styles.center}>
                    <Ionicons
                     name={Platform.OS==='ios' ? 'ios-happy-outline' : 'md-happy'}
                     size={100}
                    />
                    <Text style={{padding:10}} >You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <DateHeader date={new Date().toLocaleDateString()} />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View style={styles.row} key={key}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />}
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}
function mapStateToProps(state){
    const key=timeToString()
    return {
        alreadyLogged:state[key] && typeof state[key].today==='undefined'
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        paddingTop:50,
        backgroundColor:white
    },
    row:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    iosSubmitButton:{
        backgroundColor:purple,
        padding:10,
        borderRadius:7,
        height:45,
        marginLeft:40,
        marginRight:40
    },
    androindSubmitButton:{
        backgroundColor:purple,
        padding:10,
        paddingLeft:30,
        paddingRight:30,
        height:45,
        borderRadius:2,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    submitBtnText:{
        color:white,
        fontSize:22,
        textAlign:'center'
    },
    center:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:30,
        marginRight:30
    }
})
export default  connect(mapStateToProps,{addEntry})(AddEntry)