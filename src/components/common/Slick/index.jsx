import './Slick.scss';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon/Icon.jsx';
// import Icon from '../Icon/Icon.jsx';
export default class Slick extends Component {
  static defaultProps = {
    defaultTranslateX: 0,
    step: 84 * 11,
  }
  static propTypes = {
    currentItem: PropTypes.number,
    defaultCurrent: PropTypes.number,
    defaultTranslateX: PropTypes.number,
    directionNav: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    // iconItemListPos: PropTypes.object,
    step: PropTypes.number,
    itemData: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentItem: this.props.defaultCurrent,
      defaultTranslateX: this.props.defaultTranslateX,
      step: this.props.step,
    // iconItemListPos: Object.assign({}, this.props.iconItemListPos),
      scrollAreaWidth: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultCurrent || nextProps.defaultCurrent === 0) {
      this.setState({
        currentItem: nextProps.defaultCurrent,
      });
    }
  }
  // componentWillMount() {
  //   const { itemData } = this.props;
  //   const uiWidth = 84 * itemData.length;
  //   this.setState({ scrollAreaWidth: uiWidth });
  // }
  handleClick(config, evt) {
    const { type, index } = config;
    const { currentItem, defaultTranslateX, scrollAreaWidth } = this.state;
    const { step } = this.props;
    let _currentItem = currentItem;
    let _iconItemListPosLeft = defaultTranslateX;
    switch (type) {
      case 'item':
        _currentItem = index;
        break;
      case 'prev':
        _iconItemListPosLeft += step;
        if (_iconItemListPosLeft <= 0) {
          this.setState({ defaultTranslateX: _iconItemListPosLeft });
        }
        break;
      case 'next':
        evt.preventDefault();
        _iconItemListPosLeft -= step;
        // 单步滚动
        if (step < 924) {
          const scrollPage = Math.floor(scrollAreaWidth / 924);
          const leftLength = scrollAreaWidth % 924;
          if (leftLength !== 0) {
            if (scrollPage > 0) {
              if (Math.abs(_iconItemListPosLeft) <= leftLength) {
                this.setState({ defaultTranslateX: _iconItemListPosLeft });
              } else {
                const leftScroll = (scrollAreaWidth - 924);
                if (Math.abs(_iconItemListPosLeft) < leftScroll) {
                  this.setState({ defaultTranslateX: _iconItemListPosLeft });
                }
              }
            }
          } else {
            if (scrollPage > 1) {
              const leftScroll = (scrollAreaWidth - 924);
              if (Math.abs(_iconItemListPosLeft) < leftScroll) {
                this.setState({ defaultTranslateX: _iconItemListPosLeft });
              }
            }
          }
        } else {
          if (Math.abs(_iconItemListPosLeft) < scrollAreaWidth) {
            this.setState({ defaultTranslateX: _iconItemListPosLeft });
          }
        }
        break;
      default:
        break;
    }
    if (_currentItem !== this.state.currentItem) {
      this.setState({
        currentItem: _currentItem,
      });
    }
    evt.stopPropagation();
    evt.preventDefault();
    if (this.props.onClick) this.props.onClick(_currentItem);
  }
  deleteSingleClick(config, evt) {
    evt.stopPropagation();
    // evt.preventDefault();
    if (config.index || config.index === 0) {
      const { index } = config;
      if (this.props.onDelete) this.props.onDelete(index);
    }
  }
  render() {
    const itemArr = [];
    // iconItemListPos
    const { itemData } = this.props;
    const scrollAreaWidth = 84 * itemData.length;
    const { currentItem, defaultTranslateX } = this.state;
    // const { itemData } = this.props;
    itemData.forEach((item, i) => {
      let passIcon = 'none';
      let notPassIcon = 'none';
      if (item.pass) {
        passIcon = 'block';
      }
      if (item.notPass) {
        notPassIcon = 'block';
      }
      itemArr.push(<li
        key={`item_${i}`}
        className={currentItem === i ? 'upload-icon-item on' : 'upload-icon-item'}
        onClick={(evt) => this.handleClick({ type: 'item', index: i }, evt)}
      >
        <i
          className={'iconfont delete'}
          onClick={(evt) => this.deleteSingleClick({ index: i }, evt)}
        >&#xf077;</i>
        <Icon className={'iconfont upload-icon'} d={item.path} size={60} />
        <div className={'pass-tag'} style={{ display: passIcon }}>通过</div>
        <div className={'no-pass-tag'} style={{ display: notPassIcon }}>不通过</div>
      </li>);
    });
    return (
      <div className={'upload-icon clearfix'}>
        <button
          className={'icons-more-btn icons-more-btn-left'}
          onClick={(evt) => this.handleClick({ type: 'prev' }, evt)}
        >
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c3;</i></button>
        <div className={'upload-icon-list-area'} ref={'uploadIconListArea'}>
          <ul
            ref={'uploadIconList'}
            className={'upload-icon-list'}
            style={{ marginLeft: defaultTranslateX, width: scrollAreaWidth }}
          >
            {itemArr}
          </ul>
        </div>
        <button
          className={'icons-more-btn icons-more-btn-right'}
          onClick={(evt) => this.handleClick({ type: 'next' }, evt)}
        >
          <i className={'iconfont icons-more-btn-icon'}>&#xf1c1;</i></button>
      </div>
    );
  }
}
