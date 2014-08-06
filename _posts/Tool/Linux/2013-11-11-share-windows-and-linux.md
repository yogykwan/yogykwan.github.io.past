---
layout: post
title: 配置Windows和Linux双系统
category: 工具
tags: [Windows , Linux]
description: Windows和Linux共存
---

## 尝试和选择

一台机器使用Windows和Linux一般有以下几个方式：

- Windows和Linux真正的双系统，开机两个引导
- Linux下虚拟Windows（一般是xp）
- Windows下虚拟Linux

选择两个系统无非是因为工作原因，Linux下开发，Windows下娱乐或者Office等。出现这种矛盾实在是纠结，在尝试过上述三种方案以后，我选择了双系统，原因如下：

- Windows下的专业软件，Linux很难找到替代品
- 双系统分在双硬盘中，物尽其用，将Linux作为主系统
- Windows系统问题，虚拟出来的真的不好用
- Linux使用虚拟机，网络适配和驱动问题很多

## 配置

###安装Windows
使用U盘作为启动盘安装，我使用的是[Win8 Ghost][2]。Ghost系统不是很稳定，作为备用系统使用Office等常用软件却足够。

###安装Linux
使用USB Live安装，我选用的是[Kali Linux][1]。安装过程中唯一要注意/和/home的空间划分，/分区一定不能小。

###设置开机引导项
若先安装Windows后安装Linux，开机引导项应该已自动配好。如果步骤相反或是开机未见双系统选项，可手动修改boot.ini文件，或者使用EasyBCD软件配置。

## 总结

如果需要双系统，并且Linux作为主系统，Windows为辅助系统，我的方法适合你。

[1]: http://www.kali.org/
[2]: http://www.xitongcheng.com/win8/
