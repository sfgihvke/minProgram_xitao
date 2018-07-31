// pages/manageCenters/manageCenter/manageCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        islogin:'block',
        isContent:'none',
        versionData:'',
        pageManagData:[
            {
                name:'更换模板',
                iconfont: 'iconfont icon-genghuanpifu iconSize',
                color:'#1196DB',
                url: '../../baseOptions/schoolModel/schoolModel',
                isShow:false,
            },
            {
                name: '打卡作业',
                iconfont: 'iconfont icon-job-task iconSize',
                color: '#870E04',
                url: '../../task/taskManSet/taskManSet',
                isShow: true,
            },
            {
                name: '学员跟进',
                iconfont: 'iconfont icon-genjinjilu iconSize',
                url: '../../courses/courseUserList/courseUserList',
                color: '#02AEA7',
                isShow: false,
            },
            {
                name: '学校简介',
                iconfont: 'iconfont icon-xuexiao iconSize',
                color: '#1196DB',
                url:'../schoolEdit/schoolEdit',
                isShow: false,
            },
        ],
        pageStuData:[
            {
                name: '私人拼团',
                iconfont: 'iconfont icon-pintuan iconStyle',
                background:'#E3465B',
                url: 'org/personal_group_list',
                pageType:1,
                tag:'personal_group',
            },{
                name: '一元上好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconStyle',
                background: '#FD9D22',
                url: 'org/bargain_list',
                pageType: 2,
                tag: 'lesson_one',
            },
            // {
            //     name: '视频点赞',
            //     iconfont: 'iconfont icon-aixin iconStyle',
            //     background: '#84D23E',
            //     url: 'org/bargain_list',
            //     pageType: 3
            // },
            {
                name: '帮我砍学费',
                iconfont: 'iconfont icon-kanjia iconStyle',
                background: '#00D4BE',
                url: 'org/bargain_list',
                pageType: 4,
                tag: 'bargain',
            },
            // {
            //     name: '万人拼团',
            //     iconfont: 'iconfont icon-icon1 iconStyle',
            //     background: '#DE4037',
            //     url: 'org/bargain_list',
            //     pageType: 5
            // }, 
            {
                name: '视频投票',
                iconfont: 'iconfont icon-zan1 iconStyle',
                background: '#8990FA',
                url: 'org/bargain_list',
                pageType: 6,
                tag: 'video_vote',
            }, 
            {
                name: '视频贺卡',
                iconfont: 'iconfont icon-meiguihua iconStyle',
                background: '#1196DB',
                url: 'org/video_card_list',
                pageType: 7,
                tag: 'video_card',
            }, {
                name: '活动报名',
                iconfont: 'iconfont icon-sign iconStyle',
                background: '#FF6766',
                url: 'org/bargain_list',
                pageType: 8,
                tag: 'normal',
            }, 
            {
                name: '微视频课堂',
                iconfont: 'iconfont icon-shipin1 iconStyle',
                background: '#FE7FC2',
                url: 'org/bargain_list',
                pageType: 9,
                tag: 'video_class',
            },
            // {
            //     name: '视频作业',
            //     iconfont: 'iconfont icon-job-task iconStyle',
            //     background: '#84D23E',
            //     url: 'org/bargain_list',
            //     pageType: 10
            // }
        ],
        phone:'',
        pwd:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let version = wx.getExtConfigSync();
        wx.setStorageSync('loginCode', 3)
        that.setData({
            versionData: wx.getExtConfigSync(),
        });
        // 判断功能页面功能
        let funcOpt = getApp().funcOpt.function;
        let pageData = that.data.pageStuData;
        for (let i = 0; i < funcOpt.length; i++){
            if (funcOpt[i].tag == 'punch') {
                that.data.pageManagData[1].isShow = false
                funcOpt.splice(i, 1);
                i = funcOpt.length + 1
            } else {
                that.data.pageManagData[1].isShow = true;
                i = funcOpt.length + 1
            }
        }
        for (let i = 0; i < funcOpt.length;i++){
            if (funcOpt[i].tag == 'sale_lesson'){
                funcOpt.splice(i,1)
            }
            for (let j = 0; j < pageData.length;j++){
                if (funcOpt[i].tag == pageData[j].tag){
                    funcOpt[i].iconfont = pageData[j].iconfont
                    funcOpt[i].background = pageData[j].background
                    funcOpt[i].url = pageData[j].url
                    funcOpt[i].pageType = pageData[j].pageType
                }
            }
        };
        that.setData({
            pageStuData: funcOpt,
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
    onShow: function () {
        if (wx.getStorageSync('loginCode') == 1) {
            this.setData({
                islogin: 'none',
                isContent:'block',
            })
        } else {
            wx.setNavigationBarTitle({
                title: '招生小程序登录',
            })
            this.setData({
                islogin: 'block',
                isContent:'none'
            })
        }
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
    // onShareAppMessage: function () {

    // },
    getPhone: function (e) {
        this.setData({
            phoneNum: e.detail.value,
        })
    },
    getPwd: function (e) {
        this.setData({
            pwdNum: e.detail.value,
        })
    },
    login: function (e) {
        let that = this;
        let senddata = e.detail.value
        if (senddata.phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            })
        } else if (senddata.password == '') {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
        } else {
            getApp().request({
                url: 'login_org',
                data: senddata,
                method: 'post',
                success: res => {
                    wx.setStorageSync('loginCode', res.data.code)
                    if(Number(res.data.code)==1){
                        wx.setNavigationBarTitle({
                            title: '管理中心',
                        })
                        wx.showLoading({
                            title:'正在登录',
                            mask:true,
                        })
                        setTimeout(closeLogin,2000)
                        function closeLogin (){
                            wx.hideLoading()
                            wx.showToast({
                                title: '登录成功',
                            })
                            that.setData({
                                islogin: 'none',
                                isContent: 'block'
                            })
                        }
                    } else if (Number(res.data.code)==0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none'
                        })
                    }
                }
            })
        }
    },
    toManageActive:function(e){

        let pageType = e.currentTarget.dataset.pagetype

        wx.setStorageSync('pageType', pageType)
        
        if (Number(pageType) == 1 || Number(pageType) == 4){
            wx.navigateTo({
                url: '../manageActive/manageActive?url=' + e.currentTarget.dataset.requireurl,
            })
        } else if (Number(pageType) == 2){
            wx.navigateTo({
                url: '../../goodLesson/manLessonList/manLessonList?url=' + e.currentTarget.dataset.requireurl,
            })
        } else if (Number(pageType) == 11){
            wx.navigateTo({
                url: '../../courses/courseUserList/courseUserList',
            })
        } else if (Number(pageType) == 7){
            wx.navigateTo({
                url: '../../videos/manVideoList/manVideoList',
            })
        }else if(Number(pageType) == 8){
            wx.navigateTo({
                url: '../../actReg/actRegManList/actRegManList',
            })
        } else if (Number(pageType) == 9){
            wx.navigateTo({
                url: '../../videoClass/videoClassManList/videoClassManList',
            })
        } else if (Number(pageType) == 6){
            wx.navigateTo({
                url: '../../videoVote/videoVoteManList/videoVoteManList',
            })
        } else if (Number(pageType) == 12){
            wx.navigateTo({
                url: '../../task/taskManSet/taskManSet',
            })
        }
    },
    toEditPage:function(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    exitApp:function(){
        let that = this;
        getApp().request({
            url:'logout',
            data:{},
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    getApp().isLogin = false;
                    wx.setStorageSync('loginCode', 3);
                    wx.setNavigationBarTitle({
                        title: '招生小程序登录',
                    })
                    that.setData({
                        islogin: 'block',
                        isContent: 'none',
                        phone: '',
                        pwd: '',
                    })
                }
            }
        })
    }
})