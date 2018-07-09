// pages/collage/collageInfo/collageInfo.js
let utils = require('../../../utils/util.js');
let innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isDivShow: true,
        pageData: '',
        collageData: '',
        actId: '',
        actTag: '',
        joinId: '',
        collagePrice: '',
        priceId: 0,
        personNum: 0,
        priceInfo: '',
        startTime: '',
        endTime: '',
        status: '',
        bannerImage: '',
        backgroundImage: '',
        bgMusic: '',
        encodeID:'',
        isButton:true,
        myPerson:'',
        isData:true,
        bottomOption: true, //底部功能
        isCommon: true,
        musicClass:'',//音乐分类
        musicData:'',
        musicClassIndex: 0,
        isMusicClass: true,
        musicNum: '',
        isModel: true,
        modelNum: '',
        actionOptions: true,
        isOption: true,
        iconClose: 'iconfont icon-close iconStyle',
        iconOpen: 'iconfont icon-menu iconStyle',
        showMusic:true,
        animationClass:'musicControl',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log('options.scene', options)

        if (wx.getStorageSync('loginCode') == 1) {
            this.setData({
                actionOptions: false
            })
        } else {
            this.setData({
                actionOptions: true
            })
        }

        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            console.log('获取到的scene',scene)
            that.setData({
                actId: options.query.actid,
                actTag: options.query.acttag,
            })
        } else if (options.scene == undefined){
            that.setData({
                actId: options.actId,
                actTag: options.acttag,
                // encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
            })
        }
        
        let pages = getCurrentPages()
        let url = pages[pages.length - 1].route
        let mzy = 'actid=' + options.actId + '&acttag=' + options.acttag;
        that.setData({
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
        })
        getApp().request({
            url: 'org/music_list',
            data: {},
            method: 'post',
            success: res => {
                this.setData({
                    musicClass: res.data.data,
                    musicData: res.data.data[0].list
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        let that = this;
        getApp().request({
            url: 'personal_group_act',
            data: {
                act_id: that.data.actId,
                joiner_id: '',
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    // 背景音乐
                    innerAudioContext.src = res.data.data.music,
                    innerAudioContext.play();
                    innerAudioContext.onPlay(() => {
                        that.setData({
                            showMusic: false,
                            animationClass: 'musicControl viewRotate'
                        })
                    })
                    innerAudioContext.onStop(() => {
                        that.setData({
                            animationClass: 'musicControl'
                        })
                    })

                    wx.setNavigationBarTitle({
                        title: res.data.data.app_name,
                    })
                    if (res.data.data.joiner_id == undefined) {
                        that.setData({
                            isButton: true
                        })
                    } else if (res.data.data.joiner_id != undefined) {
                        that.setData({
                            isButton: false
                        })
                    }
                    that.setData({
                        pageData: res.data.data,
                        collagePrice: res.data.data.act_set[0].price,
                        personNum: res.data.data.act_set[0].person,
                        priceInfo: '凑齐' + res.data.data.act_set[0].person + '人即可享受每人' + res.data.data.act_set[0].price + '元',
                        startTime: utils.formatDate(new Date(res.data.data.start_time * 1000)),
                        endTime: utils.formatDate(new Date(res.data.data.end_time * 1000)),
                        status: new Date().valueOf() >= res.data.data.end_time * 1000 ? '已结束' : '进行中',
                        joinId: res.data.data.joiner_id,
                        bannerImage: res.data.data.banner_image_url,
                        backgroundImage: res.data.data.bg_image_url ? res.data.data.bg_image_url:'',
                        bgMusic: res.data.data.music,
                    });
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
        // 拼团列表
        getApp().request({
            url: 'personal_group_range',
            data: {
                act_id: that.data.actId,
                page: 1,
            },
            method: 'post',
            success: res => {
                that.setData({
                    collageData: res.data.data.list
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        let that = this;
        innerAudioContext.stop()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '私人拼团'
        }
    },
    toSignUp: function () {
        wx.navigateTo({
            url: '../collageSignup/collageSignup',
        })
    },
    isDivBox: function (e) {
        let that = this;
        this.setData({
            isDivShow: Boolean(Number(e.currentTarget.dataset.is)),
        })
        getApp().request({
            url: 'personal_group_member',
            data: {
                joiner_id: e.currentTarget.dataset.joinid,
                act_id: this.data.actId
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    that.setData({
                        myPerson: res.data.data.list
                    })
                    if (res.data.data.list.length > 0) {
                        that.setData({
                            isData: true
                        })
                    } else {
                        that.setData({
                            isData: false
                        })
                    }
                } else {

                }
            }
        })
    },
    toCollageSign: function (e) {
        let info = JSON.stringify(e.currentTarget.dataset.forminfo);

            wx.navigateTo({
                url: '../collageSignup/collageSignup?actId=' + e.currentTarget.dataset.actid + '&info=' + info + '&btnId=' + e.currentTarget.dataset.btnid + '&joinerId=' + e.currentTarget.dataset.joinerid,
            })
    },
    toPersonInfo: function () {
        wx.navigateTo({
            url: '../collagePersonInfo/collagePersonInfo?actId=' + this.data.actId + '&joinId=' + this.data.joinId,
        })
    },
    toIndex: function () {
        getApp().toIndex()
    },
    toBuild: function (e) {
        wx.navigateTo({
            url: '../collageBuild/collageBuild?title=' + e.currentTarget.dataset.title + '&info=' + e.currentTarget.dataset.info,
        })
    },
    cellPhone: function (e) {
        getApp().tellPhone(e)
    },
    switchTab: function (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            priceId: index,
            collagePrice: this.data.pageData.act_set[index].price,
            personNum: this.data.pageData.act_set[index].person,
            priceInfo: '凑齐' + this.data.pageData.act_set[index].person + '人即可享受每人' + this.data.pageData.act_set[index].price + '元'
        })

    },
    // 取消功能
    cancelImage: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'bgImage') {
            that.setData({
                backgroundImage: this.data.pageData.bg_image_url,
                bottomOption: true,
            })
        } else if (e.currentTarget.dataset.type == 'Banner') {
            this.setData({
                bannerImage: this.data.pageData.banner_image_url,
                backgroundImage: this.data.pageData.bg_image_url,
                backgroundMusic: this.data.pageData.music,
                isCommon: true,
                bottomOption: true,
            })
            innerAudioContext.src = that.data.backgroundMusic;
            innerAudioContext.play()
        }
    },
    // 确认功能
    comfireSubmit: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'Banner') {
            // 更换背景音乐
            getApp().request({
                url: 'org/edit_music',
                data: {
                    act_id: e.currentTarget.dataset.id,
                    music_id: this.data.musicId,
                    tag: wx.getStorageSync('actTag'),
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.showToast({
                            title: '更换成功',
                            icon: 'none',
                        })
                    }
                    // that.setData({
                    //     isCommon: true,
                    //     bottomOption: true,
                    // })
                }
            });
            //更换banner图
            getApp().request({
                url: 'org/edit_banner',
                data: {
                    act_id: e.currentTarget.dataset.id,
                    banner_image_url: this.data.bannerImage,
                    tag: wx.getStorageSync('actTag'),
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.showToast({
                            title: '更换成功',
                            icon: 'none',
                        })
                        that.setData({
                            isCommon: true,
                            bottomOption: true,
                        })
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }

                }
            })
        } else if (e.currentTarget.dataset.type == 'bgImage') {
            // 更换背景图
            let imagePath = that.data.backgroundImage
            let n = imagePath.lastIndexOf('.');
            imagePath = imagePath.substring(n);
            getApp().request({
                url: 'org/policy',
                method: 'post',
                data: {
                    "type": "image"
                },
                success: function (res) {
                    let sendData = {
                        "key": res.data.data.dir + new Date().valueOf() + getApp().randomNum() + '_' + getApp().randomNum() + imagePath,
                        "OSSAccessKeyId": res.data.data.accessid,
                        "host": res.data.data.host,
                        "expire": res.data.data.expire,
                        "signature": res.data.data.signature,
                        "policy": res.data.data.policy,
                        'success_action_status': '200'
                    }
                    wx.uploadFile({
                        url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                        name: 'file',
                        filePath: that.data.backgroundImage,
                        formData: sendData,
                        success: function (res) {
                            getApp().request({
                                url: "org/exchange",
                                data: {
                                    "key": sendData.key,
                                    "type": "image",
                                },
                                method: "post",
                                success: function (r) {
                                    r = r.data
                                    console.log(r)
                                    if (r.code == 0) {
                                        wx.showToast({
                                            title: '上传到服务器出错',
                                            icon: 'none'
                                        })
                                    } else if (Number(r.code) == 1) {
                                        that.setData({
                                            coverImageID: r.data.imageId
                                        })
                                        getApp().request({
                                            url: 'org/edit_background',
                                            data: {
                                                act_id: e.currentTarget.dataset.id,
                                                tag: wx.getStorageSync('actTag'),
                                                bg_image_url: r.data.res,
                                            },
                                            method: 'post',
                                            success: function (res) {
                                                if (Number(res.data.code) == 1) {
                                                    wx.showToast({
                                                        title: '更换成功',
                                                        icon: 'success',
                                                        success: function () {
                                                            that.setData({
                                                                isCommon: true,
                                                                bottomOption: true,
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    })
                }
            })

        }

    },
    switchTabs: function (e) {
        let that = this;
        for (let i = 0; i < this.data.musicClass.length; i++) {
            if (e.currentTarget.dataset.name == this.data.musicClass[i].name) {
                this.setData({
                    musicData: this.data.musicClass[i].list,
                    musicClassIndex: i
                })
            }
        }
    },
    // 选择音乐
    changeMusic: function (e) {
        let that = this;
        this.setData({
            backgroundMusic: e.currentTarget.dataset.music,
            musicId: e.currentTarget.dataset.musicid,
            musicNum: e.currentTarget.dataset.index,
        })
        innerAudioContext.src = that.data.backgroundMusic;
        innerAudioContext.play()

    },
    // 获取滚动高度
    onPageScroll: function (e) {
        let that = this;
        that.setData({
            scrollWidth: e.scrollTop,
        })
    },
    // 切换模板
    changeModel: function (e) {
        let that = this;
        if (that.data.scrollWidth > 0) {
            wx.pageScrollTo({
                scrollTop: 0,
            })
        }
        this.setData({
            bannerImage: e.currentTarget.dataset.image,
            backgroundImage: e.currentTarget.dataset.bimage,
            modelNum: e.currentTarget.dataset.index
        })
    },
    //停止播放音乐
    stopMusic: function () {
        innerAudioContext.stop()
    },
    isOptions: function () {
        this.setData({
            isOption: !this.data.isOption
        })
    },
    switchModel: function (e) {
        if (e.currentTarget.dataset.url == 'org/music_list') {
            this.setData({
                isMusicClass: false,
                isModel: true,
                isCommon: false
            })
        } else if (e.currentTarget.dataset.url == 'org/banner_list') {
            this.setData({
                isMusicClass: true,
                isModel: false,
                isCommon: false
            })
        }

        getApp().request({
            url: e.currentTarget.dataset.url,
            data: {},
            method: 'post',
            success: res => {
                this.setData({
                    musicClass: res.data.data,
                    musicData: res.data.data[0].list
                })
            }
        })
    },
    // 选择背景图片
    upDataImg: function (e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    backgroundImage: res.tempFilePaths[0],
                    bottomOption: false,
                    isCommon: true,
                })

            }
        })
    },
    // 编辑功能
    toEditPage: function (e) {
        let that = this;
        wx.navigateTo({
            url: '../../manageCenters/collageEdit/collageEdit?id=' + e.currentTarget.dataset.id,
        })
    },
    shareFriends:function(){
        let that = this;
        wx.showLoading({
            title: '正在生成中...',
            mask:true,
        })
        setTimeout(function(){
            wx.hideLoading();

            wx.previewImage({
                urls: [that.data.encodeID],
            })
        },1500)
    },
    // 音乐控制
    stopMusic:function(){
        let that = this;
        innerAudioContext.stop()
    }
})