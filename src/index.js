const usb = require('usb');
const deviceList = usb.getDeviceList();
const DataForSendToPrinterTSC = require('./DataForSendToPrinterTSC')
const XPrinter = require('./XPrinter')
const xPrinterDev = new XPrinter(deviceList[0])
const Jimp = require('jimp')

console.log(`Found ${deviceList.length} device list`);

const printImage = async () => {
  const imgPath = './3 2.jpg';
  const img = await Jimp.read(imgPath);
  const buffer = await DataForSendToPrinterTSC.bitmap(0, 0, img.bitmap)
  xPrinterDev.Write(Buffer.concat([
    DataForSendToPrinterTSC.cls(),
    buffer,
    DataForSendToPrinterTSC.print(1)
  ]));
}

const printText = () => {
  let data = Buffer.concat([
    DataForSendToPrinterTSC.sizeBydot(480, 240),
    DataForSendToPrinterTSC.cls(),
    DataForSendToPrinterTSC.text(50, 10, "1", 0, 2, 2, "Thinh Vu 123"),
    DataForSendToPrinterTSC.print(1),
  ])
  xPrinterDev.Write(data)
}

const printBarcode = () => {
  [
    DataForSendToPrinterTSC.sizeBymm(60,30),
    DataForSendToPrinterTSC.gapBymm(0,0),
    DataForSendToPrinterTSC.cls(),
    DataForSendToPrinterTSC.barCode(60,50,"128",100,1,0,2,2,"Hello there"),
    DataForSendToPrinterTSC.print(1)
  ].forEach(data => xPrinterDev.Write(data));
}

// printText()
// printBarcode()

printImage()
