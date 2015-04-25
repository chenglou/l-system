'use strict';

let {genString, parse} = require('./alg');
let React = require('react');
let presets = require('./presets');

function encodeRulesText(rules) {
  return Object.keys(rules).map(from => `${from}: ${rules[from]};`).join('\n');
}

function decodeRulesText(text) {
  let ret = {};
  let rules = text.replace(/\s/g, '').split(';').map(r => r.split(':'));
  rules.splice(-1);
  rules.forEach(r => ret[r[0]] = r[1]);

  return ret;
}

var Board = React.createClass({
  draw: function() {
    let can = this.refs.can.getDOMNode();
    let ctx = can.getContext('2d');
    ctx.clearRect(0, 0, 9999, 9999);
    ctx.strokeStyle = 'rgb(76, 94, 61)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    this.props.coords.forEach(([[currX, currY], [destX, destY]]) => {
      ctx.beginPath();
      ctx.moveTo(currX, currY);
      ctx.lineTo(destX, destY);
      ctx.stroke();
    });
  },

  componentDidMount: function() {
    this.draw();
  },

  componentDidUpdate: function() {
    this.draw();
  },

  render: function() {
    return <canvas {...this.props} ref="can"width={999} height={999} />;
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      depth: 4,
      settings: presets.pythagoras,
      rulesText: encodeRulesText(presets.pythagoras.rules),

      clickedPos: null,
      pos: [400, 500],
    };
  },

  handleButtonClick: function(value) {
    this.setState({
      settings: presets[value],
      rulesText: encodeRulesText(presets[value].rules),
    });
  },

  handleSettings: function(category, {target: {value}}) {
    this.setState({
      settings: {
        ...this.state.settings,
        [category]: category === 'axiom' ? value : parseInt(value),
      },
    });
  },

  handleMouseMove: function(e) {
    if (!this.state.clickedPos) {
      return;
    }
    let {clickedPos: [cx, cy], pos: [x, y]} = this.state;
    this.setState({
      pos: [x + (e.pageX - cx), y + (e.pageY - cy)],
      clickedPos: [e.pageX, e.pageY],
    });
  },

  render: function() {
    var s = this.state;
    var settings = s.settings;
    var maybeBoard;
    var str = genString(settings.axiom, s.depth, decodeRulesText(s.rulesText));
    if (str == null) {
      maybeBoard = <div style={{float: 'right'}}>Too many iterations for this pattern.</div>;
    } else {
      let coords =
        parse(settings.startAngle, settings.angle, settings.len, str)
        .map(([[x1, y1], [x2, y2]]) => [
          [x1 + s.pos[0], y1 + s.pos[1]],
          [x2 + s.pos[0], y2 + s.pos[1]],
        ]);
      maybeBoard =
        <Board
          coords={coords}
          onMouseDown={e => this.setState({clickedPos: [e.pageX, e.pageY]})}
          onMouseUp={() => this.setState({clickedPos: null})}
          onMouseMove={this.handleMouseMove} />;
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
            onChange={e => this.setState({depth: e.target.value})}
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
            onChange={e => this.setState({rulesText: e.target.value})}
            />
        </div>
        {maybeBoard}
      </div>
    );
  }
});

React.render(<App />, document.getElementById('container'));
