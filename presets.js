'use strict';

var presets = {
  pythagoras: {
    axiom: 'B',
    angle: 45,
    startAngle: 90,
    len: 6,
    rules: {
      'A': 'AA',
      'B': 'A[-B][+B]',
    },
  },
  koch: {
    axiom: 'F',
    angle: 90,
    startAngle: 180,
    len: 10,
    rules: {
      'F': 'F+F-F-F+F',
    },
  },
  sierpinski: {
    axiom: 'A',
    angle: 60,
    startAngle: 0,
    len: 10,
    rules: {
      'A': 'B-A-B',
      'B': 'A+B+A',
    },
  },
  sierpinski2: {
    axiom: 'F-A-A',
    angle: 120,
    startAngle: 0,
    len: 10,
    rules: {
      'F': 'F-A+F+A-F',
      'A': 'AA',
    },
  },
  dragon: {
    axiom: 'FX',
    angle: 90,
    startAngle: 0,
    len: 5,
    rules: {
      'X': 'X+YF+',
      'Y': '-FX-Y',
    },
  },
  plant: {
    axiom: 'X',
    angle: 25,
    startAngle: 65,
    len: 6,
    rules: {
      X: 'F-[[X]+X]+F[+FX]-X',
      F: 'FF',
    },
  },
  seaweed: {
    axiom: 'F',
    angle: 22,
    startAngle: 65,
    len: 9,
    rules: {
      F: 'FF-[-F+F+F]+[+F-F-F]',
    },
  },
};
