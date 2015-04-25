'use strict';

let {genString, parse} = require('./alg');
let React = require('react');
let presets = require('./presets');

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function encodeRulesText(rules) {
  return Object.keys(rules).map(from => `${from}: ${rules[from]};`).join('\n');
}

function decodeRulesText(text) {
  let ret = {};
  let rules = text.replace(/\s/g, '').split(';');
  rules.splice(-1);
  rules.forEach(r => {
    r = r.split(':');
    ret[r[0]] = r[1];
  });

  return ret;
}

var Board = React.createClass({
  getInitialState() {
    return {
      clickedPos: null,
      pos: [400, 500],
    };
  },

  draw() {
    let can = this.refs.can.getDOMNode();
    let ctx = can.getContext('2d');
    ctx.clearRect(0, 0, 9999, 9999);
    ctx.strokeStyle = 'rgb(76, 94, 61)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    let [posX, posY] = this.state.pos;
    this.props.coords.forEach(([[currX, currY], [destX, destY]]) => {
      ctx.beginPath();
      ctx.moveTo(currX + posX, currY + posY);
      ctx.lineTo(destX + posX, destY + posY);
      ctx.stroke();
    });
  },

  componentDidMount: () => this.draw(),
  componentDidUpdate: () => this.draw(),

  handleMouseDown: function(e) {
    this.setState({
      clickedPos: [e.pageX, e.pageY],
    });
  },

  handleMouseUp: function() {
    this.setState({
      clickedPos: null,
    });
  },

  handleMouseMove: function(e) {
    var s = this.state;
    if (!s.clickedPos) {
      return;
    }
    var dx = e.pageX - s.clickedPos[0];
    var dy = e.pageY - s.clickedPos[1];
    this.setState({
      pos: [s.pos[0] + dx, s.pos[1] + dy],
      clickedPos: [e.pageX, e.pageY],
    });
  },

  render: function() {
    return (
      <canvas {...this.props}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref="can"
        width={999}
        height={999}>
      </canvas>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      depth: 4,
      settings: clone(presets.pythagoras),
      rulesText: encodeRulesText(presets.pythagoras.rules),
    };
  },

  handleChangeState: function(key, e) {
    this.setState({
      [key]: e.target.value,
    });
  },

  handleButtonClick: function(value) {
    var settings = clone(presets[value]);
    this.setState({
      settings: settings,
      rulesText: encodeRulesText(settings.rules),
    });
  },

  handleSettings: function(category, e) {
    var value;
    if (category === 'axiom') {
      value = e.target.value;
    } else {
      value = parseInt(e.target.value);
    }
    this.state.settings[category] = value;
    this.setState(this.state);
  },

  render: function() {
    var s = this.state;
    var settings = s.settings;
    var maybeBoard;
    var str = genString(settings.axiom, s.depth, decodeRulesText(s.rulesText));
    if (str == null) {
      maybeBoard = <div style={{float: 'right'}}>Too many iterations for this pattern.</div>;
    } else {
      var coords = parse(settings.startAngle, settings.angle, settings.len, str);
      maybeBoard = <Board coords={coords}/>;
    }

    return (
      <div style={{WebkitUserSelect: 'none'}}>
        <div style={{position: 'absolute', backgroundColor: 'rgb(228, 229, 212)', padding: 10}}>
          <div>Preset</div>
          <button onClick={this.handleButtonClick.bind(null, 'pythagoras')}>Pythagoras</button>
          <button onClick={this.handleButtonClick.bind(null, 'sierpinski')}>Sierpinski</button>
          <button onClick={this.handleButtonClick.bind(null, 'seaweed')}>Seaweed</button>
          <div></div>
          <button onClick={this.handleButtonClick.bind(null, 'dragon')}>Dragon</button>
          <button onClick={this.handleButtonClick.bind(null, 'koch')}>Koch</button>
          <button onClick={this.handleButtonClick.bind(null, 'sierpinski2')}>Sierpinski2</button>
          <button onClick={this.handleButtonClick.bind(null, 'plant')}>Plant</button>
          <div>Iteration</div>
          <input
            type="range"
            value={s.depth}
            onChange={this.handleChangeState.bind(null, 'depth')}
            min={0}
            max={12}
            />
          {s.depth}
          <div>Angle</div>
          <input
            type="range"
            value={settings.angle}
            onChange={this.handleSettings.bind(null, 'angle')}
            min={0}
            max={360}
            step={5}
            />
          {settings.angle}
          <div>Start Angle</div>
          <input
            type="range"
            value={settings.startAngle}
            onChange={this.handleSettings.bind(null, 'startAngle')}
            min={0}
            max={360}
            step={5}
            />
          {settings.startAngle}
          <div>Length</div>
          <input
            type="range"
            value={settings.len}
            onChange={this.handleSettings.bind(null, 'len')}
            min={1}
            max={20}
            />
          {settings.len}
          <div>Start</div>
          <input
            value={settings.axiom}
            onChange={this.handleSettings.bind(null, 'axiom')}
            />
          <div>Rules (G-Z ignored)</div>
          <textarea
            rows={5}
            value={s.rulesText}
            onChange={this.handleChangeState.bind(null, 'rulesText')}
            />
        </div>
        {maybeBoard}
      </div>
    );
  }
});

React.render(<App></App>, document.getElementById('container'));
