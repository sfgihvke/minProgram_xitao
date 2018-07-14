// pages/videoClass/videoClassUserList/videoClassUserList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData:'',
        catalogList:'',
        tagList:'',
        isCatalog:true,
        isTag:true,
        catalogNum:0,
        tagNum:0,
        catalog:'',
        tag:'',
        pageNum:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;

        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: '',
                catalog: '',
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    res.data.data.catalog.unshift('全部')
                    res.data.data.tag.unshift('全部')
                    that.setData({
                        catalogList: res.data.data.catalog,
                        tagList: res.data.data.tag,
                        listData: res.data.data.list
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
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
    onShow: function () {

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
        let that = this;
        that.setData({
            pageNum: 1,
        })
        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: '',
                catalog: '',
                page:that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.hideLoading()
                    res.data.data.catalog.unshift('全部')
                    res.data.data.tag.unshift('全部')
                    that.setData({
                        catalogList: res.data.data.catalog,
                        tagList: res.data.data.tag,
                        listData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.listData);
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'visitor_video_class_list',
                data: {
                    tag: that.data.tag,
                    catalog: that.data.catalog,
                    page: 1,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.hideLoading()
                        res.data.data.catalog.unshift('全部')
                        res.data.data.tag.unshift('全部');
                        pageDataArr.push(...res.data.data.list)
                        that.setData({
                            catalogList: res.data.data.catalog,
                            tagList: res.data.data.tag,
                            listData: pageDataArr
                        })
                        wx.stopPullDownRefresh()
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }else{
            return 
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    // 功能
    toOptions:function(e){
        if (Number(e.currentTarget.dataset.id) == 0){
            getApp().toIndex()
        } else if (Number(e.currentTarget.dataset.id) == 1){
            wx.navigateTo({
                url: '../../courses/course/course',
            })
        }
    },
    goManList: function () {
        wx.navigateTo({
            url: '../videoClassManList/videoClassManList',
        })
    },
    toInfo:function(e){
        wx.navigateTo({
            url: '../videoClassInfo/videoClassInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    // 显示/隐藏  分类/标签
    isContent:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            that.setData({
                isCatalog: !that.data.isCatalog
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            that.setData({
                isTag: !that.data.isTag
            })
        }
    },
    // 分类/标签  切换效果  请求数据
    switchTag:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            that.setData({
                catalogNum: e.currentTarget.dataset.index,
                catalog: e.currentTarget.dataset.name == '全部' ? '' : e.currentTarget.dataset.name
            })
            wx.showLoading({
                title: '',
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            wx.showLoading({
                title: '',
            })
            that.setData({
                tagNum: e.currentTarget.dataset.index,
                tag: e.currentTarget.dataset.name == '全部' ? '' : e.currentTarget.dataset.name
            })
        }
        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: that.data.tag,
                catalog: that.data.catalog,
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.hideLoading()
                    res.data.data.catalog.unshift('全部')
                    res.data.data.tag.unshift('全部')
                    that.setData({
                        catalogList: res.data.data.catalog,
                        tagList: res.data.data.tag,
                        listData: res.data.data.list
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
})