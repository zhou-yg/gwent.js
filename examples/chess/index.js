require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers'
import gwentTypes from '../../bin/types'

const socket = io();

const store = createStore(socket);

window.S = store;



const boardDOM = document.querySelector('#board');

class Horse {

  constructor(x,y){

    this.type = 'Horse';
    this.x = x;
    this.y = y;

  }

  goCheck(x,y) {

    return Math.abs(x - this.x) === 1 && Math.abs(y - this.y) === 2
  }

  go(x,y){

    if(this.goCheck(x,y)){
      this.x = x;
      this.y = y;
    }
  }
}

class ChessBoard {

  constructor(){

    this.INIT_CODE = INIT_CODE;

  }

  addEvent(dom,i,j){

    dom.onclick = () => {

      const v = this.index[i][j];

      console.log(v);
    }
  }

  render(container){

    const INIT_CODE = this.INIT_CODE;

    const frag = document.createDocumentFragment();

    this.index.forEach((row,i)=>{

      const div = document.createElement('div');
      div.className = 'grid-box';

      frag.appendChild(div);

      row.forEach((v,j)=>{

        let grid = document.createElement('div');
        div.appendChild(grid);


        this.addEvent(grid,i,j);

        if(v === INIT_CODE){

          grid.className = 'grid';


        }else if(v instanceof Horse || v.type === 'Horse'){

          grid.className = 'grid horse';
        }
      });
    });

    container.innerHTML = '';
    container.appendChild(frag);

    return frag;
  }
}

const chessBoard = new ChessBoard();

store.subscribe(()=>{

  chessBoard.index = store.getState().boardIndex;

  chessBoard.render(boardDOM);
});

store.dispatch({
  type:types.CHESS_ADD,
  horse:new Horse(0,7),
});

window.add = function (x){

  store.dispatch({
    type:types.CHESS_ADD,
    from:gwentTypes.BROWSER_TAG,
    horse:new Horse(x,7),
  });
}


//chessBoard.render(boardDOM)