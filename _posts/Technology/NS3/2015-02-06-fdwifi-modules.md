---
layout: post
title: fdwifi详解
category: 技术
tags: NS3
keywords: NS3,fdwifi,FD 
description: 
---

## fdwifi模块
- 无线全双工通信模块
  - RFD（中继全双工）- [MAC](http://aurum.cs.inf.shizuoka.ac.jp/pdf/B137_tamaki.pdf)的实施
- 扩展WiFi模块
- 支持范围
  - IEEE 802.11
  - 路由协议如AODV，DSR
- 超出范围
  - IEEE 802.11标准外的
  - QoS控制
  - 数据包分割

## 无线全双工通讯
- 无线全双工通信是在同一时间、同一频带能够发送和接收的技术
- 如果在无线半双工通信的同时传输和接收
  - 朝向自身发送的比给另一个终端发送的无线电波功率更大
  - 不能在同一时间、同一频带发送或接收
- 无线全双工通讯
  - 从所接收的信号中除去已知的传输部分

## Full Duplex MAC
- 异步型
  - 首次传输和二次传输
  - 时钟无须同步
- 同步型
  - 同时两个发送
  - 时钟必须同步

![](http://upload-images.jianshu.io/upload_images/177786-ef0a407fb57666aa.png)

## 双向中继全双工通信
- 双向全双工通信
  - AP和节点A接收彼此的数据
  - 在首次传输的目的地指定节点的源节点作为发送辅助

  ![](http://upload-images.jianshu.io/upload_images/177786-c67a87db08206025.png)

- 中继全双工通信
  - 节点B从节点A处接收的信号，再发送给节点C
  - 在首次传输的源节点指定二次传输的源节点
  
![](http://upload-images.jianshu.io/upload_images/177786-6687981c0be44f1b.png)

## RFD-MAC概要
- 中继全双工通信MAC协议
  - 使用初级二次传播
  - 异步中继全双工通信
- 选择辅助的传输的源节点
  - 在相邻节点表的基础上，确定二次传输的源节点
  - 通过在MAC报头的address4中列入二次传输的源地址，通知发送给副传动系统的源节点
- 相邻节点表
  - 通过监听相邻节点的通信更新了相邻节点表
  - 三个表项
    - `Address`：MAC相邻节点的地址
    - `HasFrames`：含框架为1，否则为0
    - `NextHop`：是上游节点为1，否则为0

## 相邻节点表
- 二次传输源节点的选择
  - 没有节点B，节点C必须选择一个二次传输源节点的候选
![](http://upload-images.jianshu.io/upload_images/177786-8cdc9bb8ecac6144.png)

  - 节点A的相邻节点表：

|Node Address|HasFrames|NextHop|
|:--:|:--:|:--:|
|B|1|0|
|C|0|1|

- HasFrames
  - 在DATA和ACK传输时，把值分配给MAC报头的MoreData位
  - 如果能够发送数据则MoreData位为1，否则为0
- 优先顺序
  1. HasFrames=1 & NextHop=1
  2. HasFrames=1 & NextHop=0
  3. HasFrames=0 & NextHop=0
  4. HasFrames=0 & NextHop=1

## fdwifi模块的功能实现
- 全双工通信
  - 加入FD（全双工）状态作为新的状态
  - 在开始接收帧的时候，添加报头接收调度处理事件
  - 改变电源事件，以便能够计算出的报头和有效载荷的PER
  - 添加报头接收事件
  - 添加辅助传输功能
  - 在传输功能中添加Busytone的创建
- 相邻节点表
 - 在DATA、ACK传输时，设定MAC报头的MoreData位
 - 在数据接收期间，添加邻接节点表更新过程
 - 在二次传输的源节点，添加决策算法

## 加入FD（全双工）状态
- 半双工通信的状态转换

  ![](http://upload-images.jianshu.io/upload_images/177786-5a2a3ce9bfef2130.png)
- 全双工通信的状态转换

  ![](http://upload-images.jianshu.io/upload_images/177786-85e9e73710768319.png)

  - 首次传输和二次传输程序流图，二次传输从StartReceivePacket()开始

  ![](http://upload-images.jianshu.io/upload_images/177786-316633ff2b4c8891.png)

## 在开始接收帧的时候，添加报头接收调度处理事件
- YansWifiPhy::StartReceivePacket (packet, rxPowerDbm, txVector, preamble)
  - 规范：在分组接收开始时，添加头
    1. rxDuration计算：数据包大小，txVector，preamble接收时间的计算
    - 如果物理层是CCA_BUSY或空闲状态，且所接收的功率大于接收阈
      1. WifiPhyStateHelper的SwitchRx()更改呼叫状态
      2. **调用`EndReceiveHeader (packet, eventHdr)`**
      3. 调用`EndReceive (packet, event)`

![](http://upload-images.jianshu.io/upload_images/177786-772c0385a6ef15f6.png)

## 改变电源事件，以便能够计算出的报头和有效载荷的PER
- YansWifiPhy::StartReceivePacket (packet, rxPowerDbm, txVector, preamble)
  - 规范：在分组接收开始时，添加头
    1. rxDuration计算：数据包大小，txVector，preamble接收时间的计算
    - **InterferenceHelper接收Header时添加HeaderEvent**
    - **InterferenceHelper接收Payload时添加payloadEvent**
    - 如果物理层是CCA_BUSY或空闲状态，且所接收的功率大于接收阈
      1. `WifiPhyStateHelper的SwitchRx()`更改呼叫状态
      2. **调用`EndReceiveHeader (packet, eventHdr)`**
      3. 调用`EndReceive (packet, event)`

![](http://upload-images.jianshu.io/upload_images/177786-1bdfec2366c79fcb.png)

## 添加报头接收事件
### 整体概述
- 处理不同的接收节点
  - 所有节点共有
    - 从每个接收的分组的PER计算前导码，头长度，接收功率，调制方式等
  - 如果接收到二次传输的源节点
    - 如果可以发送状态，开始Busytone或二次传输
  - 如果接收到首次传输的源节点
    - 当首次传输的时间短，通过比较首次和二次传输装置的结束时发送延伸于首次传输的传输时间
  - 如果已经接收其它节点
    - 无

### 二次传输orBusytone

![](http://upload-images.jianshu.io/upload_images/177786-347e62602f8cb68c.png)

### 二次/Busytone传输的条件
- 二次/Busytone传输发生的条件

|MAC层状态|主发送|二次/Busytone传输|
|:--:|:--:|:--:|
|IDLE|○|○|
|发送|×|×|
|接收|×|○|
|载波监听|×|○|
|Backoff等待|×|○|
|AckTimeout等待|×|×|
|CTS回信等待|×|×|

- 二次/Busytone传输的选择

|DcaTxop队列为空|DcaTxop的M_currentPacket为0|二次/Busytone传输|
|:--:|:--:|:--:|
|×|○|二次|
|○|×|二次|
|○|○|Busytone|

### 辅助源节点的发送接收
- YansWifiPhy::EndReceiveHeader (packet, event)
  - 规范：该过程发生在接收首部的时候
    1. 基于event通过计算SNR和PSR做接收决定
    - 如果SecondaryTag不被添加到该分组（接收首次传输）
      1. 如果你拥有指定MAC头的address4时（指定二次传输源）
        1. 调用`DcfTxop::NotifySecondaryTransmissionRequested()`或`YansWifiPhy::SendBusyTone()`
  - 导出`DcfTxop::NotifySecondaryTransmissionRequested()`

  ![](http://upload-images.jianshu.io/upload_images/177786-e2e4ae422562aa8e.png)

- DcfTxop::NotifySecondaryTransmissionRequested()
  - 规格：判断或二次传输是否可能发生，如果可能则发送
    1. 如果m_currentPacket存在或队列不为空
      1. m_accessRequested为true
      2. 满足二次传输的发生条件
        1. 调用`SecondaryTransmissionGranted()`

  ![](http://upload-images.jianshu.io/upload_images/177786-34a73a277e98e549.png)

- DcfTxop::SecondaryTransmissionGranted()
※ 伴随`NotiryAccessGranted()`
  - 规范：产生MAC层的参数，并将该分组交给MacLow
    1. 指定数据包m_currentPacket
    - MacLow Transmission Parameter param生成（RTS，ACK输入信息是否存在）
    - 调用`MacLow::StartSecondaryTransmission (m_currentPacket, &m_currentHdr, params, m_transmissionListener)`
  - 导出`MacLow::StartSecondaryTransmission (packet, hdr, params, listener)`

  ![](http://upload-images.jianshu.io/upload_images/177786-3c992d2b831fcbe3.png)

- MacLow::StartSecondaryTransmission (packet, hddr,params, listener) 
※ 伴随S`tartTransmission (packet, hdr, params, listener)`
  - 参数
    - packet：发送包
    - hdr：传输头
    - params：MAC参数（用于DATA，ACK，RTS，CTS的判断）
    - listener：监听DcaTxop（它用于通知超时ACK和CTS）
  - 规范：注册参数的成员变量
    1. 注册的参数中的成员变量所给出的变量
    - 调用`SendSecondaryDataPacket()`

  ![](http://upload-images.jianshu.io/upload_images/177786-07c529cb7fcbe037.png)

- MacLow:: SendSecondaryDataPacket ()
※`SendDataPacket()`函数添加额外的SecondaryTag和busytone
  - 规范：将通过建立二次传输的数据包发送到物理层
    1. 处理类似`SendDataPacket()`函数（略）
    - 加入SecondaryTag到m_currentPacket（用于确定在首标接收时二次传输）
    - 加入BusytoneTag到m_currentPacket（和用于修改数据尺寸）
    - 调用`ForwardDown (m_currentPacket, m_currentHdr, dataTxVector, preamble)`
  - 导出`ForwardDown()`，该功能用于处理数据传输的wifi模式

  ![](http://upload-images.jianshu.io/upload_images/177786-b1325325dfca312d.png)

#### MacLow发送
- MacLow::ForwardDown (packe, hdr, txVector, preamble)
  - 规范：调用物理层的`SendPacket()`函数
    1. 调用物理层的`SendPacket (packet, txVector.GetMode(), preamble, txVector)`
  - 导出`YansWifiPhy::SendPacket (packet, hdr, txMode, preamble, txVector)`

  ![](http://upload-images.jianshu.io/upload_images/177786-8018c27ccb64a77c.png)

#### YansWifiPhy发送
- YansWifiPhy::SendPacket (packe, hdr, txMode, preamble, txVector)
  - 参数
    - txMode：具有带宽，编码率，调制方案的信息
  - 规范：改变WifiPhyStateHelper的状态，调用通道类的Send()函数
    1. 调用`WifiPhyStateHelper::SwitchTx()`函数改变状态
    - 调用通道类的`Send (this, packet, GetPowerDbm (txVector.GetTxPowerLevel())+m_txGainDb, txVector, preamble)`，其中m_txGainDb为发送增益
  - 导出`YansWifiChannel::Send (sender, packet, txPowerDbm, txVector, preamble)`

  ![](http://upload-images.jianshu.io/upload_images/177786-4bae46212c634198.png)

#### YansWifiChannel发送
- YansWifiChannel::Send (sender, packet, txPowerDbm, txVector, preamble)
  - 参数
    - txPowerDbm：发送功率
  - 规范：在调用`Receive()`函数计算结果的基础上，计算调度延迟和传播损耗
    1. 获取senderMobility：获得从发送者的移动性信息（位置信息等）
    - 获取receiverMobility：获取所述接收节点的移动性信息
    - 延迟从获取的移动信息（delay），并计算所接收的功率（rxPowerDbm）
    - 传播延迟后调用`Receive（接收在传输的一个共同的索引，分组，rxPowerDbm, txVector, preamble）`

  ![](http://upload-images.jianshu.io/upload_images/177786-a89974252885e880.png)

#### YansWifiChannel接收
- YansWifiChannel::Receive (i, packet, rxPowerDbm, txVector, preamble)
  - 规范：物理层的接收处理
  - 采用通用的数i调用`StartReceivePacket (packet, rxPowerDbm, txVector, preamble)`
  - 导出`YansWifiPhy::StartReceivePacket (packet, rxPowerDbm, txVector, preamble)`

  ![](http://upload-images.jianshu.io/upload_images/177786-da6399988982b361.png)

- YansWifiPhy::StartReceivePacket (packet, rxPowerDbm, txVector, preamble)
  - 规范：在分组接收开始时，添加头
    1. rxDuration计算：数据包大小，txVector，preamble接收时间的计算
    - **InterferenceHelper接收Header时添加eventHrd**
    - **InterferenceHelper接收Payload时添加event**
    - 如果物理层是CCA_BUSY或空闲状态，且所接收的功率大于接收阈
      1. `WifiPhyStateHelper的SwitchRx()`更改呼叫状态
      2. **调用`EndReceiveHeader (packet, eventHdr)`**
      3. 调用`EndReceive (packet, event)`
  ![](http://upload-images.jianshu.io/upload_images/177786-6f192e4df8752dbd.png)

- YansWifiPhy::EndReceiveHeader (packet, event)
  - 规范：该过程发生在接收首部的时候
    1. 基于event通过计算SNR和PSR做接收决定
    - 如果SecondaryTag被添加到分组（接收二次传输）
      1. 如果本身是在MAC报头中的address4中指定
        1. 如果首次传输的结束时间<二次传输的结束时间
          1. 根据二次传输的结束时间改变首次传输的端对端
          2. 为了改变所述节点的接收时间被首次传输接收，调用`YansWifiChannel::NotifyPostponeSend(sender, packet, powerDbm, txVector, preamble, rxEndTime)`

  ![](http://upload-images.jianshu.io/upload_images/177786-6f7f547e1e7cace8.png)

## 通知邻接节点首次传输的延迟
- YansWifiChannel::NotifyPostponeSend (sender, packet, txVector, preamble, rxEndTime)
  - 规范：该通知重新调度到接收节点一
    1. 以当前时刻调用`YansWifiPhy::NotifyChangeEndRecieve（接收公共指数在传输，数据包，txVector，preamble，rxEndTime+delay）`

  ![](http://upload-images.jianshu.io/upload_images/177786-3ef171c3a23ecc35.png)

- YansWifiChannel::NotifyChangeEndRecieve (i, packet, txVector, preamble, rxEndTime)
  - 规范：
    1. 使用共同参数i调用`YansWifiPhy::NotifyChangeEndReceive (I,packet,txVector,preamble,rxEndTime)`
  - 导出`YansWifiPhy::NotifyChangeEndReceive (i, packet, txVector, preamble, rxEndTime)`

  ![](http://upload-images.jianshu.io/upload_images/177786-846923413d00b2e3.png)

- YansWifiPhy::NotifyChangeEndRecieve (packet, txVector, preamble, rxEndTime)
  - 规范：EndReceive()函数的延迟处理
    1. `EndReceive(packet, event)`取消调用
    - 定期调用`EndReceive(packet, event)`生成rxEndTime
    - 调用`EndReceive()`函数及返回的ACK为wifi模块

  ![](http://upload-images.jianshu.io/upload_images/177786-1c91b2c012512b3e.png)

## 物理层Busytone创建和发送
- YansWifiPhy::SendBusyTone (packet, txVector)
  - 参数
    - packet：接收包
    - txVector：接收的txVector
  - 规范：生成并发送数据包只Busytone
    1. 创建busytoneHdr：指定WIFI_MAC_CTL_BUSY的头型
    - 创建ownTxVector：dammyPacket（临时创建数据包）和busytoneHdr的生成
    - 寻求pktSize：计算Busytone的大小将要发送的分组的大小
    -  busytone分组生成：从pktSize产生busytone分组，并添加busytoneHdr和FCS
    - 生成一个preamble：设置WIFI_PREAMBLE_LONG
    - `SendPacket (busytone, ownTxVecotr.GetMode(), preamble, ownTxVector)`发送调用
    - busytone计算的DataSize，以匹配主传输的传输结束时间

|[Byte]busytone包|PLCP前言|PLCP头|IEEE 802.11头|DATA|FCS|
|:--|:--:|:--:|:--:|:--:|
|[Byte]IEEE 802.11头|FC|Duration：0|Adress1发送元|||
|Type & SubType|Type：01|SubType：0110|||||

## 在DATA、ACK传输时，设定MAC报头的MoreData位
- SendDataPacket (), SendSecondaryDataPacket(), SendAckAfterData (...)实现以下功能
		if（DcaTxop的队列不为空）
			MAC报头MOREDATA位=1
		else 
	        MAC报头的MOREDATA位= 0

## 在数据接收期间，添加邻接节点表更新过程
- ReceiveOk（...）添加以下功能
		if(收到Data帧)
		    if(它自己的地址，目标地址) NextHop=0         //a --> B     c
		    else NextHop=1                            //A     b --> c
		    HasFrames = mac头的MoraData
		    更新相邻节点表，接收地址，Nexthop，HasFrames的基本信息
		if(收到ACK帧)
		    if(它自己的地址，目标地址) NextHop=1        //a      B <-- c
		    HasFrames = mac头的MoraData
    	    更新相邻节点表，接收地址，Nexthop，HasFrames的基本信息

## 在二次传输的源节点，添加决策算法
- SendDataPacket()功能
		MAC头的address4 = SelectSecondaryTransmissionNode ()
		SelectSecondaryTransmissionNode ()//邻接表中的MoreData，HasFrames是基于Priority[4]的排列，Priority[0]最高，Priority[3]最低
			if(Priority[0]>0) 
			    返回address随机从Priority[0]中选
			if(Priority[1]>0) 
			    返回address随机从Priority[1]中选
			if(Priority[2]>0) 
			    返回address随机从Priority[2]中选
			if(Priority[3]>0) 
			    返回address随机从Priority[3]中选
            else 
			    返回全局地址(ff:ff:ff:ff:ff:ff)
- SendSecondaryDataPacket ()功能
        MAC报头的address4=源节点的地址