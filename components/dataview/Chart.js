import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';


class Chart extends Component{

    constructor(props){
        super(props);

        }
     

    static defaultprops = {
        d : 100,
        g : 400
    }

     render(){
         return(
             <div className="chart" >
                <Pie 
                  data = {this.props.chartData}
                  width = {50}
                  height = {30}
                  options= {{
                      legend:{
                          display : true , 
                          position : 'bottom'
                      }
            
                  }} />
             </div>
         )
     }

}
export default Chart;