import moment from 'moment';
import TextUtil from '../Lib/TextUtil';

export function getStatusOperation(item) {
  let start = '';
  let end = '';
  let status = '';
  let statusColor = '';
  let statusBackground = '';
  let lastProses = '';

  if (item.start) {
    start = moment(item.start, 'yyyy-MM-DD HH:mm:ss').format(
      'D MMM YYYY, HH.mm'
    );
  }
  if (item.end) {
    end = moment(item.end, 'yyyy-MM-DD HH:mm:ss').format('D MMM YYYY, HH.mm');
  }
  if (item.start && item.end === null) {
    end = '';
    // end = 'Sekarang';
  }

  switch (item.wocp_status) {
    case 'I':
      status = 'Diproses';
      statusColor = 'black';
      statusBackground = '#F2F2F2';
      lastProses = item.last_process;
      break;
    case 'Q':
      status = 'Belum diproses';
      statusColor = 'grey';
      statusBackground = '#F2F2F2';
      lastProses = item.last_process;
      break;
    case 'W':
      status = 'Menunggu Disetujui';
      statusColor = 'orange';
      statusBackground = '#F8E1D1';
      lastProses = item.last_process;
      break;
    case 'A':
      status = 'Disetujui';
      statusColor = 'green';
      statusBackground = '#D2FECC';
      // lastProses = Math.round(
      //   (moment(item.end, 'yyyy-MM-dd HH:mm:ss') -
      //     moment(item.start, 'yyyy-MM-dd HH:mm:ss')) /
      //     1000
      // );
      // lastProses = TextUtil.formatTimeCountDown(lastProses);
      lastProses = item.last_process;
      break;
    case 'D':
      status = 'Ditolak';
      statusColor = 'red';
      statusBackground = '#FED2CC';
      // lastProses = Math.round(
      //   (moment(item.end, 'yyyy-MM-dd HH:mm:ss') -
      //     moment(item.start, 'yyyy-MM-dd HH:mm:ss')) /
      //     1000
      // );
      // lastProses = TextUtil.formatTimeCountDown(lastProses);
      lastProses = item.last_process;
      break;
  }

  return {start, end, status, statusColor, statusBackground, lastProses};
}
