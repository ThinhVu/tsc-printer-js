let charsetName = "utf8";

const setCharsetName = charset => charsetName = charset;
const sizeBymm = (m, n) => strToBytes(`SIZE ${m} mm, ${n} mm\n`)
const sizeByinch = (m, n) => strToBytes(`SIZE ${m}, ${n}\n`)
const sizeBydot = (m, n) => strToBytes("SIZE " + m + " dot," + n + " dot\n")
const gapByinch = (m, n) => strToBytes("GAP " + m + "," + n + "\n")
const gapBymm = (m, n) => strToBytes("GAP " + m + " mm," + n + " mm\n")
const gapBydot = (m, n) => strToBytes("GAP " + m + " dot," + n + " dot\n")
// gapDetect
const gapDetect2 = (x, y) => strToBytes("GAPDETECT " + x + "," + y + "\n")
const gapDetect0 = () => strToBytes("GAPDETECT\n")
const gapDetect = function() {
  if (arguments.length === 0) {
    return gapDetect0()
  } else if (arguments.length === 2) {
    return gapDetect2(...arguments)
  } else {
    console.log('gapDetect: invalid arguments')
  }
}
const blineDetect = (x, y) => strToBytes("BLINEDETECT " + x + "," + y + "\n")
const autoDetect = (x, y) => strToBytes("AUTODETECT " + x + "," + y + "\n")
const blineByinch = (m, n) => strToBytes("BLINE " + m + "," + n + "\n")
const blineBymm = (m, n) => strToBytes("BLINE " + m + " mm," + n + " mm\n")
const blineBydot = (m, n) => strToBytes("BLINE " + m + " dot," + n + " dot\n")
const offSetByinch = m => strToBytes("OFFSET " + m + "\n")
const offSetBymm = m => strToBytes("OFFSET " + m + " mm\n")
const offSetBydot = m => strToBytes("OFFSET " + m + " dot\n")
const speed = n => strToBytes("SPEED " + n + "\n")
const density = n => strToBytes("DENSITY " + n + "\n")
const direction = n => strToBytes("DIRECTION " + n + "\n")
const reference = (x, y) => strToBytes("REFERENCE " + x + ", " + y + "\n")
const shift = n => strToBytes("SHIFT " + n + "\n")
const country = n => strToBytes("COUNTRY " + n + "\n")
const codePage = n => strToBytes("CODEPAGE " + n + "\n")
const cls = () => strToBytes("CLS\n")
const feed = n => strToBytes("FEED " + n + "\n")
const backFeed = n => strToBytes("BACKFEED " + n + "\n")
const formFeed = () => strToBytes("FORMFEED\n")
const home = () => strToBytes("HOME\n")
const print2 = (m, n) => strToBytes("PRINT " + m + "," + n + "\n")
const print1 = m => strToBytes("PRINT " + m + "\n")
const print = function() {
  if (arguments.length === 1) {
    return print1(...arguments)
  } else if (arguments.length === 2) {
    return print2(...arguments)
  } else {
    console.log('print:invalid argument length')
  }
}
const sound = (level, interval) => strToBytes("SOUND " + level + "," + interval + "\n")
const cut = () => strToBytes("CUT\n")
const limitFeedByinch = n => strToBytes("LIMITFEED n\n")
const limitFeedBymm = n => strToBytes("LIMITFEED n mm\n")
const limitFeedBydot = n => strToBytes("LIMITFEED n dot\n")
//
const selfTest0 = () => strToBytes("SELFTEST\n")
const selfTest1 = page => strToBytes("SELFTEST " + page + "\n")
const selfTest = function() {
  if (arguments.length === 0) {
    selfTest0()
  } else if (arguments.length === 1) {
    selfTest1(...arguments)
  }
}
const eoj = () => strToBytes("EOJ\n")
const delay = ms => strToBytes("DELAY " + ms + "\n")
const disPlay = s => strToBytes("DISPLAY " + s + "\n")
const initialPrinter = () => strToBytes("INITIALPRINTER\n")
const bar = (x, y, width, heigth) => strToBytes("BAR " + x + "," + y + "," + width + "," + heigth + "\n")
const barCode = (x, y, codeType, heigth, human, rotation, narrow, wide, content) => strToBytes("BARCODE " + x + "," + y + ",\"" + codeType + "\"," + heigth + "," + human + "," + rotation + "," + narrow + "," + wide + ",\"" + content + "\"\n")

// bitmap
function getTscBitmapData(bitmap) {
  /**
   * Convert bitmap image to tsc packed format
   * @param bitmap
   */
  const w = bitmap.width;
  const h = bitmap.height;
  const threshold = 80;
  const biTonal = [];
  for(let y = 0; y < h; ++y)
    for (let x = 0; x < w; ++x)
      biTonal[y * w + x] = getGrayscaleAt(bitmap, x, y) >= threshold ? 1 : 0;
  return pack(biTonal, w, h);
}
function getGrayscaleAt(bitmap, x, y) {
  /**
   * https://en.wikipedia.org/wiki/Grayscale
   * Luma coding: Y'=0.299R'+0.587G'+0.114B'
   * Suppose that:
   *   1. alpha channel is always 255
   *   2. perpixel contains 4 bytes: RGBA
   */
  const w = bitmap.width;
  const bpp = 4
  const pixelPos = (y * w + x) * bpp;
  const r = bitmap.data[pixelPos];
  const g = bitmap.data[pixelPos + 1];
  const b = bitmap.data[pixelPos + 2];
  return (0.299 * r + 0.587 * g + 0.114 * b);
}
function pack(b, w, h) {
  /**
   * To reduce data transmit, TSC printer will pack data before send
   * 8 byte of data will be packed into a byte
   * @param b data bitmap data with value 0 and 1
   * @param w width image witdh
   * @param h height image height
   */
  let n = Math.floor((w + 7) / 8);
  let data = new Array(n * h);
  for(let y = 0; y < h; ++y) {
    for(let x = 0; x < n * 8; ++x) {
      if (x < w) {
        if (b[y * w + x]) {
          data[y * n + Math.floor(x / 8)] |= byte(1 << 7 - x % 8);
        }
      } else if (x >= w) {
        data[y * n + Math.floor(x / 8)] |= byte(1 << 7 - x % 8);
      }
    }
  }

  return data;
}
function byte(value) {
  /**
   * maximum of (1 << 7 - x % 8) is (1 << 7) = 128 where x % 8 == 0
   * 128 in int is -128 in byte
   * another x which x % 8 != will have (1 << 7 - x % 8) < 127 so it's keep the same value in both byte and int
   */
  return value === 128 ? -128: value
}
function bitmap(x, y, bitmap) {
  const width = (bitmap.width + 7) / 8;
  const heigth = bitmap.height;
  const str = "BITMAP " + x + "," + y + "," + width + "," + heigth + "," + 0 + ",";
  const ended = DataForSendToPrinterTSC.strToBytes("\n");
  const head = DataForSendToPrinterTSC.strToBytes(str);
  const data = Buffer.from(getTscBitmapData(bitmap));
  return Buffer.concat([head, data, ended]);
}

const box = (x, y, x_end, y_end, thickness) => strToBytes("BOX " + x + "," + y + "," + x_end + "," + y_end + "," + thickness + "\n")
const ellipse = (x, y, width, height, thickness) => strToBytes("ELLIPSE " + x + "," + y + "," + width + "," + height + "," + thickness + "\n")
const codeBlockFMode = (x, y, rotation, row_height, module_width, content) => strToBytes("CODABLOCK " + x + "," + y + "," + rotation + "," + row_height + "," + module_width + ",\"" + content + "\"\n")
const dmatrix9 = (x, y, width, height, xm, row, col, expression, content) => strToBytes("DMATRIX " + x + "," + y + "," + width + "," + height + "," + xm + "," + row + "," + col + "," + expression + ",\"" + content + "\"\n")
const dmatrix6 = (x, y, width, height, expression, content) => strToBytes("DMATRIX " + x + "," + y + "," + width + "," + height + "," + expression + ",\"" + content + "\"\n")
const dmatrix = function() {
  if (arguments.length === 6) {
    dmatrix6(...arguments)
  } else if (arguments.length === 9) {
    dmatrix9(...arguments)
  } else {
    console.log('dmatrix: invalid argument length')
  }
}
const erase = (x, y, width, height) => strToBytes("ERASE " + x + "," + y + "," + width + "," + height + "\n")
const pdf417 = (x, y, width, height, rotate, option, content) => strToBytes("PDF417 " + x + "," + y + "," + width + "," + height + "," + rotate + "," + option + ",\"" + content + "\"\n")
const putBmp5 = (x, y, filename, bpp, contrast) => strToBytes("PUTBMP " + x + "," + y + ",\"" + filename + "\", " + bpp + ", " + contrast + "\n")
const putBmp3 = (x, y, filename) => strToBytes("PUTBMP " + x + "," + y + ",\"" + filename + "\"\n")
const putBmp = function() {
  if (arguments.length === 3) {
    return putBmp3(...arguments)
  } else if (arguments.length === 5) {
    return putBmp5(...arguments)
  } else {
    console.log('putBmp: invalid argument length')
  }
}
const putpcx = (x, y, filename) => strToBytes("PUTPCX " + x + "," + y + ",\"" + filename + "\"\n")
const qrCode9 = (x, y, eccLevel, cellWidth, mode, rotation, model, mask, content) => {
  return strToBytes("QRCODE " + x + "," + y + "," + eccLevel + "," + cellWidth + "," + mode + "," + rotation + "," + model + "," + mask + ",\"" + content + "\"\n")
}
const qrCode7 = (x, y, eccLevel, cellWidth, mode, rotation, content) => {
  return strToBytes("QRCODE " + x + "," + y + "," + eccLevel + "," + cellWidth + "," + mode + "," + rotation + ",\"" + content + "\"\n")
}
const qrCode = function() {
  if (arguments.length === 9) {
    return qrCode9(...arguments)
  } else if (arguments.length === 7) {
    return qrCode7(...arguments)
  } else {
    console.log('qrCode: invalid argument length')
  }
}
const reverse = (x, y, width, height) => strToBytes("REVERSE " + x + "," + y + "," + width + "," + height + "\n")
const text = (x, y, font, rotation, x_multiplication, y_multiplication, content) => {
  return strToBytes("TEXT " + x + "," + y + ",\"" + font + "\"," + rotation + "," + x_multiplication + "," + y_multiplication + ",\"" + content + "\"\n")
}
const block11 = (x, y, width, height, font, rotation, x_multiplication, y_multiplication, space, alignment, content) => {
  return strToBytes("BLOCK " + x + "," + y + "," + width + "," + height + ",\"" + font + "\"," + rotation + "," + x_multiplication + "," + y_multiplication + "," + space + "," + alignment + ",\"" + content + "\"\n")
}
const block9 = (x, y, width, height, font, rotation, x_multiplication, y_multiplication, content) => {
  return strToBytes("BLOCK " + x + "," + y + "," + width + "," + height + ",\"" + font + "\"," + rotation + "," + x_multiplication + "," + y_multiplication + ",\"" + content + "\"\n")
}
const block = function() {
  if (arguments.length === 9) {
    return block9(...arguments)
  } else if (arguments.length === 1) {
    return block11(...arguments)
  } else {
    console.log('block: invalid argument length')
  }
}
const checkPrinterStateByPort9100 = () => Buffer.from([29, 97, 31])
const checkPrinterStateByPort4000 = () => Buffer.from([27, 118, 0])
// TODO: download2
const downLoad1 = filename => strToBytes("DOWNLOAD \"" + filename + "\"\n")
const downLoad3 = (filename, size, content) => {
  return strToBytes("DOWNLOAD \"" + filename + "\"," + size + "," + content + "\n")
}
// const downLoad2 = (filename, bitmap) => {
//   throw 'Not implemented'
//   // byte[] data = BitmapToByteData.downLoadBmpToSendTSCdownloadcommand(bitmap);
//   // int size = data.length;
//   // String str = "DOWNLOAD \"" + filename + "\"," + size + ",";
//   // byte[] head = strTobytes(str);
//   // data = byteMerger(head, data);
//   // byte[] end = strTobytes("\n");
//   // data = byteMerger(data, end);
//   // return data;
// }
// const downLoad2 = (filename, filepath) => {
//   throw 'Not implemented'
//   // byte[] data = null;
//   //
//   // try {
//   //   File f = new File(filepath);
//   //   FileInputStream fIn = new FileInputStream(f);
//   //   int size = fIn.available();
//   //   String str = "DOWNLOAD \"" + filename + "\"," + size + ",";
//   //   data = strTobytes(str);
//   //   byte[] b = new byte[size];
//   //
//   //   for(boolean var8 = true; fIn.read(b) != -1; data = byteMerger(data, b)) {
//   //   }
//   //
//   //   fIn.close();
//   //   String end = "\n";
//   //   byte[] endata = strTobytes(end);
//   //   data = byteMerger(data, endata);
//   // } catch (Exception var11) {
//   //   var11.printStackTrace();
//   // }
//   //
//   // return data;
// }
const downLoad = function() {
  if (arguments.length === 1) {
    return downLoad1(...arguments)
  } else if (arguments.length === 2) {
    throw 'Not implemented'
    // return downLoad2(...arguments)
  } else if (arguments.length === 3) {
    return downLoad3(...arguments)
  } else {
    console.log('downLoad: invalid agruments')
  }
}
const eop = () => strToBytes("EOP\n")
const files = () => strToBytes("FILES\n")
const kill = filename => strToBytes("KILL \"" + filename + "\"\n")
const move = () => strToBytes("MOVE\n")
const run = filename => strToBytes("RUN \"" + filename + "\"\n")
const strToBytes = str => {
  try {
    let b = Buffer.from(str, 'utf8');
    if (charsetName == null || charsetName === "") {
      charsetName = "utf8";
    }
    return Buffer.from(b.toString('utf8'), charsetName);
  } catch (var4) {
    console.log(var4.message)
  }
  return null;
}
const byteMerger = (byte_1, byte_2) => {
  return Buffer.concat([byte_1, byte_2]);
}


module.exports = {
  setCharsetName,
  sizeBymm,
  sizeByinch,
  sizeBydot,
  gapByinch,
  gapBymm,
  gapBydot,
  gapDetect,
  blineDetect,
  autoDetect,
  blineByinch,
  blineBymm,
  blineBydot,
  offSetByinch,
  offSetBymm,
  offSetBydot,
  speed,
  density,
  direction,
  reference,
  shift,
  country,
  codePage,
  cls,
  feed,
  backFeed,
  formFeed,
  home,
  print,
  sound,
  cut,
  limitFeedByinch,
  limitFeedBymm,
  limitFeedBydot,
  selfTest,
  eoj,
  delay,
  disPlay,
  initialPrinter,
  bar,
  barCode,
  bitmap,
  box,
  ellipse,
  codeBlockFMode,
  dmatrix,
  erase,
  pdf417,
  putBmp,
  putpcx,
  qrCode,
  reverse,
  text,
  block,
  checkPrinterStateByPort9100,
  checkPrinterStateByPort4000,
  downLoad,
  eop,
  files,
  kill,
  move,
  run,
  strToBytes,
  byteMerger
}
