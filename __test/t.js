/**
 * Created by zyg on 17/3/17.
 */
'use strict';

var obj = {
  name: 'obj',
  fullName(){
    return 'full - '+this.name;
  },
  showFullName(){
    return 'show fullName is:' + this.fullName + this.name;
  },
  watch: {
    name(){
      console.log('this.name is changed');
    },
    fullName(){
      console.log('this.fullName is changed');
    },
    showFullName(){
      console.log('this.showFullname is changed');
    }
  },
  '$watchs':{},
};

const targetStack = [];
function pushTarget (t) {
  if(Dep.target){
    targetStack.push(Dep.target);
  }
  Dep.target = t;
}
function popTarget (){
  Dep.target = targetStack.pop();
}
class Dep {

}

class Watcher {

  constructor(instance,key){
    let w = this;
    let data = instance[key];

    this.instance = instance;
    this.key = key;
    this.value = null;
    this.parents = new Set();
    this.subs = [];

    if(typeof data !== 'function'){
      Object.defineProperty(instance,key,{
        set(v){
          w.value = v;
          w.subs.forEach(fn=>{
            fn.call(instance);
          });

          w.parents.forEach(watchObj=>{
            watchObj.update();
          });
        },
        get(){
          if(Dep.target){
            w.parents.add(Dep.target);
          }
          return w.value;
        }
      });
    }else{
      Object.defineProperty(instance,key,{
        set(v){
        },
        get(){
          pushTarget(w);
          w.value = data.call(instance);
          popTarget();
          return w.value;
        }
      });
    }
    this.value = instance[key];

    if(!instance.$watchs){
      instance.$watchs = {};
    }
    instance.$watchs[key] = this;

  }

  register(fn){
    this.subs.push(fn);
  }

  update(){
    this.value = this.instance[this.key];

    this.subs.forEach(fn=>{
      fn.call(this.instance,this.value);
    });
    this.parents.forEach(watchObj=>{
      watchObj.update();
    })
  }
}

const w0 = new Watcher(obj,'name');
const w1 = new Watcher(obj,'fullName');
const w2 = new Watcher(obj,'showFullName');

for(let watchKey in obj.watch){

  obj.$watchs[watchKey].register(obj.watch[watchKey]);
}

obj.name = 1;
console.log(obj.fullName);
obj.name = 2;
console.log(obj.showFullName);
