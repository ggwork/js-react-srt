import React from 'react';
import './index.scss'
import videoIcon from '../../assets/video.png'
import audioIcon from '../../assets/audio.png'
import lrcIcon from '../../assets/lrc.png'
import WeixinIcon from '../../components/weixinIcon'
import { Link } from 'react-router-dom'


class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  navigate = (path) => {
    if (path.includes('http')) {
      window.location.href = path
    } else {
      console.log('this.props.history:', this.props.history)
      this.props.history.push(path)
    }
  }
  render() {
    return (
      <div className='home-main'>
        <div className='m-header'>
          <div className='m-h-name'>字幕在线</div>
        </div>
        <div className='m-title'>一个在线字幕制作网站</div>
        <div className='m-cont'>
          <div className='m-c-row'>

            <div className='m-c-item'>
              <Link to='/videoSrt'>
                <div className='m-c-i-title'>视频制作字幕</div>
                <div className='m-c-i-icon'>
                  <img src={videoIcon} alt='视频制作字幕'></img>
                </div>
              </Link>
            </div>
            <div className='m-c-item' onClick={() => { this.navigate('/audioSrt') }}>
              <Link to='/audioSrt'>
                <div className='m-c-i-title'>音频制作字幕</div>
                <div className='m-c-i-icon'>
                  <img src={audioIcon} alt='音频制作字幕'></img>
                </div>
              </Link>
            </div>
            <div className='m-c-item' onClick={() => { this.navigate('http://lrc.mfish.xyz') }}>
              <div className='m-c-i-title'>在线制作歌词</div>
              <div className='m-c-i-icon'>
                <img src={lrcIcon} alt='在线制作歌词'></img>
              </div>
            </div>
          </div>
        </div>

        {/* <div className='m-footer'>
          <div className='f-inner'>
            <Link to='/me'>联系我</Link>
          </div>
        </div> */}
        <WeixinIcon></WeixinIcon>
      </div>
    )
  }
}

export default Home
