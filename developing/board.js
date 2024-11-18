const table=document.getElementById("table2");
let done=0,doing=0,Acnt=0;
let img=document.createElement("img");
function placeA(x,y,n){
    A[x][y]=n;
    if(n==1){
        img.src="./images/white.png";
        img=document.createElement("img");
        img.src="./images/black_last.png";
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
    if(n==2){
        img.src="./images/black.png";
        img=document.createElement("img");
        img.src="./images/white_last.png";
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
}
function search(cnt,h1,square,n){
    if(cnt<=p.visit){
        let index=[{x:0,y:0}],win_rate=-Infinity;
        for(let i in p){
            let ind=Number(i);
            if(isNaN(ind))continue;
            let pw=p[ind].win;
            let pv=p[ind].visit;
            let rate=(pw/pv);
            if(rate>win_rate){
                win_rate=rate;
                index=[{x:Math.floor(ind/N),y:ind%N}];
            }else if(rate==win_rate)index.push({x:Math.floor(ind/N),y:ind%N});
        }
        index=index[getRandom(0,index.length-1)];
        p=p[index.x*N+index.y];
        placeA(index.x,index.y,1);
        if(win(index.x,index.y,1)){
            h1.textContent="LOSE";
            square.style.backgroundColor="rgba(255,255,255,0.5)";
            done=1;
            return;
        }
        doing=0;
        square.remove();
        h1.remove();
        Acnt+=2;
        return;
    }
    for(let i=0;i<100;i++){
        MCTS(p,n,1);
        p.visit++;
    }
    h1.textContent=`Thinking(${(Math.min(100,p.visit/cnt*100).toFixed(0))}%)`;
    setTimeout(function(){search(cnt,h1,square,n)},0)
}
table.addEventListener("click",function(event){
    if(done||doing)return;
    const x=event.target.parentNode.rowIndex;
    const y=event.target.cellIndex;
    if(A[x][y]||y>N-1||x>N-1||y<0||x<0)return;
    doing=1;
    placeA(x,y,2);
    const square=document.createElement('div');
    square.style.backgroundColor="rgba(255,255,255,0.2)";
    square.style.zIndex="500";
    square.style.width="100%";
    square.style.height="100%";
    square.style.margin=0;
    square.style.padding=0;
    document.body.appendChild(square);

    const h1=document.createElement("h1");
    h1.textContent="Thinking(0%)";
    h1.style.position="absolute";
    h1.style.zIndex="1000";
    document.body.appendChild(h1);
    if(win(x,y,2)){
        h1.textContent="WIN";
        square.style.backgroundColor="rgba(255,255,255,0.5)";
        done=1;
        return;
    }
    if(Acnt==0){
        let index=[];
        for(let i=6;i<8;i++){
            for(let j=6;j<8;j++){
                if(!A[i][j])index.push({x:i,y:j});
            }
        }
        index=index[getRandom(0,index.length-1)];
        placeA(index.x,index.y,1);
        win(index.x,index.y,1);
        p={win:0,visit:0};
        square.remove();
        h1.remove();
        doing=0;
        Acnt++;
        return;
    }
    setTimeout(function(){
        p={win:0,visit:0};
        search(10000,h1,square,1);
    },0);
});
placeA(7,7,1);
win(7,7,1);
for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
        table.rows[i].cells[j].style.border='none';
    }
}