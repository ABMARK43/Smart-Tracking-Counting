import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import OpenMoji from '../shared/OpenMoji.js';
import SVG from 'react-inlinesvg';
import { deleteRecording } from '../../statemanagement/app/HistoryStateManagement.js';
import { getCounterColor, getDisplayClasses } from '../../utils/colors.js';
import { COUNTING_AREA_TYPE } from '../../utils/constants.js';
import RecordingDeleteConfirmationModal from '../shared/RecordingDeleteConfirmationModal.js';
import Chart from './Chart';
class Recording extends PureComponent {

  constructor(props) {
    super(props);

    this.DISPLAY_CLASSES = getDisplayClasses();

    this.state = {
      showDeleteConfirmationModal: false,

    }
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  renderDateEnd(dateEnd, active = false) {
    if (!active) {
      return dayjs(dateEnd).format('hh:mm a')
    } else {
      return (
        <span className="font-bold" style={{ color: "#FF0000" }}>Ongoing</span>
      )
    }
  }

  generateData(count) {
    var max = 500
    if (max - count > 0) {
      var remaining = max - count
    }
    else {
      var remaining = 0
    }
    var chartData = {}
    return (chartData = {
      labels: ['Current Count', 'Remaining'],
      datasets: [
        {
          label: 'People Count',
          data: [
            count,
            remaining

          ],
          backgroundColor: [
            'rgba(255,99,132,0.6)',
            'rgba(54,162,235,0.6)',

          ]
        }
      ]
    })

  }

  renderPieChart() {
    var x = this.props.counterData;
    var y = String(x)
    console.log(y)
    console.log(y.length)
    if (y.length > 150) {

      var m = y.split('total": ')[1].split(',')[0]
      var n = y.split('total": ')[2].split(',')[0]
      var z = parseInt(m) - parseInt(n)
      console.log(z)
      var data = this.generateData(z)
    }
    else if (y.length > 50) {
      var z = y.split('total": ')[1].split(',')[0]
      var data = this.generateData(z)
    }
    else {
      var z = 0
      var data = this.generateData(z)
    }
    return (

      <div class="pie flex flex-initial flex-col rounded  text-black shadow m-2 p-4">
        <Chart chartData={data} />
      </div>




    )

  }
  renderCapacity() {
    var x = this.props.counterData;
    var max = 500
    var y = String(x)
    if (y.length > 150) {

      var m = y.split('total": ')[1].split(',')[0]
      var n = y.split('total": ')[2].split(',')[0]
      var z = parseInt(m) - parseInt(n)

    }
    else if (y.length > 50) {
      var z = y.split('total": ')[1].split(',')[0]

    }
    else {
      var z = 0
    }
    return (
      <div className="flex flex-initial flex-col rounded bg-white text-black shadow m-2 p-4">
        <div className="flex items-end justify-between">
          <h3 className="mr-3 text-xl font-bold">Occupancy</h3>
        </div>
        <div className="mt-4 flex flex-wrap">
          <div className={`flex flex-col counter-area bg-gray-200 m-2 rounded p-4`}>
            <div className="flex flex-initial flex-wrap mt-5 w-64">
              <div className="flex w-16 m-1 items-center justify-center">
                <h4 className="font-medium font-bold">Occupied
                      <p style={{ color: "#FF0000" }}>
                    {z}
                  </p>

                </h4>
                
              </div>

            </div>
          </div>
          <div className={`flex flex-col counter-area bg-gray-200 m-2 rounded p-4`}>
            <div className="flex flex-initial flex-wrap mt-5 w-64">
              <div className="flex w-16 m-1 items-center justify-center">
                <h4 className="font-medium font-bold">Remaining
                      <p style={{ color: "#FF0000" }}>
                    {max - z}
                  </p>
                </h4>
              </div>

            </div>
          </div>


        </div>
      </div>

    )


  }

  render() {

    return (
      <div className="flex flex-initial flex-col recording pl-2 mb-10">
        <div className="text-inverse flex flex-initial items-center pl-6">
          <div>{dayjs(this.props.dateStart).format('MMM DD, YYYY')}</div>
          <div className="ml-10">
            {dayjs(this.props.dateStart).format('hh:mm a')} - {this.renderDateEnd(this.props.dateEnd, this.props.active)}
          </div>
          {this.props.filename &&
            <div className="ml-10">
              {this.props.filename}
            </div>
          }
          {!this.props.active &&
            <button
              className="btn btn-default p-0 ml-2 shadow rounded"
              onClick={() => this.setState({ showDeleteConfirmationModal: true })}
            >
              <SVG
                className="w-6 h-6 svg-icon flex items-center"
                cacheRequests={true}
                src={`/static/icons/ui/delete.svg`}
                aria-label="icon close"
              />
            </button>
          }
        </div>
        {this.state.showDeleteConfirmationModal &&
          <RecordingDeleteConfirmationModal
            onCancel={() => this.setState({ showDeleteConfirmationModal: false })}
            onConfirm={() => this.props.dispatch(deleteRecording(this.props.id))}
          />
        }

        <div className="flex flex-initial flex-wrap pb-2 pl-1 m-2">
          {this.props.countingAreas.size > 0 &&
            <div className="flex flex-initial flex-col rounded bg-white text-black shadow m-2 p-4">
              <div className="flex items-end justify-between">
                <h3 className="mr-3 text-xl font-bold">Counter</h3>
                <div>
                  <div className="font-medium mr-2 inline-block">Download:</div>
                  <a className="btn-text mr-2" href={`/recording/${this.props.id}/counter`} target="_blank" download>JSON</a>
                  <a className="btn-text" href={`/recording/${this.props.id}/counter/csv`} target="_blank" download>CSV</a>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap">
                {this.props.countingAreas && this.props.countingAreas.entrySeq().map(([countingAreaId, countingAreaData], index) =>
                  <div
                    key={countingAreaId}
                    className={`flex flex-col counter-area bg-gray-200 m-2 rounded p-4`}
                  >
                    <div className="flex items-center">
                      <h4 className="font-medium">{countingAreaData.get('name')}</h4>
                      <div className="w-4 h-4 ml-2 rounded-full" style={{ 'backgroundColor': getCounterColor(countingAreaData.get('color')) }}></div>
                      {countingAreaData.get('type') === COUNTING_AREA_TYPE.BIDIRECTIONAL &&
                        <img className="icon-direction" style={{ 'transform': `rotate(${countingAreaData.getIn(['computed', 'lineBearings']).first() + 90}deg)` }} src="/static/icons/ui/arrow-double.svg" />
                      }
                      {countingAreaData.get('type') === COUNTING_AREA_TYPE.LEFTRIGHT_TOPBOTTOM &&
                        <img className="icon-direction" style={{ 'transform': `rotate(${countingAreaData.getIn(['computed', 'lineBearings']).first() + 90}deg)` }} src="/static/icons/ui/arrow-up.svg" />
                      }
                      {countingAreaData.get('type') === COUNTING_AREA_TYPE.RIGHTLEFT_BOTTOMTOP &&
                        <img className="icon-direction" style={{ 'transform': `rotate(${countingAreaData.getIn(['computed', 'lineBearings']).first() + 90}deg)` }} src="/static/icons/ui/arrow-down.svg" />
                      }
                    </div>
                    <div className="flex flex-initial flex-wrap mt-5 w-64">
                      {this.DISPLAY_CLASSES.slice(0, Math.min(this.DISPLAY_CLASSES.length, 2)).map((counterClass) =>
                        <div
                          className="flex w-16 m-1 items-center justify-center"
                          key={counterClass.class}
                        >
                          <h4 className="mr-2">{this.props.counterData && this.props.counterData.getIn([countingAreaId, counterClass.class]) || 0}</h4>

                          <OpenMoji
                            icon={counterClass.icon}
                            class={counterClass.class}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
          <div className="flex flex-initial flex-col rounded bg-white text-black shadow m-2 p-4">
            <div className="flex items-end justify-between">
              <h3 className="mr-3 text-xl font-bold">Tracker</h3>
              <div>
                <div className="font-medium mr-2 inline-block">Download:</div>
                <a className="btn-text mr-2" href={`/recording/${this.props.id}/tracker`} target="_blank" download>JSON</a>
              </div>
            </div>
            <div className="mt-6 rounded relative">
              <div className="text-white absolute" style={{ bottom: 10, left: 10 }}>
                <h2 className="inline text-4xl font-bold">{this.props.nbPaths}</h2> objects tracked
              </div>
              <img src="/static/placeholder/pathview.jpg" />
            </div>
          </div>
          {this.renderCapacity()}
        </div>

        < div >
          {this.renderPieChart()}

        </div>

        <style jsx>{`
          {/* Didn't succeed to make this better: https://stackoverflow.com/questions/54384305/dynamic-width-parent-with-flexbox-column-wrapping 
            Seems cannot have container parent width shrink when some element are wrapping
          */}
          .counter-area {
            max-width: 350px;
            flex: 1;
          }
          
          .icon-direction {
            margin-left: 5px;
            width: 20px;
            height: 20px;
          }
        `}</style>
      </div>
    )
  }
}

export default connect()(Recording)