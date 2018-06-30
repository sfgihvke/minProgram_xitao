// pages/manageCenters/manageEdit/manageEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        actId:'',
        isShow: true,
        isHidden: false,
        isShowO: true,
        isHiddenO: false,
        getbargainType: '',
        getBargainLimitType: '',
        startDate: '2016-09-01',
        endDate: '2016-09-01',
        rule: '',
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        nameInfo:[],
        nameInfoId:[],
        isOptions: true,
        imageData: '',
        editTitle: undefined,
        backgroundImage: ' ',
        actImg0:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            actId: options.id,
        })
        if (options.id == 'undefined') {
            this.setData({
                backgroundImage: options.image
            })
        } else {
            getApp().request({
                url: 'org/make_bargain',
                data: {
                    id: options.id
                },
                method: 'get',
                success: function(res) {
                    let joinInfo = [];
                    let joinInfoId = [];
                    let imageData = [];
                    let imageDataId = [];
                    for (let i = 0; i < res.data.data.join_info.length; i++) {
                        joinInfo.push(res.data.data.join_info[i].text);
                        joinInfoId.push(res.data.data.join_info[i].require)

                        // joinInfo.splice(0, 2);
                        // joinInfoId.splice(0, 2)
                    }
                    for (let i = 0; i < res.data.data.act_image.length;i++){
                        imageData.push( res.data.data.act_image[i].url),
                        imageDataId.push(res.data.data.act_image[i].id)
                    }
                    that.setData({
                        pageData:res.data.data,
                        editTitle: res.data.data.title,
                        startDate: res.data.data.start_time,
                        endDate: res.data.data.end_time,
                        backgroundImage: res.data.data.banner_image_url,
                        nameInfo: joinInfo,
                        nameInfoId: joinInfoId,
                        imageData: imageData,
                        actImg0: imageDataId,
                    })
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    switchTab: function(e) {
        this.setData({
            isShow: !this.data.isShow,
            isHidden: !this.data.isHidden,
            getbargainType: e.currentTarget.dataset.value,
        })
    },
    switchTabO: function(e) {
        this.setData({
            isShowO: !this.data.isShowO,
            isHiddenO: !this.data.isHiddenO,
            getBargainLimitType: e.currentTarget.dataset.value
        })
    },
    getFormData: function(e) {
        let that = this;
        let sendData = {
            id: that.data.actId,

            title: e.detail.value.title,
            original_price: e.detail.value.original_price,
            now_price: e.detail.value.now_price,
            pay_status: e.detail.value.pay_status ? 1 : 0,
            start_time: this.data.startDate,
            end_time: this.data.endDate,
            joiner_limit: e.detail.value.joiner_limit,
            telephone: e.detail.value.telephone,
            address: e.detail.value.address,
            rule: this.data.rule,
            // join_info_require: this.data.nameInfoId,
            // join_info_text: this.data.nameInfo,
            bargain_type: this.data.getbargainType ? this.data.getbargainType : 1,
            bargain_limit_type: this.data.getBargainLimitTyp ? this.data.getBargainLimitType : 1,
            bargain_param: e.detail.value.bargain_paramO ? e.detail.value.bargain_paramO : e.detail.value.bargain_paramT,
            banner_image_url: this.data.backgroundImage,
            status: e.detail.value.joiner_limit ? 1 : 0,
        }
        for (let i = 0; i < that.data.actImg0.length; i++){
            sendData['act_image[' + i + ']'] = that.data.actImg0[i];
        }
        // for (let i = 0; i < that.data.joinInfo.length; i++) {
        //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
        //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
        // }
        for (let i = 0; i < that.data.nameInfo.length; i++) {
            // let index = i + 2;
            sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
            sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
        }
        getApp().request({
            url: 'org/make_bargain',
            data: sendData,
            method: 'post',
            success: res => {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
                if (res.data.code == 1) {
                    wx.navigateTo({
                        url: '../manageActive/manageActive?url=org/bargain_list',
                    })
                }
            }
        })
    },
    getStartTime: function(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    getEndTime: function(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    getRule: function(e) {
        this.setData({
            rule: e.detail.value
        })
    },
    addNameOptions: function(e) {
        let arr = this.data.nameInfo;
        let arrO = this.data.nameInfoId
        arr.push(e.target.dataset.value);
        arrO.push(0);
        this.setData({
            nameInfo: arr,
            nameInfoId: arrO
        })
    },
    showOptions: function(e) {
        this.setData({
            isOptions: Boolean(Number(e.target.dataset.is))
        })
    },
    getImage: function(e) {
        let that = this
        wx.chooseImage({
            success: function(res) {
                that.setData({
                    imageData: res.tempFilePaths
                })
                let imgPath = res.tempFiles;
                let actImg = [];
                for (let i = 0; i < imgPath.length; i++) {
                    getApp().request({
                        url: "org/policy",
                        method: "post",
                        data: {
                            "type": "image"
                        },
                        success: function(res) {
                            let sendData = {
                                "key": res.data.data.dir + imgPath[i].path,
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
                                filePath: imgPath[i].path,
                                formData: sendData,
                                success: function(res) {
                                    getApp().request({
                                        url: "org/exchange",
                                        data: {
                                            "key": sendData.key,
                                            "type": "image",
                                        },
                                        method: "post",
                                        success: function(r) {
                                            r = r.data
                                            if (r.code == 0) {
                                                console.log("上传到服务器出错");
                                                return
                                            }
                                            //得到图片的id和地址
                                            actImg.push(r.data.imageId)
                                            that.setData({
                                                actImg0: actImg,
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            },
        })
    },
    jianForm: function (e) {
        let that = this;
        let nameInfo = that.data.nameInfo
        let nameInfoId = that.data.nameInfoId
        nameInfo.splice(e.target.dataset.index, 1)
        nameInfoId.splice(e.target.dataset.index, 1)
        that.setData({
            nameInfo: nameInfo,
            nameInfoId: nameInfoId,
        })
    },
    isMustEdit: function (e) {
        let that = this;
        let nameInfoId = that.data.nameInfoId
        if (e.detail.value) {
            nameInfoId[e.target.dataset.index] = 1
        } else {
            nameInfoId[e.target.dataset.index] = 0
        }
        that.setData({
            nameInfoId: nameInfoId
        })
    },
})