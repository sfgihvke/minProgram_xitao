//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        orgId: 0,
        modeCode:'one',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        optionsUrl: [
            {
                tag: 'school_intro',
                url: '../baseOptions/schoolInfo/schoolInfo',     //学校简介
            },
            {
                tag: 'lesson_navi',
                url: '../courses/course/course',     //课程导航
            },
            {
                tag: 'campus',
                url: '../baseOptions/schoolList/schoolList',     //校区列表
            },
            {
                tag: 'teacher',
                url: '../baseOptions/teachers/teachers',     //师资力量
            },
            {
                tag: 'student',
                url: '../baseOptions/studentStyle/studentStyle',     //学员风采
            },
            {
                tag: 'enlist',
                url: '../actReg/actRegUserList/actRegUserList',     //活动报名
            },
            {
                tag: 'contact',
                url: '../baseOptions/contactUs/contactUs',     //联系我们
            },
            {
                tag: 'feedback',
                url: '../baseOptions/opinions/opinions',     //意见建议
            },
            {
                tag: 'more',
                url: '../morePage/morePage',     //更多
            },
            {
                tag: 'bargain',
                url: '../killPrices/killPrice/killPrice',     //帮我砍价
            },
            {
                tag: 'group',
                url: '../collage/collageList/collageList',     //拼团
            },
            {
                tag: 'lesson_one',
                url: '../goodLesson/goodLessonList/goodLessonList',     //一元好课
            },
            {
                tag: 'video_card',
                url: '../videos/userVideoList/userVideoList',     //视频贺卡
            },
        ],
        pageData: '',
        isGetUser: false,
        paintData: [
            {
                backgroundColor: '#FEB33C',
                width: '250rpx',
            }, {
                backgroundColor: '#50D0AD',
                width: '250rpx',
            }, {
                backgroundColor: '#FC407A',
                width: '250rpx',
            }, {
                backgroundColor: '#FF633D',
                width: '250rpx',
            }, {
                backgroundColor: '#3EA6FD',
                width: '500rpx',
            }, {
                backgroundColor: '#C55EF5',
                width: '250rpx',
            }, {
                backgroundColor: '#F8964D',
                width: '250rpx',
            }, {
                backgroundColor: '#7F3CD9',
                width: '250rpx',
            }
        ],
    },
    //事件处理函数
    onLoad: function () {
        let that = this;
        if (wx.getStorageSync('userInfo') != '') {
            that.setData({
                isGetUser: true,
            })
        }
        // 选择模板
        // if (Number(wx.getStorageSync('schoolModel')) == 2){
        //     that.setData({
        //         modeCode:'six'
        //     })
        // } else if (Number(wx.getStorageSync('schoolModel')) == 6){
        //     that.setData({
        //         modeCode: 'two'
        //     })
        // }
        getApp().request({
            url: "home",
            method: "post",
            data: {},
            success: res => {
                for (let i = 0; i < res.data.data.home_icon.length; i++) {
                    res.data.data.home_icon[i].backgroundColor = that.data.paintData[i].backgroundColor;
                    res.data.data.home_icon[i].width = that.data.paintData[i].width;
                    for (let j = 0; j < that.data.optionsUrl.length; j++) {
                        if (res.data.data.home_icon[i].tag == that.data.optionsUrl[j].tag){
                            res.data.data.home_icon[i].url = that.data.optionsUrl[j].url
                        }
                    }
                }
                that.setData({
                    pageData: res.data.data
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                });
                wx.setNavigationBarColor({
                    frontColor: res.data.data.navi_font_color,
                    backgroundColor: res.data.data.navi_background_color,
                })
            }
        })
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // console.log("host:",getApp().globalData.host)
                // console.log("org_id:", getApp().config.orgId,"code:",res.code)
                getApp().request({
                    url: "login",
                    method: "post",
                    data: {
                        code: res.code,
                        org_id: getApp().config.orgId,
                    },
                    success: r => {
                        var cookie = wx.getStorageSync('cookie');
                        // getApp().request({
                        //     url: "login_status",
                        //     success: r => {
                        //         console.log("login status:", r);
                        //     },
                        // });
                    }
                })
            }
        })


        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    onShow:function(){
        let that = this;
        // 选择模板
        // if (Number(wx.getStorageSync('schoolModel')) == 2) {
        //     that.setData({
        //         modeCode: 'six'
        //     })
        // } else if (Number(wx.getStorageSync('schoolModel')) == 6) {
        //     that.setData({
        //         modeCode: 'two'
        //     })
        // }
    },
    redirectPage: function (res) {
        wx.navigateTo({
            url: res.target.dataset.url,
        })
    },
    nav: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    getUserInfo: function (e) {
        let that = this;
        wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
        that.setData({
            isGetUser: true
        })
    },
    toContentPage: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    onPullDownRefresh: function () {
        let that = this
        getApp().request({
            url: "home",
            method: "post",
            data: {},
            success: res => {
                for (let i = 0; i < res.data.data.home_icon.length; i++) {
                    res.data.data.home_icon[i].backgroundColor = that.data.paintData[i].backgroundColor;
                    res.data.data.home_icon[i].width = that.data.paintData[i].width;
                    for (let j = 0; j < that.data.optionsUrl.length; j++) {
                        if (res.data.data.home_icon[i].tag == that.data.optionsUrl[j].tag) {
                            res.data.data.home_icon[i].url = that.data.optionsUrl[j].url
                        }
                    }
                }
                that.setData({
                    pageData: res.data.data
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                });
                wx.setNavigationBarColor({
                    frontColor: res.data.data.navi_font_color,
                    backgroundColor: res.data.data.navi_background_color,
                })

                wx.stopPullDownRefresh()
            }
        })
        // setTimeout(pullDown,2000)
        // function pullDown(){
        // }
    },
    toCourseInfo: function (e) {
        wx.navigateTo({
            url: '../courses/courseInfo/courseInfo?id=' + e.currentTarget.dataset.id,
        })
    }
})
