let N=15;
let A=Array.from(Array(N),()=>Array(N).fill(0));
let C=Array.from(Array(N),()=>Array(N).fill(0));
let p={visit:0,win:0};
function getRandom(min,max){
    return Math.floor((Math.random()*(max-min+1))+min);
}
function MCTS(P,num,depth){
    //UCT score
    let index=[],weight=-1;
    if(P.visit==0&&depth<3){
        let result=candidate(0);
        for(let i=0;i<result.length;i++)P[result[i][0]*15+result[i][1]]={win:0,visit:0};
    }
    if(depth<3){
        for(let obj in P){
            if(isNaN(Number(obj)))continue;
            let i=Math.floor(obj/15);
            let j=obj%15;
            let w=P[i*N+j]?P[i*N+j].win:0;
            let v=P[i*N+j]?P[i*N+j].visit:0;
            let score=(v==0)?(Infinity):((w/v)+Math.sqrt(2*Math.log(P.visit/v)));
            if(score>weight){
                weight=score;
                index=[{x:i,y:j}];
            }else if(score==weight){
                index.push({x:i,y:j});
            }
        }
    }else{
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j])continue;
                if(C[i][j]<1)continue;
                let w=P[i*N+j]?P[i*N+j].win:0;
                let v=P[i*N+j]?P[i*N+j].visit:0;
                let score=(v==0)?(Infinity):((w/v)+Math.sqrt(2*Math.log(P.visit/v)));
                if(score>weight){
                    weight=score;
                    index=[{x:i,y:j}];
                }else if(score==weight){
                    index.push({x:i,y:j});
                }
            }
        }
    }
    if(index.length==0){
        return 0;
    }
    index=index[getRandom(0,index.length-1)];

    //Select
    let x=index.x;
    let y=index.y;
    A[x][y]=num;
    let key=x*N+y;
    if(!(key in P)){
        P[key]={win:0,visit:0};
    }
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            let nx=x+j,ny=y+j;
            if(nx<0||ny<0||nx>=N||ny>=N)continue;
            C[nx][ny]++;
        }
    }
    //Result
    let result;
    if(win(x,y,num))result=num;
    else result=MCTS(P[key],(num==1?2:1),depth+1);
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            let nx=x+j,ny=y+j;
            if(nx<0||ny<0||nx>=N||ny>=N)continue;
            C[nx][ny]--;
        }
    }
    A[x][y]=0;
    win(x,y,0);
    if(result==num)P[key].win+=1;
    else if(result==0)P[key].win+=0.5
    P[key].visit++;
    return result;
}