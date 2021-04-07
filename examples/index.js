const usb = require('usb');
const Jimp = require('jimp');
const DataForSendToPrinterTSC = require('../src/DataForSendToPrinterTSC')
const XPrinter = require('../src/XPrinter')

const deviceList = usb.getDeviceList();
console.log(`Found ${deviceList.length} device list`);

const xPrinterDev = new XPrinter(deviceList[0])

const printImage = async () => {
  const imgPath = '../assets/2.jpg';
  const img = await Jimp.read(imgPath);
  const buffer = await DataForSendToPrinterTSC.bitmap(0, 0, img.bitmap)
  await xPrinterDev.Write(Buffer.concat([
    DataForSendToPrinterTSC.cls(),
    buffer,
    DataForSendToPrinterTSC.print(1)
  ]));
}

const printText = async () => {
  let data = Buffer.concat([
    DataForSendToPrinterTSC.sizeBydot(480, 240),
    DataForSendToPrinterTSC.cls(),
    DataForSendToPrinterTSC.text(50, 10, "1", 0, 2, 2, "Thinh Vu 123"),
    DataForSendToPrinterTSC.print(1),
  ])
  await xPrinterDev.Write(data)
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
