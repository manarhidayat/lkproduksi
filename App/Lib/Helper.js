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

export function getDataQr(result) {
  const data = result;
  let params = {
    rifd_qr_code: result,
  };
  const words = data.split('_');

  for (let i = 0; i < words.length; i++) {
    if (i === 0) {
      params = {
        ...params,
        pt_id: parseInt(words[0], 10),
      };
    }
    if (i === 1) {
      params = {
        ...params,
        pt_code: words[1],
      };
    }
    if (i === 2) {
      params = {
        ...params,
        pt_desc1: words[2],
      };
    }
    if (i === 3) {
      params = {
        ...params,
        batch: words[3],
      };
    }
    if (i === 4) {
      params = {
        ...params,
        qty: words[4],
      };
    }
    if (i === 5) {
      params = {
        ...params,
        um_id: parseInt(words[5], 10),
      };
    }
    if (i === 6) {
      params = {
        ...params,
        um: words[6],
      };
    }
    if (i === 7) {
      params = {
        ...params,
        pcs: parseInt(words[7], 10),
      };
    }
    if (i === 8) {
      params = {
        ...params,
        pack_id: parseInt(words[8], 10),
      };
    }
    if (i === 9) {
      params = {
        ...params,
        pack: words[9],
      };
    }
    if (i === 10) {
      params = {
        ...params,
        loc_id: parseInt(words[10], 10),
      };
    }
    if (i === 11) {
      params = {
        ...params,
        loc_desc: words[11],
      };
    }
    if (i === 12) {
      params = {
        ...params,
        in_date: words[12],
      };
    }
    if (i === 13) {
      params = {
        ...params,
        exp_date: words[13],
      };
    }
  }
  return params;
}
