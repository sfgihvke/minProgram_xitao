let md5 = require('./utils/md5.js')
let uuid = require('./utils/uuid.js')
let formart = require('./utils/util.js')

App({

    visitorId: '',
    onLaunch: function(options) {
        // 课程分类
        wx.setStorageSync('classId', 0)


        // 登录
        wx.login({
            success: res => {
                // console.log('res',res)
                this.userCode = res.code;
            }
        })
        // 获取用户授权信息
    },
    // 小程序版本及功能选项
    funcOpt:'',
    config: null,
    //获取ext.json文件内容
    getExtConfig: function() {
        if (this.config === null) {
            this.config = wx.getExtConfigSync();
        }
        return this.config;
    },

    globalData: {
        userInfo: null,
        lessonClassName: '课程筛选',
        lessonClassData: null,
    },
    dev: false,
    // 视频投票  我的海报
    getImageHost:function(){
        let online = "https://www.zhihuizhaosheng.com/" ;
        let dev = "http://192.168.2.199:8123/";
        return online;
    },
    getHost: () => {
        var online = "https://www.zhihuizhaosheng.com/" + getApp().getExtConfig().version + "/";
        var dev = "http://192.168.2.199:8123/" + getApp().getExtConfig().version + "/";
        return dev;
    },
    hasLogin: wx.getStorageSync('hasLogin'), //默认app是未登录状态
    isLogin: true,
    // 请求数据方法
    request: param => {
        var host = getApp().getHost();

        var data = param.data || {};
        var success = param.success || function() {};
        var url = param.url || "";
        url = host + url;
        var method = param.method || "GET";
        method = method.toUpperCase();

        var header = {};
        var cookie = wx.getStorageSync('cookie');
        if (cookie) {
            header.Cookie = cookie;
        }
        if (method == "POST") {
            header["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if (param.url == "login") {
            return
        }
        var othis = this;
        if (getApp().hasLogin == '1') {
            console.log('url', url)
            console.log('data', data)
            //直接执行请求
            wx.request({
                url: url,
                data: data,
                method: method,
                header: header,
                'success': r => {
                    if (r.header["Set-Cookie"]) {
                        wx.setStorageSync('cookie', r.header["Set-Cookie"]);
                    }

                    /**
                     * 放开此初始，同时注释掉110行，可以：
                     * 1 统一处理错误信息，每个请求都会少些处理错误代码
                     * 2 避免不优雅的res.data.data写法，对象嵌套过深，容易犯错
                     */
                    // if(r.data.code == 0){
                    //   wx.showModal({
                    //     title: '错误提示',
                    //     content: r.data.msg,
                    //   })
                    // }else{
                    //   success(r.data)
                    // }

                    success(r);
                }
            });
        } else {
            wx.login({
                success: res => {
                    if (res.errMsg != "login:ok") {
                        wx.showModal({
                            title: '错误提示',
                            content: res.errMsg,
                        })
                        return
                        } else {
                    }
                    wx.request({
                        'url': host + "login",
                        'data': {
                            "code": res.code,
                            "org_id": getApp().getExtConfig().orgId
                        },
                        'method': "POST",
                        'header': header,
                        'success': r => {
                            if (r.data.code == 0) {
                                wx.showModal({
                                    title: '提示',
                                    content: r.data.msg,
                                })
                            } else {
                                // 获取小程序版本
                                getApp().funcOpt = r.data.data;
                                wx.setStorageSync('funcOpt', r.data.data)
                                wx.setStorageSync('visitorId', r.data.data.visitor_id);
                                wx.setStorageSync('avarImage', r.data.data.avatar_url);
                                wx.setStorageSync('nickname', r.data.data.nickname);
                                if (r.data.data.is_default_avatar_url){
                                    wx.getUserInfo({
                                        success: res => {
                                            // 可以将 res 发送给后台解码出 unionId
                                            getApp().globalData.userInfo = res.userInfo;
                                            let sendData = {};
                                            sendData['nickname'] = res.userInfo.nickName
                                            sendData['avatar_url'] = res.userInfo.avatarUrl
                                            sendData['province'] = res.userInfo.province
                                            sendData['city'] = res.userInfo.city
                                            sendData['country'] = res.userInfo.country
                                            sendData['language'] = res.userInfo.language
                                            sendData['gender'] = res.userInfo.gender
                                            getApp().request({
                                                url: 'set_user_info',
                                                data: sendData,
                                                method: 'post',
                                                success: function (res) {
                                                }
                                            })
                                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                            // 所以此处加入 callback 以防止这种情况
                                            if (getApp().userInfoReadyCallback) {
                                                getApp().userInfoReadyCallback(res)
                                            }
                                        }
                                    })
                                }
                                if (r.header["Set-Cookie"]) {
                                    wx.setStorageSync('cookie', r.header["Set-Cookie"]);
                                }
                                wx.setStorageSync('hasLogin', '1');
                                getApp().hasLogin = wx.getStorageSync('hasLogin'),
                                getApp().isLogin = true,

                                    //然后执行请求
                                    getApp().request(param)
                            }
                        },
                    })
                }
            })
        }
    },
    //地图 
    map: function(latitude, longitude, name, address) {
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: name,
            address: address,
        })
    },
    //拨打电话
    tellPhone: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phonenum,
        })
    },
    //进入首页
    toIndex: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    //随机数
    randomNum: function() {
        return Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
    },
    showToast: function(msg) {
        wx.showToast({
            title: msg,
            icon: 'none',
            mask: true,
        })
    },
    // 删除活动
    delActive: function(actId, actTag, url) {
        getApp().request({
            url: 'org/delete_act',
            data: {
                act_id: actId,
                act_tag: actTag
            },
            method: 'post',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        mask: true,
                    })
                    wx.navigateTo({
                        url: url,
                    })
                }
            }
        })
    },
    // 获取二维码
    getEncodeImage: function(url, mzy) {
        return 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
    },
    // 生成图片地址
    imageAddress: function(name) {
        return md5.hexMD5(new Date().getTime() + name + uuid.uuid());
    },
    //上传图片
    uploadFile: function(obj, header) {

        let url = getApp().getHost() + obj.url;
        let filePath = obj.filePath;
        let success = obj.success;

        wx.uploadFile({
            url: url,
            filePath: filePath,
            name: 'file',
            header: header,
            success: function(res) {
                let respons = JSON.parse(res.data);
                if (Number(respons.code) == 1) {
                    success(respons)
                }
            }
        })
    },
    //七天日历
    sevenDay: function(date, arr) {
        let toDay = date;
        let currentDataArr = [];

        for (let i = 0; i < 7; i++) {

            let index = i - 3;

            let listArr = {
                'day': toDay,
                'timeString': toDay.timeString + 86400000 * index
            };

            currentDataArr.push(formart.dateWeek(new Date(listArr.timeString)));
        };

        for (let i = 0; i < currentDataArr.length; i++) {
            currentDataArr[i].hasWork = arr[i]
            if (currentDataArr[i].week == 0) {
                currentDataArr[i].week = '日'
            } else if (currentDataArr[i].week == 1) {
                currentDataArr[i].week = '一'
            } else if (currentDataArr[i].week == 2) {
                currentDataArr[i].week = '二'
            } else if (currentDataArr[i].week == 3) {
                currentDataArr[i].week = '三'
            } else if (currentDataArr[i].week == 4) {
                currentDataArr[i].week = '四'
            } else if (currentDataArr[i].week == 5) {
                currentDataArr[i].week = '五'
            } else if (currentDataArr[i].week == 6) {
                currentDataArr[i].week = '六'
            }
        };
        return currentDataArr
    },
    //放大查看图片
    previewImage(url) {
        wx.previewImage({
            urls: [url],
        })
    }
})