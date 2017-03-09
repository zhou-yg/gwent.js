require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from '../../bin/types'

const socket = io();

socket.on('log',function (a){
  console.log('log:',a);
});

const store = createStore(socket,{
  browser:true,
});

socket.emit('new user');


const boardDOM = document.querySelector('#board');

class UserList {

  constructor(socket){

    this.container = document.querySelector('#userList');

    this.socket = socket;
    this.socket.on('users',(list)=>{
      console.log('users');
      this.list = list.map(obj=>{

        return {
          username:obj.username,
        }
      });

      this.render();
    });
  }

  render(){

    const frag = this.list.map(obj=>{
      const li = document.createElement('li');
      li.innerText = obj.username;
      li.onclick = () => {

        this.socket.emit('match user',obj.username);
      };

      return li;
    }).reduce((frag,li)=>{
      frag.appendChild(li);
      return frag;
    },document.createDocumentFragment());

    this.container.innerHTML = '';
    this.container.appendChild(frag);
  }
}


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
          grid.onclick = () => {

            if(this.selectChess){
              store.dispatch({
                type:types.CHESS_MOVE,
                from:gwentTypes.BROWSER_TAG,
                selectChess:this.selectChess,
                to:{
                  x:j,
                  y:i,
                }
              });
              this.selectChess = null;
            }else{
              console.log('当前没选中')
            }
          }

        }else if(v instanceof Horse || v.type === 'Horse'){

          grid.className = 'grid horse';
          grid.onclick = () => {
            this.selectChess = {
              type:'Horse',
              y:i,
              x:j
            }
          }
        }
      });
    });

    container.innerHTML = '';
    container.appendChild(frag);

    return frag;
  }
}

const chessBoard = new ChessBoard();

const userList = new UserList(socket);

store.subscribe(()=>{

  const s = store.getState();
  var index = s.boardIndex;
  var enemy = s.player;

  const final = index.map((row,i)=>{
    return row.map((code,j)=>{
      return (enemy[i] && enemy[i][j]) || code;
    });
  });

  chessBoard.index = final;

  chessBoard.render(boardDOM);
});

window.add = function (x){

  store.dispatch({
    type:types.CHESS_ADD,
    from:gwentTypes.BROWSER_TAG,
    horse:new Horse(x,7),
  });
};
