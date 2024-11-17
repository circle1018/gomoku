const table=document.getElementById("table2");
let done=0,doing=0,Acnt=0;
let img=document.createElement("img");
function placeA(x,y,n){
    A[x][y]=n;
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            if(x+i>=0&&y+j>=0&&x+i<N&&y+j<N){
                C[x+i][y+j]+=1;
            }
            if(x+i*2>=0&&y+j*2>=0&&x+i*2<N&&y+j*2<N){
                C[x+i*2][y+j*2]+=0.5;
            }
        }
    }
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
function select(h1,square){
    let index=[{x:0,y:0}],win_rate=-Infinity;
    for(let i in p){
        let ind=Number(i);
        if(isNaN(ind))continue;
        let pw=p[ind].win;
        let pv=p[ind].visit;
        let rate=(pw/pv).toFixed(4);
        if(rate>win_rate){
            win_rate=rate;
            index=[{x:Math.floor(ind/N),y:ind%N}];
            cscore=C[Math.floor(ind/N)][ind%N];
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
}
function search(cnt,h1,square,n){
    if(p.visit<100){
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j])continue;
                if(C[i][j]<1)continue;
                A[i][j]=1;
                if(win(i,j)){
                    placeA(i,j,1);
                    h1.textContent="LOSE";
                    square.style.backgroundColor="rgba(255,255,255,0.5)";
                    done=1;
                    return;
                }
                A[i][j]=0;
                win(i,j);
            }
        }
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j])continue;
                if(C[i][j]<1)continue;
                A[i][j]=2;
                if(win(i,j)){
                    placeA(i,j,1);
                    win()
                    doing=0;
                    square.remove();
                    h1.remove();
                    Acnt+=2;
                    return;
                }
                A[i][j]=0;
                win(i,j);
            }
        }
        let place=[];
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j])continue;
                if(C[i][j]<1)continue;
                A[i][j]=1;
                win(i,j);
                for(let k=0;k<N;k++){
                    for(let l=0;l<N;l++){
                        if(A[k][l])continue;
                        if(C[k][l]<1)continue;
                        A[k][l]=1;
                        if(win(k,l)){
                            place.push({x:i,y:j});
                            place.push({x:k,y:l});
                        }
                        A[k][l]=0;
                        win(k,l);
                    }
                }
                A[i][j]=0;
                win(i,j);
            }
        }
        let chk=Array.from(Array(15),()=>Array(15).fill(0));
        if(place.length){
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    chk[i][j]=C[i][j];
                    C[i][j]=0;
                }
            }
            for(let i of place){
                C[i.x][i.y]=1;
            }
            for(let i=0;i<100;i++){
                MCTS(p,n,Acnt);
                p.visit++;
            }
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    C[i][j]=chk[i][j];
                }
            }
            select(h1,square);
            return;
        }
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j])continue;
                if(C[i][j]<1)continue;
                A[i][j]=2;
                win(i,j);
                for(let k=0;k<N;k++){
                    for(let l=0;l<N;l++){
                        if(A[k][l])continue;
                        if(C[k][l]<1)continue;
                        A[k][l]=2;
                        if(win(k,l)){
                            place.push({x:i,y:j});
                            place.push({x:k,y:l});
                        }
                        A[k][l]=0;
                        win(k,l);
                    }
                }
                A[i][j]=0;
                win(i,j);
            }
        }
        if(place.length){
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    chk[i][j]=C[i][j];
                    C[i][j]=0;
                }
            }
            for(let i of place){
                C[i.x][i.y]=1;
            }
            for(let i=0;i<100;i++){
                MCTS(p,n,Acnt);
                p.visit++;
            }
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    C[i][j]=chk[i][j];
                }
            }
            select(h1,square);
            return;
        }
    }
    if(cnt<=p.visit){
        select(h1,square);
        return;
    }
    for(let i=0;i<100;i++){
        MCTS(p,n,Acnt);
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
    square.style.width="100vw";
    square.style.height="100vh";
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
        p={win:0,visit:1};
        square.remove();
        h1.remove();
        doing=0;
        Acnt++;
        return;
    }
    setTimeout(function(){
        p={win:0,visit:1};
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