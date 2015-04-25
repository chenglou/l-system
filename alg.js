'use strict';

let toRad = deg => deg / 180 * Math.PI;

function genString(axiom, depth, rules) {
  let str = axiom;
  for (let i = 0; i < depth; i++) {
    if (str.length > 10000) {
      return null;
    }
    str = str.split('').map(c => rules[c] || c).join('');
  }

  return str;
}

function parse(startAngle, angle, len, str) {
  let currAngle = startAngle;
  let angleStack = [currAngle];
  let currPos = [0, 0];
  let posStack = [currPos];
  let ret = [];

  str.split('').forEach(c => {
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
      let x = Math.cos(toRad(currAngle)) * len;
      let y = Math.sin(toRad(currAngle)) * len;
      let destPos = [currPos[0] + x, currPos[1] - y];
      ret.push([currPos, destPos]);
      currPos = destPos;
    }
  });

  return ret;
}

module.exports = {genString, parse};
