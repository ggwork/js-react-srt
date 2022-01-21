import React, { createRef } from 'react';
import './audioSrt.scss'
import { Button, Input, message, Modal, Spin } from 'antd'



let textAreaPlaceholder = `上面填写的歌曲信息，实际在播放歌曲的时候并不显示。
如果想在歌词中显示歌曲信息，请将歌曲信息放在歌词里。如：
你的答案
词:林晨阳/刘涛
编曲:谭侃侃
演唱:阿冗
……
然后点击播放，在你觉得合适的时间，给这些信息打上tag即可。
tips：当上一句唱完时，立即为下一句歌词打tag，显示效果会比较好一点
`
class Srt extends React.Component {
  constructor(props) {
    super(props)
    this.srtContentRef = createRef(null)
    this.state = {
      messageVisible: false,
      srtTextModalVisible: false,
      srtTextContent: '',
      srtList: [
        {
          startTime: '00:00:00,000',
          endTime: '00:00:00,200',
          cont: '1.点击“上传音频”上传音频',
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
          cont: '3.点击"播放"，播放音频后，点击"开始tag/结束Tag"可在红色底（选中状态）一栏打上时间点,开始tag是字幕开始的时间，结束tag是字幕结束的时间',
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
      audioFile: {},
      currentIndex: 0,
      startTimeOffset: '200',
      stoInputReadOnly: true,
      audioLoad: '',
      wavesurfer: null,
    }
  }

  componentDidMount() {
    // eslint-disable-next-line
    var wavesurfer = WaveSurfer.create({
      container: '#lyc-wave',
      waveColor: 'violet',
      height: '90',
      barWidth: 2,
    });
    this.setState({
      wavesurfer
    })
  }

  startTimeEleClick = (srtObj, index) => {
    this.resetReadOnly()
    srtObj.startTimeReadOnly = false
    this.replaceSrtList(srtObj, index)
  }
  endTimeEleClick = (srtObj, index) => {
    this.resetReadOnly()
    srtObj.endTimeReadOnly = false
    this.replaceSrtList(srtObj, index)
  }

  timeEleBlur = (srtObj, index) => {
    // console.log('timeEleBlur:', index)
    srtObj.startTimeReadOnly = true
    this.replaceSrtList(srtObj, index)
  }
  timeContChange = (label, value, srtObj, index) => {
    // console.log('value:', value)
    // 数据格式
    let timeReg = /^[0-2]{0,1}[0-9]{0,1}:[0-5]{0,1}[0-9]{0,1}:[0-5]{0,1}[0-9]{0,1},\d{0,3}$/
    if (timeReg.test(value)) {
      srtObj[label] = value
      this.replaceSrtList(srtObj, index)
    } else if (value === '') {
      // 点击了清除键
      srtObj[label] = ''
      this.replaceSrtList(srtObj, index)
    }
  }
  // 内容的编辑
  contEleClick = (srtObj, index) => {
    this.resetReadOnly()
    srtObj.contReadOnly = false
    this.replaceSrtList(srtObj, index)
  }


  contEleBlur = (srtObj, index) => {
    srtObj.contReadOnly = true
    this.replaceSrtList(srtObj, index)
  }
  contEleChange = (value, srtObj, index) => {
    srtObj.cont = value
    this.replaceSrtList(srtObj, index)
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
    let srtList = this.state.srtList
    srtList.forEach(item => {
      item.startTimeReadOnly = true
      item.endTimeReadOnly = true
      item.contReadOnly = true
    })
    this.setState({
      srtList,
      stoInputReadOnly: true
    })
  }

  replaceSrtList = (srtObj, index) => {
    let srtList = this.state.srtList
    srtList.splice(index, 1, srtObj)
    this.setState({
      srtList: srtList
    })
  }

  srtTextModalOk = () => {
    this.setState({
      srtTextModalVisible: false
    })
    let srtTextContent = this.state.srtTextContent
    let srtTextArr = srtTextContent.split(/(?:\r*\n)+/g)
    let srtList = srtTextArr.map(item => {
      // 去掉前后空格
      let srt = item.replace(/^\s*|\s*$/g, '')
      return {
        time: '',
        cont: srt,
        startTimeReadOnly: true,
        contReadOnly: true
      }
    })
    this.setState({
      srtList
    })


  }
  srtTextChange = (e) => {
    // this.srtTextContent = e.target.value
    this.setState({
      srtTextContent: e.target.value.replace(/^\s*|\s*$/g, '')
    })

  }
  showSrtTextModal = () => {
    this.setState({
      srtTextModalVisible: true
    })
  }
  closeModal = () => {
    this.setState({
      srtTextModalVisible: false
    })
  }



  nativeUploadChange = (e) => {
    let file = e.target.files[0]
    let audioUrl = URL.createObjectURL(file)
    console.log('file:', file)
    console.log('audioUrl:', audioUrl)
    this.setState({
      audioFile: file,
      audioUrl,
      audioLoad: 'loading'
    })
    // 显示波形图
    let { wavesurfer } = this.state
    console.log('wavesurfer:', wavesurfer)
    wavesurfer.load(audioUrl)
    wavesurfer.on('ready', (res) => {
      console.log('ready')
      this.showMessage('上传成功', 'success')
      this.setState({
        audioLoad: true
      })
    })
  }

  checkedRow = (index) => {
    this.setState({
      currentIndex: index
    })
  }

  tagSrtStart = () => {
    let { startTimeOffset = 0 } = this.state
    // 获取player
    let player = this.player.current.getState().player
    // console.log('this.player:', this.player.current)
    // window.player = this.player
    let { currentIndex, srtList } = this.state
    let currentTime = player.currentTime
    let stoSecond = startTimeOffset / 1000
    if (currentTime > stoSecond) {
      currentTime = currentTime - stoSecond
    }
    // console.log('player.currentTime:', player.currentTime)
    // console.log('startTimeOffset:', startTimeOffset)
    let newTime = this.formatTime(currentTime)
    let srtObj = srtList[currentIndex]
    srtObj.startTime = newTime
    this.replaceSrtList(srtObj, currentIndex)

  }

  tagSrtEnd = () => {
    // 获取player
    let player = this.player.current.getState().player
    // console.log('this.player:', this.player.current)
    // window.player = this.player
    let { currentIndex, srtList } = this.state
    let currentTime = player.currentTime
    let newTime = this.formatTime(currentTime)
    let srtObj = srtList[currentIndex]
    srtObj.endTime = newTime
    this.replaceSrtList(srtObj, currentIndex)
    if (currentIndex < srtList.length) {
      currentIndex += 1
      // 滚动滚动条
      if (currentIndex > 3) {
        this.srtContentRef.current.scrollTop = (currentIndex - 3) * 60
      }
      this.setState({
        currentIndex
      })
    }
  }

  formatTime = (secNum) => {
    // 2.981333333333333
    let totalSeconds = Math.floor(secNum)
    let mill = Math.floor((secNum - totalSeconds) * 100)  // 毫秒
    let hour = Math.floor(totalSeconds / 3600)
    let min = Math.floor((totalSeconds - hour * 3600) / 60) // 分钟
    // 减去小时数和分钟数剩余的秒杀
    let seconds = totalSeconds - hour * 3600 - min * 60
    if (hour < 10) {
      hour = '0' + String(hour)
    } else {
      hour = String(hour)
    }
    if (min < 10) {
      min = '0' + String(min)
    } else {
      min = String(min)
    }
    if (seconds < 10) {
      seconds = '0' + String(seconds)
    } else {
      seconds = String(seconds)
    }
    return hour + ':' + min + ':' + seconds + ',' + mill
  }

  // 导出歌词
  exportSrt = () => {
    let { audioFile, srtList } = this.state
    // console.log('audioFile:', audioFile)
    if (audioFile.name) {
      let srtFileName = audioFile.name.split('.')[0]
      let content = ''
      for (let i = 0; i < srtList.length; i++) {
        let item = srtList[i]

        if (item.startTime && item.endTime) {
          content += (i + 1) + '\n'
          content += item.startTime + ' --> ' + item.endTime + '\n'
          let contArr = item.cont.split(/,|，/g)
          content += contArr[0] + '\n'
          if (contArr[1]) {
            content += contArr[1] + '\n'
          }
          // 多添加一个空行
          content += '\n'
        } else {
          // this.showMessage(`第{i}行的开始时间和结束时间不能为空`, 'error')
        }
      }
      this.download(srtFileName + '.srt', content)
    } else {
      this.showMessage('视频文件不存在，请先上传视频', 'error')
    }
  }
  download = (filename, text) => {
    let blob = new Blob([text], { type: 'text/plain,charset=utf-8' })
    let bUrl = window.URL.createObjectURL(blob)
    let element = document.createElement('a');
    element.setAttribute('href', bUrl);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  editableStoInput = () => {
    console.log('editableStoInput')
    this.setState({
      stoInputReadOnly: false
    })
  }
  disEditableStoInput = () => {
    console.log('disEditableStoInput')
    this.setState({
      stoInputReadOnly: true
    })
  }
  changeStoInputValue = (e) => {
    let value = e.target.value
    if (/^\d*$/.test(value)) {
      this.setState({
        startTimeOffset: value
      })
    } else if (value === '') {
      this.setState({
        startTimeOffset: 0
      })
    } else {
      this.showMessage('格式不对，必须是数字', 'error')
      this.setState({
        audioUrl: ''
      })
    }

  }


  playAudio = () => {
    this.state.wavesurfer.play()

  }
  stopAudio = () => {
    this.state.wavesurfer.pause()
    // this.showMessage('您还没有上传音乐', 'error')
  }

  render() {
    let { srtList, srtTextModalVisible, currentIndex, startTimeOffset, stoInputReadOnly, audioLoad, audioFile } = this.state
    return (
      <div className='vs-main'>
        <Modal visible={srtTextModalVisible} title='粘贴台词' onOk={this.srtTextModalOk} wrapClassName='srtModal' onCancel={this.closeModal}>
          <div className='srt-m-w'>
            <Input.TextArea onChange={this.srtTextChange} className='srtModalText' placeholder={textAreaPlaceholder}></Input.TextArea>
          </div>
        </Modal>

        <div className='lyc-header'>
          <div className='lyc-tool'>
            <div className='tools tools1'>
              <Button type='text' onClick={this.playAudio}>播放</Button>
              <Button type='text' onClick={this.stopAudio}>暂停</Button>
              <Button type='text' onClick={this.exportSrt}>打Tag</Button>
            </div>
            <div className='lyc-au-name'> {audioFile.name}</div>
            <div className='tools tools2'>
              <Button type='text' className='tools-upload-btn' >
                上传音频
                <input type='file' onChange={this.nativeUploadChange} className='tools-upload-input' accept='audio/*' />
              </Button>
              <Button type='text' onClick={this.showLycTextModal}>粘贴台词</Button>
              <Button type='text' onClick={this.exportLyc}>导出字幕</Button>
            </div>
          </div>
          <div className='lyc-audio'>

            <div className='lyc-wave' id='lyc-wave'></div>
            {audioLoad === 'loading' ? <Spin></Spin> : ''}
          </div>
        </div>

        <div className='m-srt'>
          <div className='tip'>
            <div className='t-start-time'>
              <span>开始时间提前量：</span>
              {
                stoInputReadOnly ? (<span title='双击可以修改' onDoubleClick={this.editableStoInput}>{startTimeOffset + 'ms'}</span>) : (
                  <Input value={startTimeOffset} addonAfter="ms" readOnly={stoInputReadOnly} onChange={this.changeStoInputValue} onBlur={this.disEditableStoInput}></Input>
                )
              }
            </div>
            <div className='t-cont'>
              <span>tips:</span>
              当听到声音时再打tag，会导致字幕出现时间晚于演员说话时间。因此设置了“开始时间提前量”，默认200ms，双击可以修改。当打tag时，会把获取到时间减去“开始时间提前量”作为字幕开始的时间。使字幕出现时间早于演员说话时间。
            </div>
          </div>

          <div className='srt-content' ref={this.srtContentRef}>
            <div className='srt-item'>
              <div className='rows'>行数</div>
              <div className='time'>开始时间</div>
              <div className='time'>结束时间</div>
              <div className='cont'>台词</div>
              <div className='operation'>操作</div>
            </div>
            {
              srtList.map((srtObj, index) => {
                return (
                  <div className={['srt-item', currentIndex === index ? 'active' : ''].join(' ')} key={index} >
                    <div className='rows'>{index + 1}</div>
                    <div className='time'>

                      <div className='editCont' onDoubleClick={() => this.startTimeEleClick(srtObj, index)} onBlur={() => this.timeEleBlur(srtObj, index)} title='可双击修改'>
                        {
                          srtObj.startTimeReadOnly ? (
                            <span>{srtObj.startTime}</span>
                          ) : (
                            <Input value={srtObj.startTime} onChange={(e) => this.timeContChange('startTime', e.target.value, srtObj, index)} allowClear></Input>
                          )
                        }
                      </div>
                    </div>
                    <div className='time'>
                      <div className='editCont' onDoubleClick={() => this.endTimeEleClick(srtObj, index)} onBlur={() => this.timeEleBlur(srtObj, index)} title='可双击修改'>
                        {
                          srtObj.startTimeReadOnly ? (
                            <span>{srtObj.endTime}</span>
                          ) : (
                            <Input value={srtObj.endTime} onChange={(e) => this.timeContChange('endTime', e.target.value, srtObj, index)} allowClear></Input>
                          )
                        }
                      </div>
                    </div>
                    <div className='cont'>
                      <div className='editCont2' onDoubleClick={() => this.contEleClick(srtObj, index)} onBlur={() => this.contEleBlur(srtObj, index)} title='可双击修改'>
                        {
                          srtObj.contReadOnly ? (
                            <span>{srtObj.cont}</span>
                          ) : (
                            <Input value={srtObj.cont} onChange={(e) => this.contEleChange(e.target.value, srtObj, index)} ></Input>
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
        </div>
      </div>
    )
  }
}

export default Srt