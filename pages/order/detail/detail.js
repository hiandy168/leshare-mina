import { Http } from "../../../class/utils/Http.js";
import OrderService from "../../../class/service/OrderService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const app = getApp();
const orderService = new OrderService();

Page({
  data: {
    order: {}
  },

  onLoad: function (options) {
    const orderId = options.orderId;
    //const orderId = 1598;
    orderService.getInfo(orderId).then(data => {
      this.setData({ order: data });
    });
  },

  /**
   * 关闭订单
   */
  onOrderClose: function (event) {
    const orderId = this.data.order.order_id;
    Tips.confirm('您确认取消该订单吗？').then(() => {
      Tips.loading('订单关闭中');
      return orderService.closeOrder(orderId);
    }).then(data => {
      Tips.toast('订单关闭成功', () => Router.orderIndexRefresh());
    }).catch(() => {
      //取消关闭订单
    });
  },

  /**
  * 订单退款
  */
  onOrderRefund: function (event) {
    const orderId = this.data.order.order_id;
    Tips.confirm('您确认要申请退款吗？').then(() => {
      Tips.loading('退款申请中');
      return orderService.refundOrder(orderId);
    }).then(data => {
      Tips.toast('退款申请成功', () => Router.orderIndexRefresh());
    });;

  },

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = this.data.order.order_id;
    Tips.confirm('您确认已收到货品？').then(() => {
      Tips.loading('确认收货中');
      return orderService.confirmOrder(orderId);
    }).then(data => {
      Tips.toast('确认收货成功', () => Router.orderIndexRefresh());
    });
  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = this.data.order.order_id;
    Tips.loading('支付加载中');
    orderService.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      return orderService.wxpayOrder(payment);
    }).then(res => {
      Tips.toast('支付成功', () => Router.orderIndexRefresh());
    }).catch(() => {
      Tips.toast('支付已取消');
    });
  },


  /**
   * 评论订单
   */
  onOrderComment: function (event) {
    Tips.toast("尚未实现");
  }

});