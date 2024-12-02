let score=Array.from(new Array(15),()=>Array(15).fill(0));
function candidate(depth,num,ni,nj){
    if(depth==4)return win(ni,nj);
    if(depth==0){
        score=Array.from(new Array(15),()=>Array(15).fill(0));
        candidate(depth+1,1,0,0);
        candidate(depth+1,2,0,0);
        let index=[];
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j]||C[i][j]<0)continue;
                index.push({value:score[i][j]*8+C[i][j],index:[i,j]});
            }
        }
        index.sort((a,b)=>b.value-a.value);
        return index.slice(0,4).map(item=>item.index);
    }else{
        win(ni,nj);
        let cnt=0;
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A[i][j]||C[i][j]<1)continue;
                A[i][j]=num;
                for(let p=-1;p<=1;p++){
                    for(let q=-1;q<=1;q++){
                        let nx=i+p,ny=j+q;
                        if(nx<0||ny<0||nx>=N||ny>=N)continue;
                        C[nx][ny]++;
                    }
                }
                let result=candidate(depth+1,num,i,j);
                cnt+=result;
                score[i][j]+=result;
                A[i][j]=0;
                win(i,j);
                for(let p=-1;p<=1;p++){
                    for(let q=-1;q<=1;q++){
                        let nx=i+p,ny=j+q;
                        if(nx<0||ny<0||nx>=N||ny>=N)continue;
                        C[nx][ny]--;
                    }
                }
            }
        }
        return cnt;
    }
}