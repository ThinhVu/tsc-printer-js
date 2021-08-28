const usb = require('usb');
const Jimp = require('jimp');
const TscBuffer = require('../src/TscBuffer')
const TscPrinter = require('../src/TscPrinter')

const deviceList = usb.getDeviceList();
console.log(`Found ${deviceList.length} device list`);

const xPrinterDev = new TscPrinter(deviceList[0])

const printImage = async () => {
  const imgPath = '../assets/sample-image.jpg';
  const img = await Jimp.read(imgPath);
  const buffer = await TscBuffer.bitmap(0, 0, img.bitmap)
  await xPrinterDev.Write(Buffer.concat([
    TscBuffer.cls(),
    buffer,
    TscBuffer.print(1)
  ]));
}

const printText = async () => {
  let data = Buffer.concat([
    TscBuffer.sizeBydot(480, 240),
    TscBuffer.cls(),
    TscBuffer.text(50, 10, "1", 0, 2, 2, "Thinh Vu 123"),
    TscBuffer.print(1),
  ])
  await xPrinterDev.Write(data)
}

const printBarcode = () => {
  [
    TscBuffer.sizeBymm(60,30),
    TscBuffer.gapBymm(0,0),
    TscBuffer.cls(),
    TscBuffer.barCode(60,50,"128",100,1,0,2,2,"Hello there"),
    TscBuffer.print(1)
  ].forEach(data => xPrinterDev.Write(data));
}

// printText()
// printBarcode()

printImage()
