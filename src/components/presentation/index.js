import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import cx from 'classnames';
import Slide from './slide';
import Whiteboard from './whiteboard';
import { getCurrentDataIndex } from 'utils/data';
import './index.scss';

const intlMessages = defineMessages({
  aria: {
    id: 'player.presentation.wrapper.aria',
    description: 'Aria label for the presentation wrapper',
  },
});

export default class Presentation extends Component {
  constructor(props) {
    super(props);

    this.id = 'presentation';
  }

  getSlideId() {
    const {
      slides,
      time,
    } = this.props;

    const currentDataIndex = getCurrentDataIndex(slides, time);
    if (currentDataIndex === -1) return -1;

    const currentData = slides[currentDataIndex];

    return currentData.id;
  }

  getViewBox() {
    const {
      panzooms,
      time,
    } = this.props;

    const currentDataIndex = getCurrentDataIndex(panzooms, time);
    if (currentDataIndex === -1) {
      return {
        height: 0,
        x: 0,
        width: 0,
        y: 0,
      };
    }

    const currentData = panzooms[currentDataIndex];

    return {
      height: currentData.height,
      x: currentData.x,
      width: currentData.width,
      y: currentData.y,
    };
  }

  getCursor(viewBox) {
    const {
      cursor,
      time,
    } = this.props;

    const currentDataIndex = getCurrentDataIndex(cursor, time);
    if (currentDataIndex === -1) {
      return {
        x: -1,
        y: -1,
      };
    }

    const currentData = cursor[currentDataIndex];

    return {
      x: viewBox.x + (currentData.x * viewBox.width),
      y: viewBox.y + (currentData.y * viewBox.height),
    };
  }

  render() {
    const {
      active,
      canvases,
      intl,
      metadata,
      slides,
      time,
    } = this.props;

    const id = this.getSlideId();
    const viewBox = this.getViewBox();
    const cursor = this.getCursor(viewBox);

    return (
      <div
        aria-label={intl.formatMessage(intlMessages.aria)}
        className={cx('presentation-wrapper', { inactive: !active })}
        id={this.id}
      >
        <div className="presentation">
          <svg
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <clipPath id="clip">
                <rect
                  height={viewBox.height}
                  x={viewBox.x}
                  width={viewBox.width}
                  y={viewBox.y}
                />
              </clipPath>
            </defs>
            <g className="area">
              <Slide
                id={id}
                intl={intl}
                metadata={metadata}
                slides={slides}
              />
              <Whiteboard
                canvases={canvases}
                id={id}
                metadata={metadata}
                time={time}
              />
              <circle
                className="cursor"
                style={{ cx: cursor.x, cy: cursor.y }}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
