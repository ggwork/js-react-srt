import React from 'react'
import wxLogo from '../../assets/weixin.png'
import './index.scss'
class WeixinIcon extends React.Component {
  render() {
    return (
      <div className='side'>
        <img src={wxLogo} alt='微信：guo330504' title='微信：guo330504'></img>
      </div>
    )
  }
}
export default WeixinIcon