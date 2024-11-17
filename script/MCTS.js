let N=15;
let A=Array.from(Array(N),()=>Array(N).fill(0));
let C=Array.from(Array(N),()=>Array(N).fill(0));
let p={visit:1,win:0};
function getRandom(min,max){
    return Math.floor((Math.random()*(max-min+1))+min);
}
function MCTS(P,num,depth){
    //init
    let index=[];
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if(A[i][j])continue;
            if(C[i][j]<1)continue;
            index.push({x:i,y:j});
        }
    }
    if(index.length==0||depth>50){
        return {win:0,score:0};
    }
    index=index[getRandom(0,index.length-1)];
    //select
    let x=index.x;
    let y=index.y;
    A[x][y]=num;
    let chk=Array.from(Array(5),()=>Array(5).fill(0));
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            if(x+i<0||y+j<0||x+i>N-1||y+j>N-1)continue;
            C[x+i][y+j]+=1,chk[i+2][j+2]+=1;
        }
    }
    let key=x*N+y;
    if(!(key in P)){
        P[key]={win:0,visit:1};
    }

    //result
    let result;
    if(win(x,y,num))result={win:num,score:1};
    else result=MCTS(P[key],(num==1?2:1),depth+1);
    A[x][y]=0;
    win(x,y,0);
    for(let i=-2;i<=2;i++){
        for(let j=-2;j<=2;j++){
            if(!chk[i+2][j+2])continue;
            C[x+i][y+j]-=chk[i+2][j+2];
        }
    }
    if(result.win==num)P[key].win+=result.score*0.5;
    else P[key].win-=result.score*2;
    P[key].visit++;
    return result;
}
