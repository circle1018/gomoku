const table=document.getElementById("table2");
let done=0,doing=0,Acnt=0,lx=7,ly=7;
function placeA(x,y,n){
    A[x][y]=n;
    for(let i=-2;i<=2;i++){
        for(let j=-2;j<=2;j++){
            if(x+i<0||y+j<0||x+i>N-1||y+j>N-1)continue;
            C[x+i][y+j]+=1;
            if(Math.max(Math.abs(j),Math.abs(i))==2)C[x+i][y+j]-=0.5;
            if(Math.abs(j)+Math.abs(i)==3)C[x+i][y+j]-=0.5;
        }
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
        console.log("win_rate: "+((win_rate/2+0.5)*100).toFixed(2)+"%");
        index=index[getRandom(0,index.length-1)];
        p=p[index.x*N+index.y];
        placeA(index.x,index.y,1);
        lx=index.x,ly=index.y;
        table.rows[index.x].cells[index.y].innerText="\u25EF";
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
    for(let i=0;i<200;i++){
        let result=MCTS(p,n,Acnt);
        if(result.win==n)p.win+=result.score;
        else p.win-=result.score;
        p.visit++;
    }
    // console.log(p.win/p.visit);
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
    table.rows[x].cells[y].innerText="\u26AA";
    table.rows[lx].cells[ly].innerText="\u26AB";
    const square=document.createElement('div');
    square.style.backgroundColor="rgba(255,255,255,0.2)";
    square.style.zIndex="500";
    square.style.width="100vw";
    square.style.height="100vh";
    document.body.appendChild(square);

    const h1=document.createElement("h3");
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
        lx=index.x,ly=index.y;
        table.rows[index.x].cells[index.y].innerText="\u25EF";
        p={win:0,visit:1};
        square.remove();
        h1.remove();
        doing=0;
        Acnt++;
        return;
    }
    setTimeout(function(){
        if(!(x*N+y in p)){
            p={win:0,visit:1};
        }else p=p[x*N+y];
        search(20000,h1,square,1);
    },0);
});
placeA(7,7,1);
win(7,7,1);
table.rows[7].cells[7].innerText="\u25EF";
for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
        table.rows[i].cells[j].style.border='none';
    }
}
