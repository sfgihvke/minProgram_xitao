// pages/studentManage/orderList/orderList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
        showTitle:true,
        btnText: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.getPageData()
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
        let that = this;
        that.setData({
            pageNum: 1
        })
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    toPayInfo: function(e) {
        let payInfo = JSON.stringify(e.currentTarget.dataset.payinfo)
        wx.navigateTo({
            url: '../../courses/orderInfoPay/orderInfoPay?payInfo=' + payInfo + '&isInfo=1',
        })
    },
    // 获取页面更多数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'order_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
                success: function (res) {
                    if (res.data.code == 1) {
                        if (res.data.data.length > 0) {
                            for (let i = 0; i < res.data.data.length; i++) {
                                res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time * 1000));
                                res.data.data[i].cover.url = utils.rect(res.data.data[i].cover.url, 120, 60)
                            }
                        }
                        pageData.push(...res.data.data)
                        // 更多 
                        if (pageData.length >= that.data.pageNum*10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            pageData: pageData
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'order_list',
            method: 'post',
            data: {
                page: that.data.pageNum,
            },
            success: function (res) {
                if(res.data.code == 1){
                    if (res.data.data.length > 0) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time * 1000));
                            res.data.data[i].cover.url = utils.rect(res.data.data[i].cover.url, 120, 60)
                        }
                    }
                    // 更多 
                    if(res.data.data.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                }else{
                    wx.stopPullDownRefresh()
                }
            }
        })
    },
})