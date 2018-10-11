import React from 'react';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
const Range = Slider.createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';

const rangeStyle = { width: 318 };
const style = { paddingBottom: 20, marginLeft: -11};

export default class YearRange extends React.Component {

    constructor(props) {
        super(props)
        this.state ={
          min: this.props.currentMin,
          max: this.props.currentMax,
          inputDisabled: true,
        }
      }

      componentWillReceiveProps(nextProps) {
        // in order to reset Slider when clicking on reset button
        if(this.props.currentMin !== nextProps.currentMin || this.props.currentMax !== nextProps.currentMax) {
          this.setState({
            min: nextProps.currentMin,
            max: nextProps.currentMax,
          });
        }
      }

      onSliderChange = (value) => {
        // enable the input fields to make them appear in params
        this.setState({min: value[0], max: value[1], inputDisabled: false});
      }

      onAfterSliderChange = () => {
        // ignite search after dragging
        this.props.onChange();
      }

      marks(min, max, interval = 5) {
        let marks = {};
        for (var i = (min+1); i < max; i++) {
          // set a mark every interval'th year. default is 5
          if (i % interval === 0 ) {
            marks[i] = i;
          }
        }
        // set min and max values as additional marks
        marks[min] = min;
        marks[max] = max;
        return marks;
      }

      render() {
        return (
          <div>
            <div style={style}>
              <span>{this.state.min} - {this.state.max}</span>
              <input name='year_of_birth_min' disabled={this.state.inputDisabled} id='year_of_birth_min' value={this.state.min} type='hidden' size='4' readOnly={true} />
              <input name='year_of_birth_max' disabled={this.state.inputDisabled} id='year_of_birth_max' value={this.state.max} type='hidden' size='4' readOnly={true} />
            </div>
            <Range defaultValue={[this.state.min, this.state.max]} min={this.props.sliderMin} max={this.props.sliderMax}
              onAfterChange={this.onAfterSliderChange} onChange={this.onSliderChange} allowCross={true} 
              marks={this.marks(this.props.sliderMin, this.props.sliderMax)}
              tipProps={{placement: 'top'}} style={rangeStyle}
              value={[this.state.min, this.state.max]}
            />
          </div>
        );
      }
}
