---
layout: post
title: Kali Linux安装及基础配置
category: 工具
tags: [Kali , Linux]
description: Kali Linux安装及基础配置
---
> 人生苦短，我用Kali！——俺

# 0x00 安装Kali
[Kali Linux][1]基于Debian Linux，旨在渗透测试及安全审计。
1. [下载官方镜像][2]
2. [制作USB启动盘][3]
3. [LVM安装系统][4]

# 0x01 LVM分区空间划分
1. 查看当前分区情况
```
root@kali:~# df -hl
```
> 
文件系统               容量  已用  可用 已用% 挂载点
rootfs                 9.1G  7.0G  1.7G   82% /
udev                    10M     0   10M    0% /dev
tmpfs                  783M  728K  782M    1% /run
/dev/mapper/kali-root  9.1G  7.0G  1.7G   82% /
tmpfs                  5.0M     0  5.0M    0% /run/lock
tmpfs                  1.6G  240K  1.6G    1% /run/shm
/dev/sda2              229M   29M  189M   13% /boot
/dev/sda1              487M  128K  486M    1% /boot/efi
/dev/mapper/kali-home  418G   71M  397G    1% /home
2. 卸载/home所在文件系统
```
root@kali:~# umount /dev/mapper/kali-home
```
3. 检测/home所在文件系统
```
root@kali:~# e2fsck -f /dev/mapper/kali-home
```
> 
e2fsck 1.42.5 (29-Jul-2012)
第一步: 检查inode,块,和大小
第二步: 检查目录结构
第3步: 检查目录连接性
Pass 4: Checking reference counts
第5步: 检查簇概要信息
/dev/mapper/kali-home: 11/27803648 files (0.0% non-contiguous), 1795740/111192064 blocks
4. 重新划分/home分区大小
```
root@kali:~# resize2fs /dev/mapper/kali-home 222G
```
> 
resize2fs 1.42.5 (29-Jul-2012)
Resizing the filesystem on /dev/mapper/kali-home to 58195968 (4k) blocks.
The filesystem on /dev/mapper/kali-home is now 58195968 blocks long.
5. 减少/home逻辑分区大小
```
root@kali:~# lvreduce -L 222G /dev/mapper/kali-home
```
>   
WARNING: Reducing active and open logical volume to 222.00 GiB
  THIS MAY DESTROY YOUR DATA (filesystem etc.)
Do you really want to reduce home? [y/n]: y
  Reducing logical volume home to 222.00 GiB
  Logical volume home successfully resized
6. 增加/逻辑分区大小
```
root@kali:~# lvresize -L +200G /dev/mapper/kali-root
```
>   
Extending logical volume root to 209.86 GiB
  Logical volume root successfully resized
7. 重新划分/分区大小
```
root@kali:~# resize2fs /dev/mapper/kali-root
```
> 
resize2fs 1.42.5 (29-Jul-2012)
Filesystem at /dev/mapper/kali-root is mounted on /; on-line resizing required
old_desc_blocks = 1, new_desc_blocks = 14
The filesystem on /dev/mapper/kali-root is now 55012352 blocks long.
8. 检测重新分区效果
```
root@kali:~# df -hl
```
> 
文件系统               容量  已用  可用 已用% 挂载点
rootfs                 207G  7.0G  191G    4% /
udev                    10M     0   10M    0% /dev
tmpfs                  783M  728K  782M    1% /run
/dev/mapper/kali-root  207G  7.0G  191G    4% /
tmpfs                  5.0M     0  5.0M    0% /run/lock
tmpfs                  1.6G  244K  1.6G    1% /run/shm
/dev/sda2              229M   29M  189M   13% /boot
/dev/sda1              487M  128K  486M    1% /boot/efi
/dev/mapper/kali-home  219G   60M  208G    1% /home

# 0x02 添加用户及权限
1. 创建新用户
```
root@kali:~# adduser yogy
```
> 
正在添加用户"yogy"...
正在添加新组"yogy" (1002)...
正在添加新用户"yogy" (1001) 到组"yogy"...
创建主目录"/home/yogy"...
正在从"/etc/skel"复制文件...
输入新的 UNIX 密码：
重新输入新的 UNIX 密码：
passwd：已成功更新密码
正在改变 yogy 的用户信息
请输入新值，或直接敲回车键以使用默认值
	全名 []: 
	房间号码 []: 
	工作电话 []: 
	家庭电话 []: 
	其它 []: 
这些信息是否正确？ [Y/n] y
2. 赋root权限
```
root@kali:~# sudo vim /etc/sudoers
```
> 
\# User privilege specification
root ALL=(ALL:ALL) ALL 
yogy ALL=(ALL:ALL) ALL
\# Allow members of group sudo to execute any command
%sudo ALL=(ALL:ALL) ALL

# 0x03 修改软件源更新
1. 添加Kali源
```
yogy@kali:~$ sudo vim /etc/apt/sources.list
```
> 
\#阿里源
deb http://mirrors.aliyun.com/kali kali main non-free contrib 
deb-src http://mirrors.aliyun.com/kali kali main non-free contrib
deb http://mirrors.aliyun.com/kali-security kali/updates main contrib non-free
deb http://mirror.nus.edu.sg/kali/kali/ kali main non-free contrib
\#新加坡源
deb-src http://mirror.nus.edu.sg/kali/kali/ kali main non-free contrib
deb http://mirror.nus.edu.sg/kali/kali-security kali/updates main contrib non-free
deb-src http://mirror.nus.edu.sg/kali/kali-security kali/updates main contrib non-free
\#debain源
deb http://mirrors.163.com/debian/ wheezy main contrib 
deb http://mirrors.163.com/debian/ wheezy-proposed-updates main contrib
deb-src http://mirrors.163.com/debian/ wheezy main contrib
deb-src http://mirrors.163.com/debian/ wheezy-proposed-updates main contrib
2. 更新软件
```
yogy@kali:~$ sudo apt-get update && sudo apt-get upgrade
```
> 
命中 http://mirrors.aliyun.com kali Release.gpg
命中 http://mirrors.163.com wheezy Release.gpg                                 
...
忽略 http://mirror.nus.edu.sg kali/updates/non-free Translation-en
下载 12.9 kB，耗时 1分 1秒 (210 B/s)
正在读取软件包列表... 完成
正在读取软件包列表... 完成
正在分析软件包的依赖关系树       
正在读取状态信息... 完成       
升级了 0 个软件包，新安装了 0 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。

# 0x04 修改时区UTC
1. 查看当前时间
```
yogy@kali:~$ date -R
```
> Sat, 10 Jul 2015 22:57:28 -0800
2. 选择时区
```
yogy@kali:~$ tzselect
```
>Please identify a location so that time zone rules can be set correctly.
Please select a continent or ocean.
...
 5) Asia
...
11) none - I want to specify the time zone using the Posix TZ format.
\#? 5
Please select a country.
...
 9) China		  26) Laos		    43) Taiwan
...
\#? 9 
Please select one of the following time zone regions.
1) Beijing Time
2) Xinjiang Time
\#? 1
The following information has been given:
	China
	Beijing Time
Therefore TZ='Asia/Shanghai' will be used.
Local time is now:	Tue Jul  7 04:10:17 CST 2015.
Universal Time is now:	Mon Jul  6 20:10:17 UTC 2015.
Is the above information OK?
1) Yes
2) No
\#? 1
You can make this change permanent for yourself by appending the line
	TZ='Asia/Shanghai'; export TZ
to the file '.profile' in your home directory; then log out and log in again.

3. 修改profile并生效
```
yogy@kali:~$ echo "TZ='Asia/Shanghai'; export TZ" >> ~/.profile
yogy@kali:~$ source ~/.profile
```
4. 验证效果
```
yogy@kali:~$ date -R
```
> Sat, 11 Jul 2015 14:57:28 +0800

# 0x05 配置GNOME 3
[GNOME 3][5]是新一代Linux桌面管理器，简洁优雅。
1. 开启GNOME 3模式
```
gsettings set org.gnome.desktop.session session-name gnome
```
2. 更换主题
  * 从[gnome-look][6]下载GTK 3.x主题，如[Gnome-Cupertino][7]
  * 解压至目录/usr/share/themes/
```
yogy@kali:~/Downloads$ tar -zxvf 147061-Gnome-Cupertino-2.1.5.tar.gz -C /usr/share/themes/
```
  * Advanced Settings -- 主题 -- GTK主题&&窗口主题
3. 添加插件
  * 从[gnome][8]下载插件
  * 移至目录~/.local/share/gnome-shell/extensions/
  * Advanced Settings -- Shell 扩展
  * [在线插件管理][9]

# 0x06 浏览器安装Flash插件
Kali自带的[Iceweasel][10]浏览器，是Mozilla Firefox的Debian再发布版。
1. 在[adobe][11]下载flash
2. 解压并移至指定文件夹
```
yogy@kali:~/Downloads$ tar -zxvf install_flash_player_11_linux.x86_64.tar.gz
yogy@kali:~/Downloads$ sudo cp libflashplayer.so /usr/lib/mozilla/plugins/
yogy@kali:~/Downloads$ cp -r ./usr/* /usr/
```
3. 管理插件
重启浏览器，在[插件管理][12]中启动Shockwave Flash

# 0x07 安装SCIM输入法
安装[SCIM][13]，实现汉语、日语、英语的三语输入。
1. 安装主程序
```
yogy@kali:~$ sudo apt-get install scim scim-gtk-immodule scim-modules-socket scim-modules-talbe
```
2. 添加汉语输入
  * 下载[scim-googlepinyin][14]
  * 解压并安装
```
yogy@kali:~/Downloads$ tar xzfv scim-googlepinyin.tar.gz
yogy@kali:~/Downloads$ cd scim-googlepinyin.tar.gz
yogy@kali:~/Downloads$ PKG_CONFIG_PATH=/usr/lib/pkgconfig
yogy@kali:~/Downloads$ ./autogen.sh
yogy@kali:~/Downloads$ make
yogy@kali:~/Downloads$ sudo make install
```
3. 添加日语输入
```
yogy@kali:~$ sudo apt-get install scim-tables-ja
```

#0x08 清理USB启动盘
1. 清理fstab
```
yogy@kali:~$ sudo gedit /etc/fstab
```
> 
\# 使用USB安装系统时生成，需将其注释以正常挂载
\# /dev/sdc1       /media/usb0     auto    rw,user,noauto  0       0 
\# /dev/sdc2       /media/usb1     auto    rw,user,noauto  0       0 
2. 格式化U盘
  * 卸载挂载点 
```
yogy@kali:~$ sudo umount /dev/sdd1
yogy@kali:~$ sudo umount /dev/sdd2
```
  * 完全格式化
```
yogy@kali:~$ sudo mkfs.vfat /dev/sdd1
yogy@kali:~$ sudo mkfs.vfat -I /dev/sdd
```

# 0x09 调节开机亮度
1. 安装laptop-mode-tools
```
yogy@kali:~$ apt-get install laptop-mode-tools
```
2. 查看亮度极值
```
yogy@kali:~$ sudo gedit /sys/class/backlight/intel_backlight/max_brightness
```
> 
4437

3. 配置LCD亮度控制
```
yogy@kali:~$ sudo gedit /etc/laptop-mode/conf.d/lcd-brightness.conf
```
> 
CONTROL_BRIGHTNESS=1
BATT_BRIGHTNESS_COMMAND="echo 2555"
LM_AC_BRIGHTNESS_COMMAND="echo 2555"
NOLM_AC_BRIGHTNESS_COMMAND="echo 2555"
\#BRIGHTNESS_OUTPUT="/proc/acpi/video/VID/LCD/brightness"
BRIGHTNESS_OUTPUT="/sys/class/backlight/intel_backlight/brightness"

# 0x0a 64位机安装Wine
1. 添加32位框架支持
```
yogy@kali:~$ sudo  dpkg --add-architecture i386
yogy@kali:~$ sudo  apt-get update
```
2. 安装32位Wine
```
yogy@kali:~$ sudo  apt-get install wine-bin:i386
```

# 0x0b 结束语
Kali系统基础配置完毕，可满足日常使用需求。常用开发软件的安装及配置将另开新篇，内容包括但不限于IDE，虚拟机，VPN，ns-3。

![Kali Linux](http://upload-images.jianshu.io/upload_images/177786-f82056787609e253.png)

***转载请注明出处***

[1]: http://www.kali.org/
[2]: https://www.kali.org/downloads/
[3]: http://docs.kali.org/downloading/kali-linux-live-usb-install
[4]: http://docs.kali.org/installation/kali-linux-encrypted-disk-install
[5]: https://www.gnome.org/
[6]: http://gnome-look.org/
[7]: http://gnome-look.org/content/show.php/Gnome+Cupertino?content=147061
[8]: https://extensions.gnome.org/
[9]: https://extensions.gnome.org/local/
[10]: https://wiki.debian.org/Iceweasel/
[11]: https://get.adobe.com/cn/flashplayer/
[12]: about:addons
[13]: https://wiki.ubuntu.com/InputMethods/SCIM/
[14]: http://download.csdn.net/download/lizhilun9/5244686
