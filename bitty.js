var BinaryViewer = function BinaryViewer(el, buffer, dataWidth, blockWidth, blockHeight, bitsPerBlock) {
  this.buffer = buffer;
  if (!dataWidth){
    dataWidth = 8;
  }
  if (!blockWidth) {
    blockWidth = 8;
  }
  if (!blockHeight) {
    blockHeight = 8;
  }
  if (!bitsPerBlock) {
    bitsPerBlock = 1;
  }

  this.dataWidth = dataWidth;
  this.blockWidth = blockWidth;
  this.blockHeight = blockHeight;
  this.bitsPerBlock = bitsPerBlock;

  this.el = el;

  this.canvas = document.createElement("canvas");

  this.canvas.style.overflow = "hidden";
  this.canvas.style.border = '1px solid lightgray';
  this.canvas.style.background = "rgba(87,87,87,0.2)";

  this.canvas.style["-webkit-box-shadow"] = this.canvas.style["box-shadow"] = "0 0 12px 1px rgba(87,87,87,0.2)";
  this.redraw();

  this.el.appendChild(this.canvas);

};

BinaryViewer.prototype.width = function width() {
  return this.dataWidth*this.bitsPerBlock*this.blockWidth;
};

BinaryViewer.prototype.height = function height() {
  var datacol = Math.ceil(this.buffer.byteLength/this.dataWidth);
  return datacol*this.bitsPerBlock*this.blockHeight*8;
};

BinaryViewer.prototype.redraw = function redraw() {
  if (this.buffer === null || this.buffer === undefined) {
    console.error("Buffer for the BinaryViewer was null or undefined, no redraw.");
    return;
  }

  var context = this.canvas.getContext("2d");

  // Set width/height of the Canvas drawing area.
  this.el.width = context.canvas.width = this.width();
  this.el.height = context.canvas.height = this.height();

  context.fillStyle = "rgb(87,87,87,0.2)";
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  if (this.bitsPerBlock === 1) {
    this.paintBits(context);
  } else if (this.bitsPerBlock === 8) {
    this.paintBytes(context);
  }
};

BinaryViewer.prototype.paintBits = function paintBits(context) {
 // Paint the canvas with our bit view
 for(var idx=0; idx < this.buffer.length; idx++) {
   var ch = this.buffer[idx];
   var charsize = 8;

   for (i=0; i<charsize; i++){
     //Mask off that first bit
     var bit = (ch >> 7-i) & 0x1; // shift down from the leftmost bit

     // Where does this bit fit in it?
     var x = ((idx*charsize+i) % this.dataWidth)*this.blockWidth;
     var y = (Math.floor((idx*charsize+i)/this.dataWidth))*this.blockHeight;

     if(bit) { // on
       context.fillStyle = "rgb(255,255,255)";
       context.fillRect(x,y,this.blockWidth,this.blockHeight);
     } else { // off
       context.fillStyle = "rgb(0,0,0)";
       context.fillRect(x,y,this.blockWidth,this.blockHeight);
     }

   }

 }

};

BinaryViewer.prototype.paintBytes = function paintBytes(context) {
  // Paint the canvas with our byte view
  for(var idx=0; idx < this.buffer.length; idx++) {
    var ch = this.buffer[idx];

    // Find where this byte gets painted
    var x = (idx % this.dataWidth)*this.blockWidth;
    var y = (Math.floor(idx/this.dataWidth))*this.blockHeight;

    context.fillStyle = "rgb(" +  [ch,ch,ch].join() + ")";
    context.fillRect(x,y,this.blockWidth,this.blockHeight);

  }
};
