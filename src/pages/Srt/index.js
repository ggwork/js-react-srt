import React, { createRef } from 'react';
import './index.scss'
import { Button, Input, message, Modal, Spin } from 'antd'
import wxLogo from '../../assets/weixin.png'
let textAreaPlaceholder = `如果是双语字幕，原文和译文要在同一行，中间使用逗号（中英文均可）隔开
如：
他只是假仁假义，He puts his hand in your shirt and squeezes your tit till it's purple.
他在找死，继续干活吧，Getting himself killed.
`
class Lyc extends React.Component {
  constructor(props) {
    super(props)
    this.lycContentRef = createRef(null)
    this.state = {
      messageVisible: false,
      lycTextModalVisible: false,
      lycTextContent: '',
      lycList: [
        {
          startTime: '00:00:00,000',
          endTime: '00:00:00,200',
          cont: '1.点击“上传视频”上传视频',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,200',
          endTime: '00:00:00,300',
          cont: '2.点击"粘贴台词"，把台词粘贴到弹出框。双语字幕的话，原文和译文在同一行，中间使用逗号（中英文均可）隔开。',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,300',
          endTime: '00:00:00,400',
          cont: '3.点击"播放"，播放视频后，点击"打Tag"可在红色底（选中状态）一栏打上时间点,第一下是开始时间tag，第二下是结束时间tag',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,400',
          endTime: '00:00:00,500',
          cont: '4.可以点击“选中此行”后，拖动进度条重新给该行打tag',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,500',
          endTime: '00:00:00,600',
          cont: '5.在时间上双击，可以编辑时间',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,600',
          endTime: '00:00:00,700',
          cont: '6.在台词上双击，可以编辑台词。',
          startTimeReadOnly: true,
          contReadOnly: true
        },
        {
          startTime: '00:00:00,700',
          endTime: '00:00:00,800',
          cont: '7.制作完成后，点击"导出字幕"可以将生成的字幕导出来。格式为srt。',
          startTimeReadOnly: true,
          contReadOnly: true
        }
      ],
      lycInfo: {
        ti: '',
        ar: '',
        al: '',
        by: ''
      },
      wavesurfer: null,
      audioFile: {},
      currentIndex: 0,
      audioLoad: ''
    }
  }

  componentDidMount() {
    // eslint-disable-next-line

  }

  timeEleClick = (lycObj, index) => {
    this.resetReadOnly()
    lycObj.startTimeReadOnly = false
    this.replaceLycList(lycObj, index)
  }

  timeEleBlur = (lycObj, index) => {
    // console.log('timeEleBlur:', index)
    lycObj.startTimeReadOnly = true
    this.replaceLycList(lycObj, index)
  }
  timeContChange = (value, lycObj, index) => {
    // console.log('value:', value)
    // 数据格式
    let timeReg = /^[0-5]{0,1}[0-9]{0,1}:[0-5]{0,1}[0-9]{0,1}\.\d{0,2}$/
    if (timeReg.test(value)) {
      lycObj.time = value
      this.replaceLycList(lycObj, index)
    } else if (value === '') {
      // 点击了清除键
      lycObj.time = ''
      this.replaceLycList(lycObj, index)
    }


    // else {
    //   this.showMessage('时间格式不对', 'error')
    // }

  }
  // 内容的编辑
  contEleClick = (lycObj, index) => {
    this.resetReadOnly()
    lycObj.contReadOnly = false
    this.replaceLycList(lycObj, index)
  }


  contEleBlur = (lycObj, index) => {
    lycObj.contReadOnly = true
    this.replaceLycList(lycObj, index)
  }
  contEleChange = (value, lycObj, index) => {
    lycObj.cont = value
    this.replaceLycList(lycObj, index)
  }
  showMessage = (content, type = 'info') => {
    let messageVisible = this.state.messageVisible
    if (!messageVisible) {
      this.setState({
        messageVisible: true
      })
      message[type](content).then(() => {
        this.setState({
          messageVisible: false
        })
      })
    }

  }

  resetReadOnly = () => {
    let lycList = this.state.lycList
    lycList.forEach(item => {
      item.startTimeReadOnly = true
      item.contReadOnly = true
    })
    this.setState({
      lycList
    })
  }

  replaceLycList = (lycObj, index) => {
    let lycList = this.state.lycList
    lycList.splice(index, 1, lycObj)
    this.setState({
      lycList: lycList
    })
  }

  lycTextModalOk = () => {
    this.setState({
      lycTextModalVisible: false
    })
    let lycTextContent = this.state.lycTextContent
    let lycTextArr = lycTextContent.split(/(?:\r*\n)+/g)
    let lycList = lycTextArr.map(item => {
      let lyc = item.replace(/^\s*|\s*$/g, '')
      return {
        time: '',
        cont: lyc,
        startTimeReadOnly: true,
        contReadOnly: true
      }
    })
    this.setState({
      lycList
    })


  }
  lycTextChange = (e) => {
    // this.lycTextContent = e.target.value
    this.setState({
      lycTextContent: e.target.value
    })

  }
  showLycTextModal = () => {
    this.setState({
      lycTextModalVisible: true
    })
  }
  closeLycModal = () => {
    this.setState({
      lycTextModalVisible: false
    })
  }

  changeLycInfoName = (value, key) => {
    let lycInfo = this.state.lycInfo
    lycInfo[key] = value
    this.setState({
      lycInfo
    })

  }

  nativeUploadChange = (e) => {
    let file = e.target.files[0]
    let audioUrl = URL.createObjectURL(file)
    this.setState({
      audioFile: file,
      audioLoad: 'loading'
    })
    // 显示波形图
    // let { wavesurfer } = this.state
    // wavesurfer.load(audioUrl)
    // wavesurfer.on('ready', (res) => {
    //   // this.showMessage('上传成功', 'success')
    //   this.setState({
    //     audioLoad: true
    //   })
    // })


  }

  playAudio = () => {
    // this.state.wavesurfer.play()

  }
  stopAudio = () => {
    // this.state.wavesurfer.pause()
    // this.showMessage('您还没有上传音乐', 'error')
  }

  checkedRow = (index) => {
    this.setState({
      currentIndex: index
    })
  }

  tagLyc = () => {
    let { currentIndex, wavesurfer, lycList } = this.state
    let currentTime = wavesurfer.getCurrentTime()
    let newTime = this.formatTime(currentTime)
    let lycObj = lycList[currentIndex]
    lycObj.time = newTime
    this.replaceLycList(lycObj, currentIndex)
    if (currentIndex < lycList.length) {
      currentIndex += 1
      // 滚动滚动条
      if (currentIndex > 3) {
        this.lycContentRef.current.scrollTop = (currentIndex - 3) * 60
      }

      this.setState({
        currentIndex
      })
    }

    // 2.981333333333333
  }
  formatTime = (secNum) => {
    // 2.981333333333333
    let seconds = Math.floor(secNum)
    let mill = Math.floor((secNum - seconds) * 100)
    let min = Math.floor(seconds / 60) // 分钟
    let subSeconds = seconds - min * 60
    if (min < 10) {
      min = '0' + String(min)
    } else {
      min = String(min)
    }
    if (subSeconds < 10) {
      subSeconds = '0' + String(subSeconds)
    } else {
      subSeconds = String(subSeconds)
    }
    return min + ':' + subSeconds + '.' + mill
  }

  // 导出歌词
  exportLyc = () => {
    let { audioFile, lycInfo, lycList } = this.state
    // console.log('audioFile:', audioFile)
    if (audioFile.name) {
      let lycFileName = audioFile.name.split('.')[0]
      let lycInfoKeys = Object.keys(lycInfo)
      let content = ''
      for (let key of lycInfoKeys) {
        content += '[' + key + ':' + lycInfo[key] + ']\n'
        if (key === 'ti' && lycInfo[key]) {
          lycFileName = lycInfo[key]
        }
      }

      for (let item of lycList) {
        if (item.time) {
          content += '[' + item.time + ']' + item.cont + '\n'
        }
      }
      this.download(lycFileName + '.lrc', content)
    } else {
      this.showMessage('音频文件不存在，请先上传音频', 'error')
    }
  }
  download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }




  render() {
    let { lycList, lycTextModalVisible, audioFile, currentIndex, audioLoad } = this.state

    return (
      <div className='lyc'>
        <Modal visible={lycTextModalVisible} title='粘贴歌词' onOk={this.lycTextModalOk} wrapClassName='lycModal' onCancel={this.closeLycModal}>
          {/* 实际测试中发现，歌曲信息，无法在歌词中显示 */}
          <div className='lyc-auth'>
            <div className='lyc-a-item'>
              <span>歌曲名:</span>
              <Input type='text' onChange={(e) => this.changeLycInfoName(e.target.value, 'ti')} placeholder='请输入歌曲名'></Input>
            </div>
            <div className='lyc-a-item'>
              <span>歌手名:</span>
              <Input type='text' onChange={(e) => this.changeLycInfoName(e.target.value, 'ar')} placeholder="请输入歌手名"></Input>
            </div>
            <div className='lyc-a-item'>
              <span>专辑名:</span>
              <Input type='text' onChange={(e) => this.changeLycInfoName(e.target.value, 'al')} placeholder="请输入专辑名"></Input>
            </div>
            <div className='lyc-a-item'>
              <span>制作者:</span>
              <Input type='text' onChange={(e) => this.changeLycInfoName(e.target.value, 'by')} placeholder="请输入制作者姓名"></Input>
            </div>
          </div>
          <div className='lyc-m-w'>
            <Input.TextArea onChange={this.lycTextChange} className='lycModalText' placeholder={textAreaPlaceholder}></Input.TextArea>
          </div>
        </Modal>
        <div className='lyc-header'>
          <div className='lyc-tool'>
            <div className='tools tools1'>
              <Button type='text' onClick={this.playAudio}>播放</Button>
              <Button type='text' onClick={this.stopAudio}>暂停</Button>
              <Button type='text' onClick={this.tagLyc}>打Tag</Button>
            </div>
            <div className='tools tools2'>
              <Button type='text' className='tools-upload-btn' >
                上传歌曲
                <input type='file' onChange={this.nativeUploadChange} className='tools-upload-input' accept='audio/*' />
              </Button>
              <Button type='text' onClick={this.showLycTextModal}>粘贴歌词</Button>
              <Button type='text' onClick={this.exportLyc}>导出歌词</Button>
            </div>
          </div>
          <div className='lyc-audio'>
            <div className='lyc-au-name'> {audioFile.name}</div>
            <div className='lyc-wave' id='lyc-wave'></div>
            {audioLoad === 'loading' ? <Spin></Spin> : ''}
          </div>
        </div>
        <div className='lyc-content' ref={this.lycContentRef}>
          <div className='lyc-item'>
            <div className='rows'>行数</div>
            <div className='time'>时间(分钟:秒.毫秒)</div>
            <div className='cont'>歌词</div>
            <div className='operation'>操作</div>
          </div>
          {
            lycList.map((lycObj, index) => {
              return (
                <div className={['lyc-item', currentIndex === index ? 'active' : ''].join(' ')} key={index} >
                  <div className='rows'>{index + 1}</div>
                  <div className='time'>

                    <div className='editCont' onDoubleClick={() => this.timeEleClick(lycObj, index)} onBlur={() => this.timeEleBlur(lycObj, index)} title='可双击修改'>
                      {
                        lycObj.startTimeReadOnly ? (
                          <span>{lycObj.time}</span>
                        ) : (
                          <Input value={lycObj.time} onChange={(e) => this.timeContChange(e.target.value, lycObj, index)} allowClear></Input>
                        )
                      }
                    </div>
                  </div>
                  <div className='cont'>
                    <div className='editCont2' onDoubleClick={() => this.contEleClick(lycObj, index)} onBlur={() => this.contEleBlur(lycObj, index)} title='可双击修改'>
                      {
                        lycObj.contReadOnly ? (
                          <span>{lycObj.cont}</span>
                        ) : (
                          <Input value={lycObj.cont} onChange={(e) => this.contEleChange(e.target.value, lycObj, index)} ></Input>
                        )
                      }
                    </div>

                  </div>
                  <div className='operation'>
                    <Button type='text' onClick={() => this.checkedRow(index)}>选中此行</Button>
                  </div>
                </div>
              )
            })
          }
        </div>
        {/* <div className='footer'>
          有事联系，v信:guo330504
        </div> */}
        <div className='side'>
          <img src={wxLogo} alt='微信：guo330504' title='微信：guo330504'></img>
        </div>
      </div>
    )
  }
}
export default Lyc