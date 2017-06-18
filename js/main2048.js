var board=new Array(); //存储游戏数据,一维数组
var score=0;//初始得分；
var has_conflicted=new Array();

// 触控事件
var start_x=0;
var start_y=0;
var end_x=0;
var end_y=0;

//执行游戏
$(document).ready(function(){
    prepareForMobile();
    loadBestScore();
    newGame();
})

function prepareForMobile(){
    if(document_width>500){
        grid_container_width=500;
        cell_space=20;
        cell_side_length=100;
    }
        $("#grid-container").css("width",grid_container_width-2*cell_space);
        $("#grid-container").css("height",grid_container_width-2*cell_space);
        $("#grid-container").css("padding",cell_space);
        $("#grid-container").css("border-radius",0.02*grid_container_width);

        $(".grid-cell").css("width",cell_side_length);
        $(".grid-cell").css("height",cell_side_length);
        $(".grid-cell").css("border-radius",0.02*cell_side_length);
    
}

function newGame(){

    score=0;
    init();//初始化棋盘
    
    //随机选择两个格子生成数字
    generateOneNumber();
    
    generateOneNumber();

    score=0;
}

function init(){
    //生成16个棋盘小格子
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var grid_cell=$("#grid-cell-"+i+"-"+j);
            grid_cell.css("top",getPosTop(i,j));
            grid_cell.css("left",getPosLeft(i,j));
               
        }
    }
    
    //初始化16个棋盘的数字
    for(var i=0;i<4;i++){
        board[i]=new Array(); 
        has_conflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            has_conflicted[i][j]=false;
        }
    }
    
    //有操作，更新界面
    updateBoardView();
    $("#score").text(score);
    
    
}

function updateBoardView(){
    //移除所有数字方块
    $(".number-cell").remove();
    //遍历所有方格，添加数字方块
     for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var the_number_cell=$("#number-cell-"+i+"-"+j);
            //数字方块值为零，宽高为0
            if(board[i][j]==0){
                the_number_cell.css("width",0);
                the_number_cell.css("height",0);
                the_number_cell.css("top",getPosTop(i,j) + cell_side_length/2 );
                the_number_cell.css("left",getPosLeft(i,j) + cell_side_length/2 );    
            }else{//值不为0，设置宽高、前后景色
                the_number_cell.css("width",cell_side_length);
                the_number_cell.css("height",cell_side_length);
                the_number_cell.css("top",getPosTop(i,j));
                the_number_cell.css("left",getPosLeft(i,j));
                the_number_cell.css("background-color",getNumberBackgroundColor( board[i][j] ) );
                the_number_cell.css("color",getNumberColor( board[i][j] ) );
                the_number_cell.text(board[i][j]);
                
                
            };
            has_conflicted[i][j]=false;
        }
     }
     $(".number-cell").css("line-height",cell_side_length+"px");
     $(".number-cell").css("font-size",0.5*cell_side_length+"px");
     
}

function generateOneNumber(){
    //判断是否有空格子可以生成数字
    if(noSpace(board)){
        return false;
    };
   
    // 获取所有空格子
    var space_grid=new Array();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){;
                var value=i*4+j;//储存i,j数据
                space_grid.push(value);
            }
        }
    }
    var len=space_grid.length;
    //随机获取一个空格子
    var count=space_grid[Math.floor(Math.random()*len)];

    //在空格子里随机生成两个坐标
    var randX=Math.floor(count/4);
    var randY=Math.floor(count%4);
    // var times=0;
    // //判断坐标所在格子是否为空
    // while(times<50){
    //     if(board[randX][randY]==0){
    //         break;
    //     }
    //     randX=Math.floor(Math.random()*4);
    //     randY=Math.floor(Math.random()*4);
    //     times++;
    // }
    // if(times==50){
    //     for(var i=0;i<4;i++){
    //         for(var j=0;j<4;j++){
    //             if(board[i][j]==0){
    //                 randX=i;
    //                 randY=j;
    //                 break;
    //             }
    //         }
    //     }
    // }
    
    
    var rand_number=Math.random()<0.5?2:4;
    
    board[randX][randY]=rand_number;
    showNumberWithAnimation(randX,randY,rand_number);//生成数字动画
    return true;
}

//玩家操作事件监听
$(document).keydown(function(e){
    
    switch(e.keyCode){
        case 37://left
            if(moveLeft()){
                e.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",400);
            }
            break;
        case 38://up
            if(moveUp()){
                e.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",400);
            }
            break;
        case 39://right
            if(moveRight()){
                e.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",400);
            }
            break;
        case 40://down
            if(moveDown()){
                e.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",400);
            }
        default://default
            break;
    }
})

document.addEventListener("touchstart",function(e){
    start_x=e.touches[0].pageX;
    start_y=e.touches[0].pageY;
})

document.addEventListener("touchmove",function(e){
    e.preventDefault();
})

document.addEventListener("touchend",function(e){
    end_x=e.changedTouches[0].pageX;
    end_y=e.changedTouches[0].pageY;

    var delta_x=end_x-start_x;
    var delta_y=end_y-start_y;

    // 判断是否是滑动意图
    if(Math.abs(delta_x)<0.3*document_width&&Math.abs(delta_y)<0.3*document_width){
        return;
    }
    
    if(Math.abs(delta_x)>Math.abs(delta_y)){
        if(delta_x>0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            
        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }else{
        if(delta_y>0){
            //move down
             if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
})

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        gameOver();
    }
}

function gameOver(){
    $("#mask").show();
    $("#game-over").show();
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    //moveLeft
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && has_conflicted[i][k]==false){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        has_conflicted[i][k]=true;
                        // add score
                        score += board[i][k];
                        updateScore(score);
                        if(score>best_score){
                            updateBestScore(score);
                        }
                        continue;
                    }
                }
            }
        } 
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    //moveRight
    for(var i=0;i<4;i++){
        for(var j=2;j>-1;j--){
            if(board[i][j]!=0){
                for(var k=4;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board) ){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && has_conflicted[i][k]==false){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        has_conflicted[i][k]=true;
                        score += board[i][k];
                        updateScore(score);
                        if(score>best_score){
                            updateBestScore(score);
                        }
                        continue;
                    }
                }
            }
        } 
    }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //moveUp
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board)&& has_conflicted[k][j]==false){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        has_conflicted[k][j]=true;
                        score += board[k][j];
                        updateScore(score);
                        if(score>best_score){
                            updateBestScore(score);
                        }
                        continue;
                    }
                }
            }
        } 
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    //moveDown
    for(var i=2;i>-1;i--){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && has_conflicted[k][j]==false){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        has_conflicted[k][j]=true;
                        score += board[k][j];
                        updateScore(score);
                        if(score>best_score){
                            updateBestScore(score);
                        }
                        continue;
                    }
                }
            }
        } 
    }
    setTimeout("updateBoardView()",200);
    return true;
}

