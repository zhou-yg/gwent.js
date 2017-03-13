require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from '../../bin/types'

const socket = io();

socket.on('log',function (a){
  console.log('log:',a);
  logObj.log(a);
});

const store = createStore(socket,{
  browser:true,
});

socket.emit('new user');


const boardDOM = document.querySelector('#board');


const logObj = {
  $el: document.querySelector('#log'),
  data:{
    list:[],
    i:0,
  },
  log (str) {
    str = String(str);
    if(this.data.list.length >= 3){
      this.data.list = this.data.list.slice(0,2);
    }
    this.data.list = [str].concat(this.data.list);
    this.data.i++;
    this.render();
  },
  render(){
    const frag = document.createDocumentFragment();
    this.data.list.map((str,i)=>{
      var p = document.createElement('p')
      p.className = 'log-one';
      p.innerText = (this.data.i + i)+'.'+str;
      frag.appendChild(p);
    });
    this.$el.innerHTML = '';
    this.$el.appendChild(frag);
  }
};

class UserList {

  constructor(socket){

    this.container = document.querySelector('#userList');

    this.socket = socket;
    this.socket.on('users',(list)=>{

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

        grid.className = 'grid';

        this.addEvent(grid,i,j);


        grid.onclick = () => {

            var boardIndex = store.getState().boardIndex;
            var select = store.getState().selectChess;

            if(select){

              var clickedObj = boardIndex[i][j];

              console.log(clickedObj)

              if(clickedObj && clickedObj.type === 'move'){

                store.dispatch({
                  type: types.CHESS_MOVE,
                  from: gwentTypes.BROWSER_TAG,
                  selectChess: select,
                  to: {
                    x: j,
                    y: i,
                  }
                });
                store.dispatch({
                  type:types.CLEAR_CHESS,
                });
              }else{
                logObj.log('只能移动到绿色方块');
              }

            }else{
              logObj.log('当前没选中');
            }
        }

        if(v instanceof Horse || v.type === 'Horse'){

          grid.className = 'grid horse';
          grid.onclick = () => {

            store.dispatch({
              type:types.SELECT_CHESS,
              chessType:'Horse',
              y:i,
              x:j
            });

            logObj.log(`选择了${j},${i}`);
          }
        }else if(v.type === 'move'){
          grid.className = 'grid move';
        }else if(v){
          grid.className = 'grid horse2';
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
      var enemyObj = enemy[i] && enemy[i][j];
      if(enemyObj){
        enemyObj.type = 'Enemy';
        return enemyObj;
      }
      return code;
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

window.add(1);