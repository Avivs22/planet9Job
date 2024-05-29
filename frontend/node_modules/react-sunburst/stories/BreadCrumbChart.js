import React from 'react';
import BreadCrumb from '../src/BreadCrumb';
import Sunburst from '../src/sunburst';
import Resizable from './Resizable';

export default class BreadCrumbChart extends React.Component {
    state = {
        hover: ['']
    }
    
    render() {
        return (
            <div style={ {width: 300, height: 400} }>
                <div>
                    <Sunburst valueField={ this.props.valueField } data={ this.props.data } onMouseArcOut={ this.arcOut } 
                    onMouseArcOver={ this.arcHover }></Sunburst>
                </div>   
                <BreadCrumb path={ this.state.hover }></BreadCrumb>
            </div>
        );
    }

    arcHover = (data) => {
        this.setState({
            hover: [ data.data.name ]
        });
    }

    arcOut = (data) => {
        this.setState({
            hover: ['']
        });
    }
}; 
