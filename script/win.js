let W1=Array(N*N).fill(0);// |
let W2=Array(N*N).fill(0);// _
let W3=Array(N*N).fill(0);// \
let W4=Array(N*N).fill(0);// /
let _5ir=0;
let _6ir=0;
function win(x,y){
    let m=0;
    for(let i=x,j=y;i<N;i++){
        let t=W1[i*N+j];
        let tx=i-1,ty=j;
        if(tx>=0&&tx<N&&ty<N&&ty>=0&&A[tx][ty]==A[i][j]&&A[i][j]){
            W1[i*N+j]=W1[(tx)*N+ty]+1;
        }else W1[i*N+j]=A[i][j]?1:0;
        m=Math.max(m,W1[i*N+j]);
        if(t==6)_6ir--;
        if(t==5)_5ir--;
        if(W1[i*N+j]==6)_6ir++;
        if(W1[i*N+j]==5)_5ir++;
        if(t==W1[i*N+j]&&(i!=x&&j!=y))break;
    }
    for(let i=x,j=y;j<N;j++){
        let t=W2[i*N+j];
        let tx=i,ty=j-1;
        if(tx>=0&&tx<N&&ty<N&&ty>=0&&A[tx][ty]==A[i][j]&&A[i][j]){
            W2[i*N+j]=W2[(tx)*N+ty]+1;
        }else W2[i*N+j]=A[i][j]?1:0;
        m=Math.max(m,W2[i*N+j]);
        if(t==6)_6ir--;
        if(t==5)_5ir--;
        if(W2[i*N+j]==6)_6ir++;
        if(W2[i*N+j]==5)_5ir++;
        if(t==W2[i*N+j]&&(i!=x&&j!=y))break;
    }
    for(let i=x,j=y;i<N&&j<N;i++,j++){
        let t=W3[i*N+j];
        let tx=i-1,ty=j-1;
        if(tx>=0&&tx<N&&ty<N&&ty>=0&&A[tx][ty]==A[i][j]&&A[i][j]){
            W3[i*N+j]=W3[(tx)*N+ty]+1;
        }else W3[i*N+j]=A[i][j]?1:0;
        m=Math.max(m,W3[i*N+j]);
        if(t==6)_6ir--;
        if(t==5)_5ir--;
        if(W3[i*N+j]==6)_6ir++;
        if(W3[i*N+j]==5)_5ir++;
        if(t==W3[i*N+j]&&(i!=x&&j!=y))break;
    }
    for(let i=x,j=y;i<N&&j>=0;i++,j--){
        let t=W4[i*N+j];
        let tx=i-1,ty=j+1;
        if(tx>=0&&tx<N&&ty<N&&ty>=0&&A[tx][ty]==A[i][j]&&A[i][j]){
            W4[i*N+j]=W4[(tx)*N+ty]+1;
        }else W4[i*N+j]=A[i][j]?1:0;
        m=Math.max(m,W4[i*N+j]);
        if(t==6)_6ir--;
        if(t==5)_5ir--;
        if(W4[i*N+j]==6)_6ir++;
        if(W4[i*N+j]==5)_5ir++;
        if(t==W4[i*N+j]&&(i!=x&&j!=y))break;
    }
    if(rule=="free")return m>4?1:0;
    if(rule=="standard")return _5ir-_6ir;
}