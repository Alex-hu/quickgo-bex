import { UriData } from 'src/pages/types';

const defaultCandidates: UriData[] = [
  {
    id: '1',
    label: '火车票-订单',
    url: 'http://oss.train.travel.17usoft.com/ordermng/orderRedirect/redirect?serialNo=',
    value: 'MT',
    env: '生产',
    color: '',
  },
  {
    id: '2',
    label: '火车票-退票单',
    url: 'http://oss.train.travel.17usoft.com/reversemng/page/refund/order/detail?refundSerialNo=',
    value: 'RT',
    env: '生产',
    color: '',
  },
  {
    id: '3',
    label: '火车票-订单',
    url: 'http://oss2.train.travel.t.17usoft.com/ordermng/orderRedirect/redirect?serialNo=',
    value: 'MT',
    env: '预发2',
    color: '',
  },
  {
    id: '4',
    label: '火车票-退票单',
    url: 'http://oss2.train.travel.t.17usoft.com/reversemng/page/refund/order/detail?refundSerialNo=',
    value: 'RT',
    env: '预发2',
    color: '',
  },
  {
    id: '5',
    label: '国际机票-订单',
    url: 'http://ossmng.ie.17usoft.com/order/main?serialNo=',
    value: 'IT',
    env: '生产',
    color: '',
  },
  {
    id: '6',
    label: '国际机票-退票单',
    url: 'http://reversemng.ie.17usoft.com/refund/detail?refundSerialNo=',
    value: 'RT',
    env: '生产',
    color: '',
  },
];

export default defaultCandidates;
