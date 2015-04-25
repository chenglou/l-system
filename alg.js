'use strict';

function toRad(deg) {
  return deg / 180 * Math.PI;
}

function genString(axiom, depth, rules) {
  var str = axiom;
  for (var i = 0; i < depth; i++) {
    if (str.length > 10000) {
      return null;
    }
    str = str.split('').map(function(c) {
      return rules[c] ? rules[c] : c;
    }).join('');
  }

  return str;
}

function parse(startAngle, angle, len, str) {
  var currAngle = startAngle;
  var angleStack = [currAngle];
  var currPos = [0, 0];
  var posStack = [currPos];
  var ret = [];

  str.split('').forEach(function(c) {
    if (c === '[') {
      posStack.push(currPos);
      angleStack.push(currAngle);
    } else if (c === ']') {
      currAngle = angleStack.pop();
      currPos = posStack.pop();
    } else if (c === '+') {
      currAngle -= angle;
    } else if (c === '-') {
      currAngle += angle;
    } else if (c >= 'A' && c <= 'F') {
      // every other letter is ignored
      var x = Math.cos(toRad(currAngle)) * len;
      var y = Math.sin(toRad(currAngle)) * len;
      var destPos = [
        currPos[0] + x,
        currPos[1] - y,
      ];
      ret.push([currPos, destPos]);
      currPos = destPos;
    }
  });

  return ret;
}

module.exports = {genString, parse};
